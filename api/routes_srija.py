from api.main import app
from api.dbutils import fetch_data

sql2 = """
SELECT
    D.TYPE
    , R.REGION_NAME
    , count(*) AS num_accounts
    , TO_CHAR(A.CREATED_DATE, 'YYYY-MM') month
FROM
    dmelisso.DISPOSITION D
    JOIN dmelisso.ACCOUNT A ON A.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.CLIENT C ON C.CLIENT_ID = A.ACCOUNT_ID
    JOIN dmelisso.DISTRICT D ON D.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.REGION_FULL R ON R.REGION_ID = D.REGION_ID
GROUP BY
    D.TYPE, R.REGION_NAME, TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
ORDER BY
    D.TYPE, R.REGION_NAME, TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
"""

@app.route('/api/getNumAccountsOpenByDispositionAndRegion')
def num_accounts_for_dispositions():
    # From q4
    description = "Number of accounts open for disposition types (owner/disponent) and region"
    sql = """
SELECT
    R.REGION_NAME
    , count(*) AS num_accounts
    , TO_CHAR(A.CREATED_DATE, 'YYYY-MM') month
FROM
    dmelisso.DISPOSITION D
    JOIN dmelisso.ACCOUNT A ON A.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.CLIENT C ON C.CLIENT_ID = A.ACCOUNT_ID
    JOIN dmelisso.DISTRICT D ON D.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.REGION_FULL R ON R.REGION_ID = D.REGION_ID
WHERE
    D.TYPE = 'OWNER'
GROUP BY
    TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
    , R.REGION_NAME
ORDER BY
    TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
"""
    json_data = fetch_data(sql, description)
    return json_data

@app.route('/api/getNumAccountsOpenByDispositionAndRegionDisponent')
def num_accounts_for_dispositions_disp():
    # From q4
    description = "Number of accounts open for disposition types (owner/disponent) and region"
    sql = """
SELECT
    R.REGION_NAME
    , count(*) AS num_accounts
    , TO_CHAR(A.CREATED_DATE, 'YYYY-MM') month
FROM
    dmelisso.DISPOSITION D
    JOIN dmelisso.ACCOUNT A ON A.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.CLIENT C ON C.CLIENT_ID = A.ACCOUNT_ID
    JOIN dmelisso.DISTRICT D ON D.ACCOUNT_ID = A.ACCOUNT_ID
    JOIN dmelisso.REGION_FULL R ON R.REGION_ID = D.REGION_ID
WHERE
    D.TYPE = 'DISPONENT'
GROUP BY
    TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
    , R.REGION_NAME
ORDER BY
    TO_CHAR(A.CREATED_DATE, 'YYYY-MM')
"""
    json_data = fetch_data(sql, description)
    return json_data
