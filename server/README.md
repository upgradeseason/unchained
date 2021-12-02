# Proof-of-Code Server

This is a Flask application which implements a JSON API for
consumption by the frontend React application.

The main libraries used are Flask-SQLAlchemy and psycopg2 which
together allow using PostgreSQL for application data.

Since the application's specs are quite simple, the application only
requires a few tables to store its data model, see the
[models](./poc/models) directory for the corresponding SQLAlchemy
model definitions.

Alembic is used for defining [migrations](./migrations) to these data
models.

There are only a handful of [controller routes](./poc/controllers)
which together implement the simple API the application requires.

Testing is done through `pytest`.
