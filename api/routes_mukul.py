from api.main import app
from api.dbutils import fetch_data_as_json
import time

# TODO: remove if not used
@app.route('/api/login')
def login():
    return {'status': 'success', 'loginTime': time.time()}


# TODO: remove if not used
@app.route('/api/getTransactionDetails')
def getTransactionDetails():
    sql = """
SELECT
    *
FROM
    DMELISSO.ACCOUNT A
    JOIN DMELISSO.TRANSACTIONS T ON T.ACCOUNT_ID=A.ACCOUNT_ID
    NATURAL JOIN DMELISSO.DISPOSITION D
    NATURAL JOIN DMELISSO.CLIENT C
    FETCH NEXT 100 ROWS ONLY
"""
    json_data = fetch_data_as_json(sql)
    return json_data

@app.route('/api/getSumTransBalanceMonthByGender')
def getQuery1Details():
    sql = """
    SELECT
        TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month,
        c.gender,
        SUM(t.balance) AS SUM_of_balance
    FROM
        dmelisso.client c
        JOIN dmelisso.disposition d ON c.client_id = d.client_id
        JOIN dmelisso.transactions t ON t.account_id = d.account_id
    GROUP BY
        TO_CHAR(created_DATE, 'YYYY-MM'),
        gender
    ORDER BY
        TO_CHAR(created_DATE, 'YYYY-MM')
    """
    json_data = fetch_data_as_json(sql, 2000)
    return json_data

def getQuery2Details():
    sql = """
SELECT
    c.gender, SUM(t.balance) AS SUM_of_balance, TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month
FROM
    dmelisso.client c
    JOIN dmelisso.disposition d ON c.client_id = d.client_id
    JOIN dmelisso.transactions t ON t.account_id = d.account_id
GROUP BY
    gender, TO_CHAR(created_DATE, 'YYYY-MM')
ORDER BY
    gender, TO_CHAR(created_DATE, 'YYYY-MM')
"""
    json_data = fetch_data_as_json(sql)
    return json_data

@app.route('/api/getTransTrendUrbanNonUrban')
def getQuery5_1Details():
    sql = """
    SELECT count(trans_id) as TRANS_NUM, URBAN_RANK, MONTH_INTERVAL
    FROM (SELECT
            TRANS_ID,
            NTILE(2) OVER (ORDER BY RATIO_URBAN DESC) AS URBAN_RANK,
            TO_DATE(EXTRACT(MONTH FROM CREATED_DATE) || '-' ||EXTRACT(YEAR FROM CREATED_DATE) ,'mm-yyyy') AS MONTH_INTERVAL
        FROM
            DMELISSO.TRANSACTIONS
            NATURAL JOIN DMELISSO.ACCOUNT
            NATURAL JOIN DMELISSO.DISPOSITION
            NATURAL JOIN DMELISSO.CLIENT
            NATURAL JOIN DMELISSO.DISTRICT_DETAIL
        ) T
    GROUP BY
        MONTH_INTERVAL, URBAN_RANK
    ORDER BY
    MONTH_INTERVAL
    """
    json_data = fetch_data_as_json(sql, 2000)
    return json_data

@app.route('/api/getTransTrendOfIncomeWiseGroupedDistricts')
def getQuery5_2Details():
    sql = """
    SELECT count(trans_id) as TRANS_NUM, INCOME_GROUP_RANK, MONTH_INTERVAL
    FROM (SELECT TRANS_ID,
                 NTILE(3) OVER (ORDER BY SALARY_AVERAGE DESC)                               AS INCOME_GROUP_RANK,
                 TO_DATE(EXTRACT(MONTH FROM CREATED_DATE) || '-' ||EXTRACT(YEAR FROM CREATED_DATE) ,'mm-yyyy') AS MONTH_INTERVAL
          FROM DMELISSO.TRANSACTIONS
                   NATURAL JOIN DMELISSO.ACCOUNT
                   NATURAL JOIN DMELISSO.DISPOSITION
                   NATURAL JOIN DMELISSO.CLIENT
                   NATURAL JOIN DMELISSO.DISTRICT_DETAIL) T
    group by MONTH_INTERVAL, INCOME_GROUP_RANK  ORDER BY MONTH_INTERVAL"""
    json_data = fetch_data_as_json(sql, 2000)
    return json_data

@app.route('/api/getCardUsageTrendByType')
def getQuery5_3Details():
    sql = """
    SELECT count(trans_id) as TRANS_NUM, CARD_TYPE, MONTH_INTERVAL
    FROM (SELECT
            TRANS_ID,
            C.TYPE AS card_type,
            TO_DATE(EXTRACT(MONTH FROM CREATED_DATE) || '-' ||EXTRACT(YEAR FROM CREATED_DATE), 'mm-yyyy') AS MONTH_INTERVAL
          FROM
            DMELISSO.TRANSACTIONS T
            JOIN DMELISSO.DISPOSITION D ON D.ACCOUNT_ID = T.ACCOUNT_ID
            JOIN DMELISSO.CARD C ON D.DISP_ID = C.DISP_ID) T
    group by MONTH_INTERVAL, CARD_TYPE  ORDER BY MONTH_INTERVAL"""
    json_data = fetch_data_as_json(sql, 1000)
    return json_data


@app.route('/api/getTransactionTrendByAmount')
def getQuery5_4Details():
    sql = """
    SELECT count(trans_id) as TRANS_NUM, TRANS_AMOUNT_RANK, MONTH_INTERVAL
    FROM (
        SELECT
            TRANS_ID,
            NTILE(3) OVER (ORDER BY AMOUNT DESC)  AS TRANS_AMOUNT_RANK,
            TO_DATE(EXTRACT(MONTH FROM CREATED_DATE) || '-' ||EXTRACT(YEAR FROM CREATED_DATE), 'mm-yyyy') AS MONTH_INTERVAL
        FROM
            DMELISSO.TRANSACTIONS
            NATURAL JOIN DMELISSO.ACCOUNT
            NATURAL JOIN DMELISSO.DISPOSITION
            NATURAL JOIN DMELISSO.CLIENT
            NATURAL JOIN DMELISSO.DISTRICT_DETAIL) T
    GROUP BY
        MONTH_INTERVAL, TRANS_AMOUNT_RANK ORDER BY MONTH_INTERVAL
    """
    json_data = fetch_data_as_json(sql, 1000)
    return json_data


@app.route('/api/getTransactionTrendByBalanceOfAccountHolder')
def getQuery5_5Details():
    sql = """
    SELECT
        COUNT(trans_id) as TRANS_NUM, ACCOUNT_BALANCE_RANK, MONTH_INTERVAL
    FROM (SELECT T.TRANS_ID,
                 ACCOUNT_BALANCE_RANK,
                 TO_DATE(EXTRACT(MONTH FROM CREATED_DATE) || '-' ||EXTRACT(YEAR FROM CREATED_DATE) ,'mm-yyyy') AS MONTH_INTERVAL
          FROM (SELECT ACCOUNT_ID,
                       NTILE(3) OVER (ORDER BY AVG_ACCOUNT_BALANCE DESC) AS ACCOUNT_BALANCE_RANK
                FROM (SELECT ACCOUNT_ID,
                             AVG(BALANCE) AS AVG_ACCOUNT_BALANCE
                      FROM DMELISSO.TRANSACTIONS
                      group by ACCOUNT_ID)) ACCOUNT_BALANCE_DETAILS
                   JOIN DMELISSO.TRANSACTIONS T ON ACCOUNT_BALANCE_DETAILS.ACCOUNT_ID = T.ACCOUNT_ID) E
    GROUP BY
        MONTH_INTERVAL, ACCOUNT_BALANCE_RANK ORDER BY MONTH_INTERVAL
    """
    json_data = fetch_data_as_json(sql, 1000)
    return json_data
