from unittest.mock import MagicMock
from poc.services import delete_address_service


class TestDeleteAddressService:
    def setup(self):
        self.db_session = MagicMock()
        self.address = MagicMock()

    def test_deleting_without_listings(self):
        self.address.listings = []

        delete_address_service(self.address, db_session=self.db_session)

        delete_call_args = self.db_session.delete.call_args_list
        assert len(delete_call_args) == 1

        assert delete_call_args[0][0] == (self.address,)
        assert delete_call_args[0][1] == {}

    def test_deleting_with_listings(self):
        listing1 = MagicMock()
        listing2 = MagicMock()
        self.address.listings = [listing1, listing2]

        delete_address_service(self.address, db_session=self.db_session)

        delete_call_args = self.db_session.delete.call_args_list
        assert len(delete_call_args) == 3

        assert delete_call_args[0][0] == (listing1,)
        assert delete_call_args[0][1] == {}

        assert delete_call_args[1][0] == (listing2,)
        assert delete_call_args[1][1] == {}

        assert delete_call_args[2][0] == (self.address,)
        assert delete_call_args[2][1] == {}
