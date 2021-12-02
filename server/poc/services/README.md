# Services

The services in this directory mutate data in the database.  They are
intended to be called from within [controller routes](../controllers).

Database mutations require a database session object and each service
is written as a function which takes an optional `db_session`
argument.  This makes it easy to test these services by injecting a
mock database session object.

Services are free to add and delete objects to the session, but they
**should not** commit the session.
