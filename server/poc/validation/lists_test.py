from unittest.mock import patch, MagicMock
from poc.validation import validate_new_list, validate_list_search_query


class TestValidateListSearchQuery:
    def test_non_string_values(self):
        for raw_value in [3, {}, []]:
            request = MagicMock()
            request.args = dict(q=raw_value)
            error, query = validate_list_search_query(request)
            assert error is not None
            assert "must be a string" in error
            assert query is None

    def test_too_long_value(self):
        request = MagicMock()
        request.args = dict(q="a" * 51)
        error, query = validate_list_search_query(request)
        assert error is not None
        assert "cannot be longer than 50" in error
        assert query is None

    def test_blank_values(self):
        for raw_value in [None, "", " "]:
            request = MagicMock()
            request.args = dict(q=raw_value)
            error, query = validate_list_search_query(request)
            assert error is None
            assert query is None

    def test_string_without_whitespace(self):
        request = MagicMock()
        request.args = dict(q="foobar")
        error, query = validate_list_search_query(request)
        assert error is None
        assert query == ["foobar"]

    def test_string_with_whitespace(self):
        request = MagicMock()
        request.args = dict(q="foo  bar")
        error, query = validate_list_search_query(request)
        assert error is None
        assert query == ["foo", "bar"]


class TestValidateNewList:
    def test_non_dict_values(self):
        for raw_value in [None, "foo", 3, []]:
            error, params = validate_new_list(raw_value)
            assert error is not None
            assert "must be a JSON object" in error
            assert params is None

    def test_missing_name(self):
        error, params = validate_new_list({})
        assert "`name` is required" in error
        assert params is None

    def test_blank_name(self):
        for raw_value in ["", " ", None]:
            error, params = validate_new_list(dict(name=raw_value))
            assert "`name` is required" in error
            assert params is None

    def test_duplicate_name(self):
        existing_list_name = "foobar"
        with patch(
            "poc.validation.lists.List.exists_with_name"
        ) as mock_list_exists_with_name:

            mock_list_exists_with_name.return_value = True

            error, params = validate_new_list(dict(name=existing_list_name))
            assert "already exists with that name" in error
            assert params is None

            mock_list_exists_with_name.assert_called_once_with(existing_list_name)

    def test_acceptable_list_name(self):
        data = dict(name="foobar")
        with patch(
            "poc.validation.lists.List.exists_with_name"
        ) as mock_list_exists_with_name:

            mock_list_exists_with_name.return_value = False

            error, params = validate_new_list(data)
            assert error is None
            assert params == data

            mock_list_exists_with_name.assert_called_once_with(data["name"])
