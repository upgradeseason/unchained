# Migrations

Alembic is used for defining [migration versions](./versions).

To migrate the application database to a new version, make changes to [models](../poc/models) and then run

```
$ docker-compose run server pipenv run flask db migrate -m "Migration Name" --rev-id N
```

where `N` is the next sequential migration version number.

You'll want to inspect and hand-edit the produced migration file -- it
usually needs it.

To apply migrations, run 

```
$ docker-compose run server pipenv run flask db upgrade
```

Having run your migration, you may again want to run the `flask db
migrate` command to verify it sees no further required changes.
