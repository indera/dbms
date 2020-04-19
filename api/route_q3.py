
from api.main import app
from api.dbutils import conn

@app.route('/api/test', methods=['GET'])
def test():
    return 'hello'
