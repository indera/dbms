# This file stores helpers for parsing database rows
from pprint import pprint
import time
import json
import decimal
import datetime
import utils


conn = utils.get_connection_oracle()

def fetch_data_as_json(sql, num_rows=None, debug=False):
    if num_rows is None:
        data = conn.execute(sql).fetchmany()
    else:
        data = conn.execute(sql).fetchmany(num_rows)

    if debug:
        pprint(data)

    return json.dumps([dict(r) for r in data], default=alchemyencoder)


def fetch_data(sql, description, num_rows=None, debug=False):
    """
    :arg sql - the query to execute
    :arg description - the human-friendly summary of the query
    """
    start_time = time.time()

    if num_rows is None:
        data = conn.execute(sql).fetchall()
    else:
        data = conn.execute(sql).fetchmany(num_rows)

    if debug:
        pprint(data)

    elapsed = time.time() - start_time

    return json.dumps(
        {
            'sql': sql,
            'description': description,
            'elapsed': elapsed,
            'rowCount': len(data),
            'rows': [dict(r) for r in data],
        },
        default=alchemyencoder
    )


def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
