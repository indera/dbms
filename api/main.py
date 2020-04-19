# flake8: noqa
from flask import Flask

# https://flask.palletsprojects.com/en/1.1.x/quickstart/
app = Flask(__name__)

# Please do not modify this file, modify the modules listed below instead
from api import routes_extra
from api import routes_mukul
from api import routes_andrei
from api import routes_dimitri
from api import routes_srija
from api import routes_shangde
