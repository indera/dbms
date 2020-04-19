from api.main import app
from flask import url_for

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

@app.route('/api')
def api():
    """
    Helper page to list all GET routes
    """
    links = []

    for rule in app.url_map.iter_rules():
        # Kep only GET routes that do not require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            # links.append((url, rule.endpoint))
            links.append(url)

    links = sorted(links, reverse=False)
    links_li = ['<li><a href="{}">{}</a></li>'.format(x, x) for x in links]
    body = '<ul>{}</ul>'.format("\n".join(links_li))

    return f"""
    <html>
        <head>
            <title> List of API endpoints </title>
        </head>
        <body>
            {body}
        </body>
    </html>
    """
