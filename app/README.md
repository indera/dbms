
# Create app

    $ brew install yarn
    $ yarn --version 
        1.22.4
    $ node --version
        v12.16.2

    $ yarn global add create-react-app
    $ create-react-app app --template typescript

    # Success! Created app at /Volumes/dev/dbms/app/http/web/app
    # Inside that directory, you can run several commands:

    #   yarn start
    #     Starts the development server.

    #   yarn build
    #     Bundles the app into static files for production.

    #   yarn test
    #     Starts the test runner.

    #   yarn eject
    #     Removes this tool and copies build dependencies, configuration files
    #     and scripts into the app directory. If you do this, you can’t go back!

    # We suggest that you begin by typing:

    #   cd app
    #   yarn start

    # Happy hacking!


# GYP error

    https://stackoverflow.com/questions/18425379/how-to-set-pythons-default-version-to-3-x-on-os-x

    $ lsa /usr/local/bin/python
    lrwxr-xr-x  1 andreisura  admin    38B Feb  6 01:17 /usr/local/bin/python -> ../Cellar/python@2/2.7.17_1/bin/python

    $ unlink /usr/local/bin/python
    ln -s /usr/local/bin/python3 /usr/local/bin/python


