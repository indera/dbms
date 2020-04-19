from flask import Flask
from api.dbutils import fetch_data_as_json
import time

app = Flask(__name__)

@app.route('/api/login')
def login():
    return {'status': 'success', 'loginTime': time.time()}

# https://flask.palletsprojects.com/en/1.1.x/quickstart/
from api import route_q2_details
from api import route_q3

@app.route('/api/getTransactionDetails')
def getTransactionDetails():
    sqlQueryStr = """
SELECT
    *
FROM
    DMELISSO.ACCOUNT A
    JOIN DMELISSO.TRANSACTIONS T ON T.ACCOUNT_ID=A.ACCOUNT_ID
    NATURAL JOIN DMELISSO.DISPOSITION D
    NATURAL JOIN DMELISSO.CLIENT C
    FETCH NEXT 100 ROWS ONLY
"""
    jsonData = fetch_data_as_json(sqlQueryStr)
    return jsonData

@app.route('/api/getSumTransBalanceMonthByGender')
def getQuery1Details():
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
    jsonData = fetch_data_as_json(sqlQueryStr)
    return jsonData


# if __name__ == '__main__':
#     app.run(debug=True, use_reloader=True)
