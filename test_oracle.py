#!/usr/bin/env python3
"""
Simple script to test Oracle python driver

@see
    https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html#quick-start-cx-oracle-installation
    https://blogs.oracle.com/oraclemagazine/perform-basic-crud-operations-using-cx-oracle-part-1
"""

from config import settings
import cx_Oracle
from pprint import pprint


def get_connection():
    dsn = "{}/{}".format(settings.DB_HOST, settings.DB_SID)
    connection = cx_Oracle.connect(settings.DB_USER, settings.DB_PASS, dsn)
    return connection


def create_table(conn):
    cursor = conn.cursor()
    sql = """
        CREATE TABLE student (
            id integer NOT NULL
            , first_name VARCHAR(32) NOT NULL
            , last_name VARCHAR(32) NOT NULL
        , PRIMARY KEY (id)
        )
        """

    try:
        result = cursor.execute(sql)
        pprint("create result: {}".format(result))
    except Exception as exc:
        print("create_table - got exception: {}".format(exc))
    finally:
        cursor.close()


def insert_table(conn):
    cursor = conn.cursor()
    sql = """
    INSERT INTO student (id, first_name, last_name)
    WITH names AS (
        SELECT 1, 'Ruth',     'Fox'         FROM dual UNION ALL
        SELECT 2, 'Isabelle', 'Squirrel'    FROM dual UNION ALL
        SELECT 3, 'Justin',   'Frog'        FROM dual UNION ALL
        SELECT 4, 'Lisa',     'Owl'         FROM dual
    )
    SELECT * FROM names
    """

    try:
        cursor.execute(sql)
        conn.commit()
    except Exception as exc:
        print("insert_table - got exception: {}".format(exc))
    finally:
        cursor.close()


def read_table(conn):
    cursor = conn.cursor()
    sql = """
        SELECT
            id, first_name, last_name
        FROM
            student
        WHERE
            id >= :id
        """

    try:
        cursor.execute(sql, id=2)

        print("read_table:")
        for id, fname, lname in cursor:
            print("\nrow: ", id, fname, lname)

    finally:
        cursor.close()


def main():
    conn = get_connection()
    create_table(conn)
    insert_table(conn)
    read_table(conn)


if __name__ == '__main__':
    main()
