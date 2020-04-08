from flask import Flask, escape, request

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/stats')
def stats():
    name = request.args.get("table", None)

    if name is not None:
        return f'Table {escape(table)} stats'

    return 'All tables...'
