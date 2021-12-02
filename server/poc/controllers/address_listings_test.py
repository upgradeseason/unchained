from json import loads, dumps
from unittest.mock import MagicMock, patch
from poc.app import APP


@patch("poc.controllers.address_listings.DB.session.commit")
@patch("poc.controllers.address_listings.create_address_listing_service")
@patch("poc.controllers.address_listings.validate_new_address_listing")
@patch("poc.controllers.address_listings.List.fetch")
class TestCreateAddressListing:
    def setup(self):
        self.db_session = MagicMock()
        self.data = dict()
        self.list = MagicMock()
        self.list.id = 123

    def test_unknown_list(
        self,
        mock_fetch,
        mock_validate_new_address_listing,
        mock_create_address_listing_service,
        mock_commit,
    ):
        mock_fetch.return_value = None
        with APP.test_client() as client:
            response = client.post(
                "/lists/123/addresses/foobar",
                data=dumps(self.data),
                content_type="application/json",
                headers={"Accept": "application/json"},
            )
            assert loads(response.data) == dict(error="List not found.", status=404)
            mock_fetch.assert_called_once_with("123")
            mock_validate_new_address_listing.assert_not_called()
            mock_create_address_listing_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_invalid_input(
        self,
        mock_fetch,
        mock_validate_new_address_listing,
        mock_create_address_listing_service,
        mock_commit,
    ):
        mock_fetch.return_value = self.list
        error = "some error"
        mock_validate_new_address_listing.return_value = error, None
        with APP.test_client() as client:
            response = client.post(
                "/lists/123/addresses/foobar",
                data=dumps(self.data),
                content_type="application/json",
                headers={"Accept": "application/json"},
            )
            assert loads(response.data) == dict(error=error, status=400)
            mock_fetch.assert_called_once_with("123")
            mock_validate_new_address_listing.assert_called_once_with(
                self.list, "foobar", self.data
            )
            mock_create_address_listing_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_valid_input(
        self,
        mock_fetch,
        mock_validate_new_address_listing,
        mock_create_address_listing_service,
        mock_commit,
    ):
        mock_fetch.return_value = self.list
        params = dict(
            list_id=self.list.id,
            value="foobar",
            testnet=False,
        )
        mock_validate_new_address_listing.return_value = None, params
        with APP.test_client() as client:
            response = client.post(
                "/lists/123/addresses/foobar",
                data=dumps(self.data),
                content_type="application/json",
                headers={"Accept": "application/json"},
            )
            assert loads(response.data) == dict(status=200)
            mock_fetch.assert_called_once_with("123")
            mock_validate_new_address_listing.assert_called_once_with(
                self.list, "foobar", self.data
            )
            mock_create_address_listing_service.assert_called_once_with(**params)
            mock_commit.assert_called_once_with()


@patch("poc.controllers.address_listings.DB.session.commit")
@patch("poc.controllers.address_listings.delete_address_listing_service")
@patch("poc.controllers.address_listings.AddressListing.fetch")
class TestDeleteAddressListing:
    def test_unknown_address_listing(
        self, mock_fetch, mock_delete_address_listing_service, mock_commit
    ):
        mock_fetch.return_value = None

        with APP.test_client() as client:
            response = client.delete("/lists/123/addresses/foobar")
            assert loads(response.data) == dict(
                error="Address not associated with list.", status=404
            )
            mock_fetch.assert_called_once_with(list_id="123", address_value="foobar")
            mock_delete_address_listing_service.assert_not_called()
            mock_commit.assert_not_called()

    def test_known_address_listing(
        self, mock_fetch, mock_delete_address_listing_service, mock_commit
    ):
        listing = MagicMock()
        mock_fetch.return_value = listing

        with APP.test_client() as client:
            response = client.delete("/lists/123/addresses/foobar")
            assert loads(response.data) == dict(status=200)
            mock_fetch.assert_called_once_with(list_id="123", address_value="foobar")
            mock_delete_address_listing_service.assert_called_once_with(listing)
            mock_commit.assert_called_once_with()
