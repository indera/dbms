# This file stores helpers for parsing database rows
from pprint import pprint

import json
import decimal
import datetime
import utils


conn = utils.get_connection_oracle()

def fetch_data_as_json(sql, num_rows=None, debug=False):
    if num_rows is None:
        data = conn.execute(sql).fetchmany(num_rows)
    else:
        data = conn.execute(sql).fetchmany()

    if debug:
        pprint(data)

    return json.dumps([dict(r) for r in data], default=alchemyencoder)

def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
