flask:
	# env FLASK_APP=web.py flask run
	env FLASK_APP=api/main.py FLASK_ENV=development flask run

import:
	python berka.py

x:
	dtruss -f -t open python myfile.py
