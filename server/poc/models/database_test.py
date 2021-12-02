from poc.database import DB
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker
from unittest import TestCase

# global application scope.  create Session class, engine
Session = sessionmaker()

class DatabaseTest():
    def setup(self):
        # connect to the database
        self.connection = DB.engine.connect()

        # begin a non-ORM transaction
        self.trans = self.connection.begin()


        # bind an individual Session to the connection
        self.db_session = Session(bind=self.connection)


        ###    optional     ###

        # if the database supports SAVEPOINT (SQLite needs special
        # config for this to work), starting a savepoint
        # will allow tests to also use rollback within tests

        self.nested = self.connection.begin_nested()

        @event.listens_for(self.db_session, "after_transaction_end")
        def end_savepoint(session, transaction):
            if not self.nested.is_active:
                self.nested = self.connection.begin_nested()

        ### ^^^ optional ^^^ ###


    def teardown(self):
        self.db_session.close()

        # rollback - everything that happened with the
        # Session above (including calls to commit())
        # is rolled back.
        self.trans.rollback()

        # return connection to the Engine
        self.connection.close()
