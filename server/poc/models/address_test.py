
from .address import Address
from .database_test import DatabaseTest
import pytest
from sqlalchemy.exc import DataError, IntegrityError

@pytest.mark.database
class TestAddressModel(DatabaseTest):

    def test_add_address(self):
        # use the session in tests.

        self.db_session.add(
            Address(
                value='03asdfasdfasdfasdf',
                testnet=False,
            )
        )
        self.db_session.commit()

    def test_address_too_long(self):

        self.db_session.add(
            Address(
                value='a'*91,
                testnet=False,
            )
        )
        with pytest.raises(DataError):
            self.db_session.flush()


    def test_address_value_unique(self):

        self.db_session.add(
            Address(
                value='asdfasdfasdf',
                testnet=False,
            )
        )
        self.db_session.commit()
        self.db_session.add(
            Address(
                value='asdfasdfasdf',
                testnet=True,
            )
        )
        with pytest.raises(IntegrityError):
            self.db_session.flush()

@pytest.mark.database
class TestAddressModelSearchAndFetch(DatabaseTest):
    def setup(self):
        DatabaseTest.setup(self)

        self.db_session.add(Address(value='asdf', testnet=False))
        self.db_session.add(Address(value='asdr', testnet=False))
        self.db_session.add(Address(value='asdv', testnet=True))
        self.db_session.add(Address(value='asdg', testnet=True))

        self.db_session.commit()

    def test_search_all(self):
        assert (
            { a.value for a in Address.search(db_session=self.db_session) }
            ==
            { 'asdf', 'asdr', 'asdv', 'asdg' }
        )

    def test_search_not_testnet(self):
        assert (
            { a.value for a in Address.search(testnet=False, db_session=self.db_session) }
            ==
            { 'asdf', 'asdr' }
        )

    def test_search_testnet(self):
        assert (
            { a.value for a in Address.search(testnet=True, db_session=self.db_session) }
            ==
            { 'asdv', 'asdg' }
        )

    def test_search_query(self):
        assert (
            { a.value for a in Address.search(query='asd', db_session=self.db_session) }
            ==
            { 'asdf', 'asdr', 'asdv', 'asdg' }
        )
        assert (
            { a.value for a in Address.search(query='df', db_session=self.db_session) }
            ==
            { 'asdf' }
        )

    def test_search_query_testnet(self):
        assert (
            { a.value for a in Address.search(query='asd', testnet=True, db_session=self.db_session) }
            ==
            { 'asdv', 'asdg' }
        )

        assert (
            { a.value for a in Address.search(query='df', testnet=True, db_session=self.db_session) }
            ==
            set()
        )


    def test_fetch(self):
        address = Address.fetch('asdf', db_session=self.db_session)
        assert address is not None
        assert address.value == 'asdf'
        assert address.testnet is False

    def test_fetch_fail(self):
        address = Address.fetch('qwerty')
        assert address is None
