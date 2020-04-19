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
def num_cards_issued(min_age=0, region_name=None):
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
