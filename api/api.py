import time
from flask import Flask

import utils

from pprint import pprint
import json
import decimal, datetime
from flask_deprecate import deprecate_route

app = Flask(__name__)
conn = utils.get_connection_oracle()


@app.route('/api/login')
def login():
    return {'status': 'success', 'loginTime': time.time()}

@deprecate_route("Test API")
@app.route('/api/getTransactionDetails')
def getTransactionDetails():
    sqlQueryStr = """
SELECT
    *
FROM
    DMELISSO.ACCOUNT A
    JOIN DMELISSO.TRANSACTIONS T ON T.ACCOUNT_ID=A.ACCOUNT_ID
    NATURAL JOIN DMELISSO.DISPOSITION D
    NATURAL JOIN DMELISSO.CLIENT C FETCH NEXT 100 ROWS ONLY
"""
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData

@app.route('/api/getSumTransBalanceMonthByGender')
def getQuery1Details():
    sqlQueryStr = """
    SELECT
        c.gender,
        SUM(t.balance) AS SUM_of_balance,
        TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month
    FROM
        dmelisso.client c
        JOIN dmelisso.disposition d ON c.client_id = d.client_id
        JOIN dmelisso.transactions t ON t.account_id = d.account_id
    GROUP BY
        gender,
        TO_CHAR(created_DATE, 'YYYY-MM')
    ORDER BY
        gender,
        TO_CHAR(created_DATE, 'YYYY-MM')"""
    jsonData = fetchDataInJson(sqlQueryStr, 200)
    return jsonData

def getQuery2Details():
    sqlQueryStr = """
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
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData

@app.route('/api/getTransTrendUrbanNonUrban')
def getQuery5_1Details():
    sqlQueryStr = """
    SELECT count(trans_id) as TRANS_NUM, URBAN_RANK, MONTH_INTERVAL
    FROM (SELECT TRANS_ID,
             NTILE(2) OVER (ORDER BY RATIO_URBAN DESC)                                  AS URBAN_RANK,
             EXTRACT(MONTH FROM CREATED_DATE) || '-' || EXTRACT(YEAR FROM CREATED_DATE) AS MONTH_INTERVAL
      FROM DMELISSO.TRANSACTIONS
               NATURAL JOIN DMELISSO.ACCOUNT
               NATURAL JOIN DMELISSO.DISPOSITION
               NATURAL JOIN DMELISSO.CLIENT
               NATURAL JOIN DMELISSO.DISTRICT_DETAIL) T
    group by MONTH_INTERVAL, URBAN_RANK ORDER BY MONTH_INTERVAL"""
    jsonData = fetchDataInJson(sqlQueryStr, 200)
    return jsonData

@app.route('/api/getTransTrendOfIncomeWiseGroupedDistricts')
def getQuery5_2Details():
    sqlQueryStr = """
    SELECT count(trans_id) as TRANS_NUM, INCOME_GROUP_RANK, MONTH_INTERVAL
    FROM (SELECT TRANS_ID,
                 NTILE(3) OVER (ORDER BY SALARY_AVERAGE DESC)                               AS INCOME_GROUP_RANK,
                 EXTRACT(MONTH FROM CREATED_DATE) || '-' || EXTRACT(YEAR FROM CREATED_DATE) AS MONTH_INTERVAL
          FROM DMELISSO.TRANSACTIONS
                   NATURAL JOIN DMELISSO.ACCOUNT
                   NATURAL JOIN DMELISSO.DISPOSITION
                   NATURAL JOIN DMELISSO.CLIENT
                   NATURAL JOIN DMELISSO.DISTRICT_DETAIL) T
    group by MONTH_INTERVAL, INCOME_GROUP_RANK  ORDER BY MONTH_INTERVAL"""
    jsonData = fetchDataInJson(sqlQueryStr, 200)
    return jsonData

@app.route('/api/getCardUsageTrendByType')
def getQuery5_3Details():
    sqlQueryStr = """
    SELECT count(trans_id) as TRANS_NUM, CARD_TYPE, MONTH_INTERVAL
    FROM (SELECT TRANS_ID,
                 C.TYPE                                                                     as card_type,
                 EXTRACT(MONTH FROM CREATED_DATE) || '-' || EXTRACT(YEAR FROM CREATED_DATE) AS MONTH_INTERVAL
          FROM DMELISSO.TRANSACTIONS T
                   JOIN DMELISSO.DISPOSITION D ON D.ACCOUNT_ID = T.ACCOUNT_ID
                   JOIN DMELISSO.CARD C ON D.DISP_ID = C.DISP_ID) T
    group by MONTH_INTERVAL, CARD_TYPE  ORDER BY MONTH_INTERVAL"""
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData


@app.route('/api/getTransactionTrendByAmount')
def getQuery5_4Details():
    sqlQueryStr = """
    SELECT count(trans_id) as TRANS_NUM, TRANS_AMOUNT_RANK, MONTH_INTERVAL
    FROM (SELECT TRANS_ID,
                 NTILE(3) OVER (ORDER BY AMOUNT DESC)                                       AS TRANS_AMOUNT_RANK,
                 EXTRACT(MONTH FROM CREATED_DATE) || '-' || EXTRACT(YEAR FROM CREATED_DATE) AS MONTH_INTERVAL
          FROM DMELISSO.TRANSACTIONS
                   NATURAL JOIN DMELISSO.ACCOUNT
                   NATURAL JOIN DMELISSO.DISPOSITION
                   NATURAL JOIN DMELISSO.CLIENT
                   NATURAL JOIN DMELISSO.DISTRICT_DETAIL) T
    group by MONTH_INTERVAL, TRANS_AMOUNT_RANK ORDER BY MONTH_INTERVAL"""
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData


@app.route('/api/getTransactionTrendByBalanceOfAccountHolder')
def getQuery5_5Details():
    sqlQueryStr = """
    SELECT count(trans_id) as TRANS_NUM, ACCOUNT_BALANCE_RANK, MONTH_INTERVAL
    FROM (SELECT T.TRANS_ID,
                 ACCOUNT_BALANCE_RANK,
                 EXTRACT(MONTH FROM T.CREATED_DATE) || '-' || EXTRACT(YEAR FROM T.CREATED_DATE) AS MONTH_INTERVAL
          FROM (SELECT ACCOUNT_ID,
                       NTILE(3) OVER (ORDER BY AVG_ACCOUNT_BALANCE DESC) AS ACCOUNT_BALANCE_RANK
                FROM (SELECT ACCOUNT_ID,
                             AVG(BALANCE) AS AVG_ACCOUNT_BALANCE
                      FROM DMELISSO.TRANSACTIONS
                      group by ACCOUNT_ID)) ACCOUNT_BALANCE_DETAILS
                   JOIN DMELISSO.TRANSACTIONS T ON ACCOUNT_BALANCE_DETAILS.ACCOUNT_ID = T.ACCOUNT_ID) E
    GROUP BY MONTH_INTERVAL, ACCOUNT_BALANCE_RANK"""
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData


def fetchDataInJson(sqlQueryStr, numRows=100):
    data = conn.execute(sqlQueryStr).fetchmany(numRows)
    pprint(data)
    return json.dumps([dict(r) for r in data], default=alchemyencoder)

def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
