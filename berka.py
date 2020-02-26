#!/usr/bin/env python3
"""
This script is used to create the SQL tables
and import the rows for the `berka` dataset

Note: to add your username/password you need
    to copy and modify the template file first

    $ cp config/settings.py.template config/settings.py
    $ vim config/settings.py
"""

import utils

def main():
    conn = utils.get_connection_oracle()
    utils.load_data(conn)


if __name__ == '__main__':
    main()
