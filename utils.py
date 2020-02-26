"""
This script stores the helper functions

@see https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html
"""
import pandas as pd
from sqlalchemy import create_engine
from pprint import pprint
from config.settings import DB_USER, DB_PASS, DB_HOST, DB_SID

import logging
# logging.basicConfig(level=logging.INFO)
logging.basicConfig(filename='berka.log', level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

NROWS = None
CHUNK_SIZE = 200

def get_connection_mysql():
    # not used
    DB_USER = 'root'
    DB_PASS = 'sharpspring'
    DB_HOST = 'app.sharpspring.localhost.com'
    DB_NAME = 'berka'

    dsn = "mysql+pymysql://{}:{}@{}/{}".format(DB_USER, DB_PASS, DB_HOST, DB_NAME)
    engine = create_engine(dsn, pool_recycle=3600)
    return engine


def get_connection_oracle():
    # https://docs.sqlalchemy.org/en/13/dialects/oracle.html
    dsn = "oracle+cx_oracle://{}:{}@{}/{}".format(DB_USER, DB_PASS, DB_HOST, DB_SID)

    try:
        # https://github.com/pandas-dev/pandas/issues/8953
        conn = create_engine(dsn,
                             max_identifier_length=128,
                             pool_size=10,
                             max_overflow=5,
                             pool_recycle=3600)
        return conn
    except Exception as exc:
        log.error('Failed to create db connection due: {}'.format(exc))
        return None


"""
desc account;
+--------------+---------------------+------+-----+------------+----------------+
| Field        | Type                | Null | Key | Default    | Extra          |
+--------------+---------------------+------+-----+------------+----------------+
| account_id   | bigint(20) unsigned | NO   | PRI | NULL       | auto_increment |
| district_id  | bigint(20) unsigned | NO   | MUL | NULL       |                |
| frequency    | char(2)             | NO   |     | NULL       |                |
| created_date | date                | NO   | MUL | 0000-00-00 |                |
+--------------+---------------------+------+-----+------------+----------------+
"""

def load_account(conn, filename):
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    df['date'] = pd.to_datetime(df['date'], format="%y%m%d")
    df.rename(columns={"date": "created_date"}, inplace=True)
    df.sort_values(by=['account_id'], inplace=True)

    log.info("columns: {}".format(df.columns))

    """
    Replace `frequency` strings with abbreviations

    - POPLATEK MESICNE changed to MONTHLY ISSUANCE (MO)
    - POPLATEK TYDNE changed to WEEKLY ISSUANCE (WE)
    - POPLATEK PO OBRATU change to ISSUANCE AFTER TRANSACTION (AT)
    """

    df['frequency'].replace({'POPLATEK MESICNE': 'MO'}, inplace=True)
    df['frequency'].replace({'POPLATEK TYDNE': 'WE'}, inplace=True)
    df['frequency'].replace({'POPLATEK PO OBRATU': 'AT'}, inplace=True)

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    df.to_sql('account', con=conn, if_exists='append', index=False, chunksize=CHUNK_SIZE)
    log.info('Finished data import for: {}'.format(filename))

    data = conn.execute("SELECT * FROM account WHERE ROWNUM <= 10").fetchall()
    pprint(data)


def load_order(conn, filename):
    # TODO: finish
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    log.info("columns: {}".format(df.columns))

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    df.to_sql('order', con=conn, if_exists='append', index=False)
    log.info('Finished data import for: {}'.format(filename))


def load_data(conn):
    log.info('load_data...')
    load_account(conn, 'data/account.asc')
    # load_order(conn, 'data/order.asc')
