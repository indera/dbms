"""
This script stores the helper functions

@see
    https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html
    https://oracle-base.com/articles/8i/constraint-checking-updates
    https://stackoverflow.com/questions/42727990/speed-up-to-sql-when-writing-pandas-dataframe-to-oracle-database-using-sqlalch
    https://stackoverflow.com/questions/31997859/bulk-insert-a-pandas-dataframe-using-sqlalchemy
"""
#from pandas.io.sql import SQLTable
#
#def _execute_insert(self, conn, keys, data_iter):
#    print("Using monkey-patched _execute_insert")
#    data = [dict(zip(keys, row)) for row in data_iter]
#    conn.execute(self.table.insert().values(data))
#
#SQLTable._execute_insert = _execute_insert

import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sqlalchemy import types as sqlt
from pprint import pprint
from config.settings import DB_USER, DB_PASS, DB_HOST, DB_SID

import logging
# logging.basicConfig(level=logging.INFO)
logging.basicConfig(filename='berka.log', level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

# NROWS = 200
NROWS = None  # None = All rows
CHUNK_SIZE = 20

TABLE_REGION = 'region'
TABLE_DISTRICT = 'district'
TABLE_ACCOUNT = 'account'
TABLE_ORDER = 'order'
TABLE_TRANSACTION = 'transaction'

# TODO
TABLE_CLIENT = 'client'
TABLE_DISPOSITION = 'disposition'
TABLE_CARD = 'card'

TABLE_LOAN = 'loan'

# change to 1 to process
LOAD_CONFIG = {
    TABLE_REGION: 1,
    TABLE_DISTRICT: 1,
    TABLE_ACCOUNT: 1,
    TABLE_ORDER: 1,
    TABLE_TRANSACTION: 0,
    TABLE_CLIENT: 1,
    TABLE_DISPOSITION: 1,
    TABLE_CARD: 1,
    TABLE_LOAN: 1,
}

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
                             pool_recycle=3600,
                             encoding="UTF-8")
        return conn
    except Exception as exc:
        log.error('Failed to create db connection due: {}'.format(exc))
        return None


# TODO: add lat/long if we find it
def load_region(conn, filename):
    df = pd.read_csv(filename, sep=',', low_memory=False, nrows=NROWS)
    columns = {
        "ID": "region_id",
        "Region": "region_name",
        "Capital": "region_capital",
        "Area": "region_area",
        "Population": "region_population",
        "GDP": "region_gdp",
        "Website": "region_website",
    }
    df.rename(columns=columns, inplace=True)
    df.sort_values(by=['region_id'], inplace=True)

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    log.info(f"columns: {df.columns}")

    df.to_sql('region', con=conn, if_exists='append', index=False, chunksize=CHUNK_SIZE)
    log.info(f'Finished data import for: {filename}')

    data = conn.execute("SELECT * FROM region WHERE ROWNUM <= 20").fetchall()
    pprint(data)


# multiple districts form one region
def load_district(conn, filename):
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    # A1;A2;A3;A4;A5;A6;A7;A8;A9;A10;A11;A12;A13;A14;A15;A16
    # North Bohemia - > Usti nad Labem (7)
    # east Bohemia -> Pardubice (10)
    # west Bohemia -> Karlovy Vary (6)
    # south Moravia -> 13
    # north Moravia -> Moravia-Silesia (12)

    """
a1: This is the district code. The Czech Republic is divided into districts. An integer has been assigned to each of these districts.
a2: This is the district name. We can associate the district number with the district code and the region.
a3: The region in which clients are located.

a4: The number of inhabitants.
a5: Number of municipalities with less than 499 inhabitants.
a6: Number of municipalities with number of inhabitants 500 - 1999.
a7: Number of municipalities with number of inhabitants 2000 - 9999.
a8: Number of municipalities with more than 10000 inhabitants.

a9: Number of cities.
a10: Ratio of urban inhabitants.
a11: Average salary.
a14: Number of entrepreneurs per 1000 inhabitants.

a12: Unemployment rate of 1995.
a13: Unemployment rate of 1996.
a15: Number of crimes committed in 1995.
a16: Number of crimes committed in 1996.
"""
    columns = {
        "A1": "district_id",
        "A2": "district_name",
        "A3": "region_id",

        "A9": "cities",
        "A10": "ratio_urban",
        "A11": "salary_average",
        "A14": "ratio_entrepreneurs",

        "A4": "inhabitants",
        "A5": "municipalities_500",
        "A6": "municipalities_2k",
        "A7": "municipalities_10k",
        "A8": "municipalities_10k_above",

        'A12': 'unempl_1995',
        'A13': 'unempl_1996',
        'A15': 'crimes_1995',
        'A16': 'crimes_1996',

    }
    df.rename(columns=columns, inplace=True)
    df.sort_values(by=['district_id'], inplace=True)

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    log.info(f"columns: {df.columns}")

    df_distr = df[['district_id', 'region_id', 'district_name']]
    df_distr_detail = df[
        ['district_id', 'cities', 'salary_average', 'ratio_urban', 'ratio_entrepreneurs']]
    df_distr_population = df[
        ['district_id', 'inhabitants', 'municipalities_500', 'municipalities_2k',
            'municipalities_10k',
            'municipalities_10k_above']]

    df_distr.to_sql('district', con=conn, if_exists='append', index=False)
    df_distr_detail.to_sql('district_detail', con=conn, if_exists='append', index=False)
    df_distr_population.to_sql('district_population', con=conn, if_exists='append', index=False)

    # split district history for years 1995 and 1996
    df_h1 = df[['district_id', 'unempl_1995', 'crimes_1995']].copy()
    df_h2 = df[['district_id', 'unempl_1996', 'crimes_1996']].copy()
    df_h1['year'] = 1995
    df_h2['year'] = 1996

    # fix column names
    h1_cols = {'unempl_1995': 'ratio_unemployment', 'crimes_1995': 'crimes'}
    h2_cols = {'unempl_1996': 'ratio_unemployment', 'crimes_1996': 'crimes'}
    df_h1.rename(columns=h1_cols, inplace=True)
    df_h2.rename(columns=h2_cols, inplace=True)

    # write both sets to the same table
    log.info('writing district_history 1995...')
    df_h1.to_sql('district_history', con=conn, if_exists='append', index=False)
    log.info('writing district_history 1996...')
    df_h2.to_sql('district_history', con=conn, if_exists='append', index=False)

    log.info(f'Finished data import for: {filename}')
    data = conn.execute("SELECT * FROM district WHERE ROWNUM <= 20").fetchall()
    pprint(data)


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
    """
CREATE TABLE account (
    account_id number NOT NULL,
    district_id number NOT NULL,
    frequency char(2) NOT NULL,
    created_date date NOT NULL,
PRIMARY KEY (account_id),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
) ;
CREATE INDEX created_date ON account(created_date);
    """
    dtype = {
        'account_id': sqlt.Integer,
        'district_id': sqlt.Integer,
        'frequency': sqlt.NCHAR(2),
        'created_date': sqlt.Date,
    }
    df.to_sql('account', con=conn, if_exists='append', index=False, dtype=dtype)
    # df.to_sql('account', con=conn, if_exists='append', index=False)
    log.info('Finished data import for: {}'.format(filename))

    data = conn.execute("SELECT * FROM account WHERE ROWNUM <= 10").fetchall()
    pprint(data)


def load_order(conn, filename):
    # this function writes to the `account_order` table
    # "order_id";"account_id";"bank_to";"account_to";"amount";"k_symbol"
    """
CREATE TABLE account_order (
    order_id number NOT NULL,
    account_id number NOT NULL,
    bank_to char(2) NOT NULL,
    account_to number NOT NULL,
    amount decimal(10,2) NOT NULL,
    category char(3) NOT NULL,
PRIMARY KEY (order_id),
FOREIGN KEY(account_id) REFERENCES account (account_id),
FOREIGN KEY(account_to) REFERENCES account (account_id)
);
"""
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    cols = {'k_symbol': 'category'}
    df.rename(columns=cols, inplace=True)
    log.info("account_order columns: {}".format(df.columns))

    # Apply english appreviations
    #   'POJISTNE'  - INS => stands for Insurance Payment
    #   'SIPO'      - HSE => stands for Household Payment
    #   'LEASING'   - LSE => stands for Leasing Payment
    #   'UVER'      - LOA => stands for Loan Payment
    #   ' '         - UNK => stands for Unknown
    df['category'].replace({'POJISTNE': 'INS'}, inplace=True)
    df['category'].replace({'SIPO': 'HSE'}, inplace=True)
    df['category'].replace({'LEASING': 'LSN'}, inplace=True)
    df['category'].replace({'UVER': 'LOA'}, inplace=True)
    df['category'].replace({' ': 'UNK'}, inplace=True)

    pprint(df)
    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))

    # dtype : dict of column name to SQL type, default None
    dtype = {
        'order_id': sqlt.Integer,
        'account_id': sqlt.Integer,
        'bank_to': sqlt.NCHAR(2),
        'account_to': sqlt.Integer,
        'amount': sqlt.Numeric,
        'category': sqlt.NCHAR(2),
    }
    df.to_sql('account_order', con=conn, if_exists='append', index=False, dtype=dtype)
    log.info('Finished data import for: {}'.format(filename))

def load_transaction(conn, filename):
    """
"trans_id";"account_id";"date";"type";"operation";"amount";"balance";"k_symbol";"bank";"account"

CREATE TABLE transaction (
    trans_id number NOT NULL,
    account_id number NOT NULL,
    created_date date NOT NULL,
    trans_type char(2) NOT NULL, -- CR+=credit, DB=-debit
    operation char(3) NOT NULL,
    amount decimal(10,2) NOT NULL,
    balance decimal(10,2) NOT NULL,
    category char(3) NOT NULL,
    bank_to char(2),
    account_to number,
PRIMARY KEY (trans_id),
FOREIGN KEY(account_id) REFERENCES account (account_id)
);

"""
    # df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    df = pd.read_csv(filename, sep=';', low_memory=False)
    print("== df size: {}".format(len(df)))
    cols = {
        'date': 'created_date',
        'type': 'trans_type',
        'k_symbol': 'category',
        'bank': 'bank_to',
        'account': 'account_to',
    }

    df.rename(columns=cols, inplace=True)
    log.info("{} columns: {}".format(filename, df.columns))

    df['created_date'] = pd.to_datetime(df['created_date'], format="%y%m%d")
    df['trans_type'].replace({'PRIJEM': 'CR'}, inplace=True)  # credit
    df['trans_type'].replace({'VYDAJ': 'DB'}, inplace=True)  # debit
    df['trans_type'].replace({'VYBER': 'DB'}, inplace=True)  # debit

    # operation
    #   PREVOD NA UCET   208283 - remittance to another bank (REM)
    #   PREVOD Z UCTU     65226 - collection from another bank (COL)
    #   VKLAD            156743 - credit in cash (CRE)
    #   VYBER            434918 - withdrawal in cash (WCA)
    #   VYBER KARTOU       8036 - credit card withdrawal (WCC)
    df['operation'].replace({'PREVOD NA UCET': 'REM'}, inplace=True)
    df['operation'].replace({'PREVOD Z UCTU': 'COL'}, inplace=True)
    df['operation'].replace({'VKLAD': 'CRE'}, inplace=True)
    df['operation'].replace({'VYBER': 'WCA'}, inplace=True)
    df['operation'].replace({'VYBER KARTOU': 'WCC'}, inplace=True)

    # category
    #  DUCHOD         30338 - old-age pension
    #  POJISTNE       18500 - insurance payment
    #  SANKC. UROK     1577 - sanction interest if negative balance
    #  SIPO          118065 - household
    #  SLUZBY        155832 - payment for statement
    #  UROK          183114 - interest credited
    #  UVER           13580 -  loan payment
    df['category'].replace({'DUCHOD': 'PEN'}, inplace=True)  # pension
    df['category'].replace({'POJISTNE': 'INS'}, inplace=True)  # insurance
    df['category'].replace({'SANKC. UROK': 'INB'}, inplace=True)  # interest negative balance
    df['category'].replace({'SIPO': 'HSE'}, inplace=True)  # household
    df['category'].replace({'SLUZBY': 'PST'}, inplace=True)  # payment for statement
    df['category'].replace({'UROK': 'INC'}, inplace=True)  # interest credited
    df['category'].replace({'UVER': 'LOA'}, inplace=True)  # loan payment

    # print("operation: {}".format(df.groupby('operation').size()))
    # print("category: {}".format(df.groupby('category').size()))

    df['category'] = df['category'].replace(np.nan, 'UNK')
    df['category'] = df['category'].replace(' ', 'UNK')
    df['category'] = df['category'].replace('', 'UNK')
    df['operation'] = df['operation'].replace(np.nan, 'UNK')
    df['operation'] = df['operation'].replace(' ', 'UNK')
    df['operation'] = df['operation'].replace('', 'UNK')

    print("trans_type: {}".format(df.groupby('trans_type').size()))
    print("operation: {}".format(df.groupby('operation').size()))
    print("category: {}".format(df.groupby('category').size()))

    dtype = {
        'trans_id': sqlt.Integer,
        'account_id': sqlt.Integer,
        'create_date': sqlt.Date,
        'trans_type': sqlt.NCHAR(2),
        'operation': sqlt.NCHAR(3),
        'amount': sqlt.Numeric(10, 2),
        'balance': sqlt.Numeric(10, 2),
        'category': sqlt.NCHAR(3),
        'bank_to': sqlt.NCHAR(2),
        'account_to': sqlt.Integer,
    }

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    # df2 = df.iloc[269000:270000]
    # print("== df2 size: {}".format(len(df2)))
    # df2.to_sql('transaction2', con=conn, if_exists='append', index=False, dtype=dtype, chunksize=200)
    df.to_sql('transaction', con=conn, if_exists='append', index=False, dtype=dtype, chunksize=200)
    log.info('Finished data import for: {}'.format(filename))


def load_client(conn, filename):
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    print("== {} df size: {}".format(filename, len(df)))

    df.to_sql('client', con=conn, if_exists='append', index=False, dtype=dtype, chunksize=200)
    log.info('Finished data import for: {}'.format(filename))

def load_disposition(conn, filename):
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    print("== {} df size: {}".format(filename, len(df)))

    df.to_sql('disposition', con=conn, if_exists='append', index=False, dtype=dtype, chunksize=200)
    log.info('Finished data import for: {}'.format(filename))

def load_card(conn, filename):
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    print("== {} df size: {}".format(filename, len(df)))

    df.to_sql('card', con=conn, if_exists='append', index=False, dtype=dtype, chunksize=200)
    log.info('Finished data import for: {}'.format(filename))




def load_loan(conn, filename):
    """
CREATE TABLE loan (
    loan_id    number         NOT NULL,
    account_id number         NOT NULL,
    loan_date  date           NOT NULL,
    amount    decimal(10, 2) NOT NULL,
    duration   number,
    payments   decimal(10, 2) NOT NULL,
    status     char(1)        NOT NULL,
PRIMARY KEY (loan_id),
FOREIGN KEY(account_id) REFERENCES account (account_id)
);
"""
    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
    print("== loan df size: {}".format(len(df)))

    cols = {
        'date': 'loan_date',
    }
    df.rename(columns=cols, inplace=True)
    log.info("{} columns: {}".format(filename, df.columns))
    df['loan_date'] = pd.to_datetime(df['loan_date'], format="%y%m%d")

    dtype = {
        'loan_id': sqlt.Integer,
        'account_id': sqlt.Integer,
        'loan_date': sqlt.Date,
        'amount': sqlt.Numeric(10, 2),
        'duration': sqlt.Integer,
        'payments': sqlt.Numeric(10, 2),
        'status': sqlt.NCHAR(1),
    }

    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
    df.to_sql('loan', con=conn, if_exists='append', index=False, dtype=dtype)
    log.info('Finished data import for: {}'.format(filename))


#def load_loan(conn, filename):
#    df = pd.read_csv(filename, sep=';', low_memory=False, nrows=NROWS)
#    log.info("columns: {}".format(df.columns))
#
#    log.info('Starting data import for: {} ({} rows)'.format(filename, len(df)))
#    df.to_sql('loan', con=conn, if_exists='replace', index=False)
#    log.info('Finished data import for: {}'.format(filename))


def load_data(conn):
    print(f'load_data according to this config: {LOAD_CONFIG}')

    for key, val in LOAD_CONFIG.items():
        if val and TABLE_REGION == key:
            load_region(conn, 'data/region.csv')

        if val and TABLE_DISTRICT == key:
            load_district(conn, 'data/district.csv')

        if val and TABLE_ACCOUNT == key:
            load_account(conn, 'data/account.asc')

        if val and TABLE_ORDER == key:
            load_order(conn, 'data/order.asc')

        if val and TABLE_TRANSACTION == key:
            load_transaction(conn, 'data/trans.csv')

        if val and TABLE_CLIENT == key:
            load_client(conn, 'data/client.asc')

        if val and TABLE_DISPOSITION == key:
            load_disposition(conn, 'data/disposition.asc')

        if val and TABLE_CARD == key:
            load_card(conn, 'data/card.asc')

        if val and TABLE_LOAN == key:
            load_loan(conn, 'data/loan.asc')
