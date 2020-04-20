# Intro

This repository stores code developed for the Spring 2020 DBMS class @ University of Florida

# Group 25 members

- Shangde Gao - gao.shangde@ufl.edu
- Srija Gurijala - srijagurijala@ufl.edu
- Dimitrios Melissourgos - dmelissourgos@ufl.edu
- Andrei Sura - asura@ufl.edu
- Mukul Yadav - mchand.yadav@ufl.edu


# Contributing

    - Login/CreateAccount @ github.com
    - fork the repo https://github.com/indera/dbms
    - clone the fork
        git clone git@github.com:YOUR_USERNAME/dbms.git
    - write code
    - create pull request


## Git ssh key

https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

    $ eval "$(ssh-agent -s)"
    $ ssh-add -K ~/.ssh/id_rsa


# Setup

- install python --> see https://realpython.com/installing-python/

- check if python is installed

    $ python --version
        ==> Python 3.7.6

- create a virtual environment

    $ python3 -m venv env

- activate the virtual environment

    $ source ./env/bin/activate

- install dependencies

    $ pip install -r requirements.txt

- configure the two values in config/settings.py

    $ cp config/settings.py.template config/settings.py

- run a simple test (creates table `student` and inserts/reads data)

    $ python test_oracle.py


# Run Flask App to provide API service
    
    cd api && flask run --no-debugger
    

# Sqlalchemy info

    https://docs.sqlalchemy.org/en/13/dialects/oracle.html

## Oracle Instant client lib installation info

    https://oracle.github.io/odpi/doc/installation.html


# Import Czech Bank Financial Data (aka berka dataset)

- Download the zip filefrom http://lisp.vse.cz/pkdd99/berka.htm and extract it to the `dbms/data` folder

- Create the tables using the file: `schema/create_oracle.sql`

- Run the import

    $ python berka.py


# Help
    consult@cise.ufl.edu
    https://it.cise.ufl.edu/wiki/Main_Page

# TODO

- Add foreign key constraints

- Add support to create the tables automatically

    $ python berka.py --create


- Print some basic table stats (number of rows, date ranges covered...)

    $ python berka.py --stats 


