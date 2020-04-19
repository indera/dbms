from api.main import app
from api.dbutils import fetch_data

@app.route('/api/tableStats')
def table_stats():
    description = "This query returns the number of rows in each table"
    sql = """
SELECT           'ACCOUNT' table_name, COUNT(*) num_rows FROM dmelisso.ACCOUNT
UNION ALL SELECT 'ORDER', COUNT(*) FROM dmelisso.ORDERS
UNION ALL SELECT 'REGION_FULL', COUNT(*) FROM dmelisso.REGION_FULL
UNION ALL SELECT 'DISTRICT', COUNT(*) FROM dmelisso.DISTRICT
UNION ALL SELECT 'DISTRICT_DETAIL', COUNT(*) FROM dmelisso.DISTRICT_DETAIL
UNION ALL SELECT 'DISTRICT_HISTORY', COUNT(*) FROM dmelisso.DISTRICT_HISTORY
UNION ALL SELECT 'DISTRICT_POPULATION', COUNT(*) FROM dmelisso.DISTRICT_POPULATION
UNION ALL SELECT 'TRANSACTIONS', COUNT(*) FROM dmelisso.TRANSACTIONS
UNION ALL SELECT 'CLIENT', COUNT(*) FROM dmelisso.CLIENT
UNION ALL SELECT 'CARD', COUNT(*) FROM dmelisso.CARD
UNION ALL SELECT 'DISPOSITION', COUNT(*) FROM dmelisso.DISPOSITION
    """
    return fetch_data(sql, description)


@app.route('/api/getNumCardsIssued/')
@app.route('/api/getNumCardsIssued/<min_age>')
@app.route('/api/getNumCardsIssued/<min_age>/<region_name>')
def card_stats(min_age=0, region_name=None):
    # From q2
    description = "This query returns the number of cards issued. Filters: min_age, region_name"
    where_region = ''

    if region_name is not None:
        # add extra restriction
        where_region = f" AND region_name = '{region_name}'"

    # TODO: select AVG(INHABITANTS) AVG_IHABITANTS
    sql = f"""
SELECT
    TO_CHAR(issued, 'YYYY-MM') month
    , COUNT(*) num_rows
FROM
    dmelisso.CARD cr
    JOIN dmelisso.DISPOSITION d ON d.disp_id = cr.disp_id
    JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
    JOIN dmelisso.DISTRICT dist ON dist.DISTRICT_ID = c.DISTRICT_ID
    LEFT JOIN dmelisso.REGION_FULL r ON r.REGION_ID = dist.REGION_ID
WHERE
    1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) > {min_age}
    {where_region}
GROUP BY
    TO_CHAR(issued, 'YYYY-MM')
ORDER BY
    1
    """
    return fetch_data(sql, description)


@app.route('/api/getLoanAvgCountForAgeGroups')
def loan_stats():
    # From q3
    description = """
    This query returns the average loan monthy payment, and the number of loans issued
    each month for different age groups"""

    # Note: includes even the months without data
    sql = """
SELECT
    X.AGE_GROUP, X.MONTH, Y.AVG_PAYMENTS, Y.NUM_LOANS FROM (
                  SELECT *
                  FROM (SELECT 'g60' AGE_GROUP FROM DUAL
                        UNION ALL SELECT 'g30-60' FROM DUAL
                        UNION ALL SELECT 'g0-30' FROM DUAL
                      ) GRP
                    CROSS JOIN
                    (
                           WITH t as (
                               select date '1993-07-05' init, date '1998-12-08' final
                               from dual
                           )
                           select to_char(add_months(trunc(init, 'mm'), level - 1), 'RRRR-MM') MONTH
                           from t
                           connect by level <= months_between(final, init) + 1
                    )
                  ORDER BY GRP.AGE_GROUP, MONTH
              ) X
    LEFT JOIN
    (
        -- average payments for age groups
        SELECT CASE
                   WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 60 THEN 'g60'
                   WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 30 THEN 'g30-60'
                   ELSE 'g0-30'
            END                               AS AGE_GROUP
             , TO_CHAR(START_DATE, 'YYYY-MM') AS LOAN_CREATED_MONTH
             , AVG(PAYMENTS)                  AS AVG_PAYMENTS
             , COUNT(*)                       AS NUM_LOANS
             -- , AVG(AMOUNT)                    AS AVG_AMOUNT
             -- , AVG(DURATION) AS AVG_DURATION
        FROM dmelisso.LOAN L
                 JOIN dmelisso.DISPOSITION D ON D.account_id = L.account_id
                 JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
        WHERE
          -- can filter by age at the time of data collection
            1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) > 10
          AND D.TYPE = 'OWNER'
        GROUP BY CASE
                     WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 60 THEN 'g60'
                     WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 30 THEN 'g30-60'
                     ELSE 'g0-30'
            END
               , TO_CHAR(START_DATE, 'YYYY-MM')
        ORDER BY 1, 2
    ) Y ON Y.AGE_GROUP = X.AGE_GROUP AND Y.LOAN_CREATED_MONTH = X.MONTH
ORDER BY X.AGE_GROUP, X.MONTH
"""
    return fetch_data(sql, description)

