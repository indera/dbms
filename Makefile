run:
	python berka.py

x:
	dtruss -f -t open python myfile.py

flask:
	env FLASK_APP=web.py flask run
