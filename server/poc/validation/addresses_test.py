from unittest.mock import MagicMock
from poc.validation import (
    validate_address,
    validate_address_search_query,
    validate_address_search_network,
)


class TestValidateAddressSearchQuery:
    def test_non_string_values(self):
        for raw_value in [3, {}, []]:
            request = MagicMock()
            request.args = dict(q=raw_value)
            error, query = validate_address_search_query(request)
            assert error is not None
            assert "must be a string" in error
            assert query is None

    def test_too_long_value(self):
        request = MagicMock()
        request.args = dict(q="a" * 91)
        error, query = validate_address_search_query(request)
        assert error is not None
        assert "cannot be longer than 90" in error
        assert query is None

    def test_blank_values(self):
        for raw_value in [None, "", " "]:
            request = MagicMock()
            request.args = dict(q=raw_value)
            error, query = validate_address_search_query(request)
            assert error is None
            assert query is None

    def test_string_without_whitespace(self):
        request = MagicMock()
        request.args = dict(q="foobar")
        error, query = validate_address_search_query(request)
        assert error is None
        assert query == "foobar"

    def test_string_with_whitespace(self):
        request = MagicMock()
        request.args = dict(q="foo  bar")
        error, query = validate_address_search_query(request)
        assert error is None
        assert query == "foo"


class TestValidateAddressSearchNetwork:
    def test_unknown_values(self):
        request = MagicMock()
        request.args = dict(network="foobar")
        error, testnet = validate_address_search_network(request)
        assert error is not None
        assert "Network must be either" in error
        assert testnet is None

    def test_blank_values(self):
        for raw_value in [None, "", " "]:
            request = MagicMock()
            request.args = dict(network=raw_value)
            error, testnet = validate_address_search_network(request)
            assert error is None
            assert testnet is None

    def test_testnet(self):
        request = MagicMock()
        request.args = dict(network="testnet")
        error, testnet = validate_address_search_network(request)
        assert error is None
        assert testnet is True

    def test_mainnet(self):
        request = MagicMock()
        request.args = dict(network="mainnet")
        error, testnet = validate_address_search_network(request)
        assert error is None
        assert testnet is False


class TestValidateAddress:
    def test_mainnet_address(self):
        address = "3DRVz9YUhoXSMgBngvv2JkNReBHvkeJwLs"  # Unchained-owned address
        error, value = validate_address(address, False)
        assert error is None
        assert value == address

    def test_testnet_address(self):
        address = "2NE1LH35XT4YrdnEebk5oKMmRpGiYcUvpNR"  # Unchained-owned address
        error, value = validate_address(address, True)
        assert error is None
        assert value == address

    def test_invalid_address(self):
        error, value = validate_address("foobar", False)
        assert "is not a valid bitcoin address" in error
        assert value is None

    def test_empty_values(self):
        for raw_value in ["", " ", None]:
            error, value = validate_address(raw_value, False)
            assert error is not None
            assert "is required" in error
            assert value is None

    def test_wrong_types(self):
        for raw_value in [3, {}, []]:
            error, value = validate_address(raw_value, False)
            assert error is not None
            assert "must be a string" in error
            assert value is None

    def test_too_long_value(self):
        error, value = validate_address("a" * 256, False)
        assert error is not None
        assert "cannot be longer than 90" in error
        assert value is None
