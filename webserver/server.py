#!/usr/bin/env python2.7

"""
Columbia's COMS W4111.001 Introduction to Databases
Example Webserver

To run locally:

    python server.py

Go to http://localhost:8111 in your browser.

A debugger such as "pdb" may be helpful for debugging.
Read about it online.
"""

import os
import json
from sqlalchemy import *
from sqlalchemy.pool import NullPool
from flask import Flask, request, render_template, g, redirect, Response

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir)


#
# The following is a dummy URI that does not connect to a valid database. You will need to modify it to connect to your Part 2 database in order to use the data.
#
# XXX: The URI should be in the format of: 
#
#     postgresql://USER:PASSWORD@w4111a.eastus.cloudapp.azure.com/proj1part2
#
# For example, if you had username gravano and password foobar, then the following line would be:
#
#     DATABASEURI = "postgresql://gravano:foobar@w4111a.eastus.cloudapp.azure.com/proj1part2"
#
DATABASEURI = "postgresql://ac3877:verbose@w4111a.eastus.cloudapp.azure.com/proj1part2"


#
# This line creates a database engine that knows how to connect to the URI above.
#
engine = create_engine(DATABASEURI)


@app.before_request
def before_request():
  """
  This function is run at the beginning of every web request 
  (every time you enter an address in the web browser).
  We use it to setup a database connection that can be used throughout the request.

  The variable g is globally accessible.
  """
  try:
    g.conn = engine.connect()
  except:
    print "uh oh, problem connecting to database"
    import traceback; traceback.print_exc()
    g.conn = None

@app.teardown_request
def teardown_request(exception):
  """
  At the end of the web request, this makes sure to close the database connection.
  If you don't, the database could run out of memory!
  """
  try:
    g.conn.close()
  except Exception as e:
    pass


#
# @app.route is a decorator around index() that means:
#   run index() whenever the user tries to access the "/" path using a GET request
#
# If you wanted the user to go to, for example, localhost:8111/foobar/ with POST or GET then you could use:
#
#       @app.route("/foobar/", methods=["POST", "GET"])
#
# PROTIP: (the trailing / in the path is important)
# 
# see for routing: http://flask.pocoo.org/docs/0.10/quickstart/#routing
# see for decorators: http://simeonfranklin.com/blog/2012/jul/1/python-decorators-in-12-steps/
#
@app.route('/')
def index():
  """
  request is a special object that Flask provides to access web request information:

  request.method:   "GET" or "POST"
  request.form:     if the browser submitted a form, this contains the data in the form
  request.args:     dictionary of URL arguments, e.g., {a:1, b:2} for http://localhost?a=1&b=2

  See its API: http://flask.pocoo.org/docs/0.10/api/#incoming-request-data
  """
  script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
  rel_path = "queries/vehicle_class.sql"
  abs_file_path = os.path.join(script_dir, rel_path)
  f = open(abs_file_path, 'r')
  query = f.read()
  f.close()
  cursor = g.conn.execute(query.rstrip())
  rates = []
  for row in cursor:
    rates.append(list(row))
  data = {'rates':rates}
  return render_template("index.html", data=data)




@app.route('/reservations')
def reservations():
  user_id = request.args.get('id')
  print user_id
  return render_template("reservations.html")

@app.route('/drivers') 
def drivers():
  user_id = request.args.get('id')
  print user_id
  # for reference, column indices are: 0=name, 1=phone, 2=date, 3=time, 4=type, 5=distance, 6=pick_addr, 7=drop_add, 8=est_amount, 9=tid
  query = "SELECT P.name, P.phone, to_char(T.date, \'YYYY-MM-DD\') AS date, to_char(T.time, \'HH:MI:SS\') AS time, T.type, T.distance, T.pick_addr, T.drop_addr, " + \
    "T.est_amount, T.tid FROM Trips T, Passengers P WHERE T.driver={} AND T.passenger = P.uid AND T.status!=\'completed\' ORDER BY T.date, T.time".format(user_id)
  cursor = g.conn.execute(query.rstrip())
  reservations = []
  for row in cursor: 
    reservations.append(list(row))
  data = {'reservations':reservations}
  return render_template("drivers.html", data=data)  


if __name__ == "__main__":
  import click

  @click.command()
  @click.option('--debug', is_flag=True)
  @click.option('--threaded', is_flag=True)
  @click.argument('HOST', default='0.0.0.0')
  @click.argument('PORT', default=8111, type=int)
  def run(debug, threaded, host, port):
    """
    This function handles command line parameters.
    Run the server using:

        python server.py

    Show the help text using:

        python server.py --help

    """

    HOST, PORT = host, port
    print "running on %s:%d" % (HOST, PORT)
    app.run(host=HOST, port=PORT, debug=debug, threaded=threaded)


  run()
