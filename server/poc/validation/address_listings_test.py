from unittest.mock import patch, MagicMock
from poc.validation import validate_new_address_listing


class TestValidateNewAddressListing:
    def setup(self):
        self.list = MagicMock()
        self.list.id = 123
        self.address = "3DRVz9YUhoXSMgBngvv2JkNReBHvkeJwLs"  # Unchained-owned address

    def test_non_dict_values(self):
        for raw_value in [None, "foo", 3, []]:
            error, params = validate_new_address_listing(
                self.list, self.address, raw_value
            )
            assert error is not None
            assert "must be a JSON object" in error
            assert params is None

    def test_wrong_testnet_type(self):
        error, params = validate_new_address_listing(
            self.list, self.address, dict(testnet="foo")
        )
        assert "must be `true` or `false`" in error
        assert params is None

    def test_invalid_address(self):
        error, params = validate_new_address_listing(self.list, "address", {})
        assert "not a valid bitcoin address" in error
        assert params is None

    def test_duplicate_address(self):
        self.list.has_address_with_value.return_value = True
        error, params = validate_new_address_listing(self.list, self.address, {})
        assert "already has this address" in error
        assert params is None
        self.list.has_address_with_value.assert_called_once_with(self.address)

    def test_acceptable_address(self):
        self.list.has_address_with_value.return_value = False
        error, params = validate_new_address_listing(self.list, self.address, {})
        assert error is None
        assert params == dict(list_id=self.list.id, value=self.address, testnet=False)
        self.list.has_address_with_value.assert_called_once_with(self.address)
