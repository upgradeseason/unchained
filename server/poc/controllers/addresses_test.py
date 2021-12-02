from json import loads
from unittest.mock import patch, MagicMock
from poc.app import APP


@patch("poc.controllers.addresses.Address.search")
class TestIndexAddresses:
    def setup(self):
        self.address1 = MagicMock()
        self.address2 = MagicMock()
        self.serialized_address1 = dict(foo="bar")
        self.serialized_address2 = dict(foo="baz")
        self.serialized_addresses = [self.serialized_address1, self.serialized_address2]
        self.address1.serialize.return_value = self.serialized_address1
        self.address2.serialize.return_value = self.serialized_address2

    def test_with_no_query(self, mock_search):
        mock_search.return_value = [self.address1, self.address2]
        with APP.test_client() as client:
            response = client.get("/addresses")
            assert loads(response.data) == dict(
                addresses=self.serialized_addresses, status=200
            )
            mock_search.assert_called_once_with(query=None, testnet=None)

    def test_with_query(self, mock_search):
        mock_search.return_value = [self.address1, self.address2]
        with APP.test_client() as client:
            response = client.get("/addresses?q=foobar+baz")
            assert loads(response.data) == dict(
                addresses=self.serialized_addresses, status=200
            )
            mock_search.assert_called_once_with(query="foobar", testnet=None)

    def test_with_network(self, mock_search):
        mock_search.return_value = [self.address1, self.address2]
        with APP.test_client() as client:
            response = client.get("/addresses?network=mainnet")
            assert loads(response.data) == dict(
                addresses=self.serialized_addresses, status=200
            )
            mock_search.assert_called_once_with(query=None, testnet=False)

    def test_with_query_and_network(self, mock_search):
        mock_search.return_value = [self.address1, self.address2]
        with APP.test_client() as client:
            response = client.get("/addresses?q=foobar+baz&network=mainnet")
            assert loads(response.data) == dict(
                addresses=self.serialized_addresses, status=200
            )
            mock_search.assert_called_once_with(query="foobar", testnet=False)


@patch("poc.controllers.addresses.Address.fetch")
class TestShowAddress:
    def test_unknown_address(self, mock_fetch):
        mock_fetch.return_value = None
        with APP.test_client() as client:
            response = client.get("/addresses/foobar")
            assert loads(response.data) == dict(error="Address not found.", status=404)
            mock_fetch.assert_called_once_with("foobar")

    def test_known_address(self, mock_fetch):
        address = MagicMock()
        serialized_address = dict(foo="bar")
        address.serialize_with_listings.return_value = serialized_address
        mock_fetch.return_value = address
        with APP.test_client() as client:
            response = client.get("/addresses/foobar")
            assert loads(response.data) == dict(address=serialized_address, status=200)
            mock_fetch.assert_called_once_with("foobar")


@patch("poc.controllers.addresses.DB.session.commit")
@patch("poc.controllers.addresses.delete_address_service")
@patch("poc.controllers.addresses.Address.fetch")
class TestDeleteAddress:
    def test_unknown_address(
        self, mock_fetch, mock_delete_address_service, mock_commit
    ):
        mock_fetch.return_value = None
        with APP.test_client() as client:
            response = client.delete("/addresses/foobar")
            assert loads(response.data) == dict(error="Address not found.", status=404)
            mock_fetch.assert_called_once_with("foobar")
            mock_delete_address_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_known_address(self, mock_fetch, mock_delete_address_service, mock_commit):
        address = MagicMock()
        mock_fetch.return_value = address
        with APP.test_client() as client:
            response = client.delete("/addresses/foobar")
            assert loads(response.data) == dict(status=200)
            mock_fetch.assert_called_once_with("foobar")
            mock_delete_address_service.assert_called_once_with(address)
            mock_commit.assert_called_once_with()
