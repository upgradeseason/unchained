from unittest.mock import MagicMock, patch
from poc.services import create_address_listing_service, delete_address_listing_service


class TestCreateAddressListingService:
    def setup(self):
        self.db_session = MagicMock()
        self.list_id = 123
        self.value = "foobar"
        self.testnet = False

    def test_creating_without_prior_address(self):
        with patch("poc.services.address_listings.Address") as mock_Address:
            mock_address = MagicMock()
            mock_Address.fetch.return_value = None
            mock_Address.return_value = mock_address

            with patch(
                "poc.services.address_listings.AddressListing"
            ) as mock_AddressListing:
                mock_listing = MagicMock()
                mock_AddressListing.return_value = mock_listing

                create_address_listing_service(
                    list_id=self.list_id,
                    value=self.value,
                    testnet=self.testnet,
                    db_session=self.db_session,
                )

                mock_Address.fetch.assert_called_once_with(self.value)
                mock_Address.assert_called_once_with(
                    value=self.value, testnet=self.testnet
                )
                mock_AddressListing.assert_called_once_with(
                    list_id=self.list_id, address_value=self.value
                )

                add_calls = self.db_session.add.call_args_list
                assert len(add_calls) == 2

                assert add_calls[0][0] == (mock_address,)
                assert add_calls[0][1] == {}

                assert add_calls[1][0] == (mock_listing,)
                assert add_calls[1][1] == {}

    def test_creating_with_prior_address(self):
        with patch("poc.services.address_listings.Address") as mock_Address:
            mock_address = MagicMock()
            mock_Address.fetch.return_value = mock_address

            with patch(
                "poc.services.address_listings.AddressListing"
            ) as mock_AddressListing:
                mock_listing = MagicMock()
                mock_AddressListing.return_value = mock_listing

                create_address_listing_service(
                    list_id=self.list_id,
                    value=self.value,
                    testnet=self.testnet,
                    db_session=self.db_session,
                )

                mock_Address.fetch.assert_called_once_with(self.value)
                mock_Address.assert_not_called()
                mock_AddressListing.assert_called_once_with(
                    list_id=self.list_id, address_value=self.value
                )

                self.db_session.add.assert_called_once_with(mock_listing)


class TestDeleteAddressListingService:
    def setup(self):
        self.db_session = MagicMock()
        self.listing = MagicMock()

    def test_deleting_when_sole_listing_for_address(self):
        self.listing.is_sole_listing_for_address = True
        address = MagicMock()
        self.listing.address = address

        delete_address_listing_service(self.listing, db_session=self.db_session)

        delete_calls = self.db_session.delete.call_args_list
        assert len(delete_calls) == 2

        assert delete_calls[0][0] == (address,)
        assert delete_calls[0][1] == {}

        assert delete_calls[1][0] == (self.listing,)
        assert delete_calls[1][1] == {}

    def test_deleting_when_not_sole_listing_for_address(self):
        self.listing.is_sole_listing_for_address = False
        delete_address_listing_service(self.listing, db_session=self.db_session)
        self.db_session.delete.assert_called_once_with(self.listing)
