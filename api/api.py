import time
from flask import Flask

import utils

from pprint import pprint
import json
import decimal, datetime


app = Flask(__name__)
conn = utils.get_connection_oracle()


@app.route('/api/login')
def login():
    return {'status': 'success', 'loginTime': time.time()}

@app.route('/api/getTransactionDetails')
def getTransactionDetails():
    sqlQueryStr = "SELECT * FROM DMELISSO.ACCOUNT A JOIN DMELISSO.TRANSACTIONS T ON T.ACCOUNT_ID=A.ACCOUNT_ID NATURAL JOIN DMELISSO.DISPOSITION D NATURAL JOIN DMELISSO.CLIENT C FETCH NEXT 100 ROWS ONLY"
    #"SELECT * FROM DMELISSO.ACCOUNT A JOIN DMELISSO.TRANSACTIONS T ON T.ACCOUNT_ID=A.ACCOUNT_ID NATURAL JOIN DMELISSO.DISPOSITION D NATURAL JOIN DMELISSO.CLIENT C ORDER BY T.CREATED_DATE FETCH NEXT 100 ROWS ONLY"
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData

@app.route('/api/getSumTransBalanceMonthByGender')
def getQuery1Details():
    sqlQueryStr = "SELECT c.gender, SUM(t.balance) AS SUM_of_balance, TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month FROM dmelisso.client c JOIN dmelisso.disposition d ON c.client_id = d.client_id JOIN dmelisso.transactions t ON t.account_id = d.account_id GROUP BY gender, TO_CHAR(created_DATE, 'YYYY-MM') ORDER BY gender, TO_CHAR(created_DATE, 'YYYY-MM')"
    jsonData = fetchDataInJson(sqlQueryStr)
    return jsonData

def getQuery2Details():
    sqlQueryStr = "SELECT c.gender, SUM(t.balance) AS SUM_of_balance, TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month FROM dmelisso.client c JOIN dmelisso.disposition d ON c.client_id = d.client_id JOIN dmelisso.transactions t ON t.account_id = d.account_id GROUP BY gender, TO_CHAR(created_DATE, 'YYYY-MM') ORDER BY gender, TO_CHAR(created_DATE, 'YYYY-MM')"
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
