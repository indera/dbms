import time
from flask import Flask

import utils

from pprint import pprint
import json
import decimal, datetime


app = Flask(__name__)
conn = utils.get_connection_oracle()


@app.route('/login')
def login():
    return {'status': 'success', 'loginTime': time.time()}

@app.route('/getTransactionDetails')
def getTransactionDetails():
    data = conn.execute("SELECT * FROM DMELISSO.ACCOUNT JOIN DMELISSO.TRANSACTIONS ON DMELISSO.TRANSACTIONS.ACCOUNT_ID=DMELISSO.ACCOUNT.ACCOUNT_ID NATURAL JOIN DMELISSO.DISPOSITION NATURAL JOIN DMELISSO.CLIENT").fetchmany(100)
    # "SELECT * FROM DMELISSO.ACCOUNT JOIN DMELISSO.TRANSACTIONS ON DMELISSO.TRANSACTIONS.ACCOUNT_ID=DMELISSO.ACCOUNT.ACCOUNT_ID NATURAL JOIN DMELISSO.DISPOSITION NATURAL JOIN DMELISSO.CLIENT"
    pprint(data)
    return json.dumps([dict(r) for r in data], default=alchemyencoder)




def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
