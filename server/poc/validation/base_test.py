from poc.validation import validate_string, validate_request_data


class TestValidateStringWhenRequired:
    def test_acceptable_value(self):
        error, value = validate_string("foo")
        assert error is None
        assert value == "foo"

    def test_empty_values(self):
        for raw_value in ["", " ", None]:
            error, value = validate_string(raw_value)
            assert error is not None
            assert "is required" in error
            assert value is None

    def test_wrong_types(self):
        for raw_value in [3, {}, []]:
            error, value = validate_string(raw_value)
            assert error is not None
            assert "must be a string" in error
            assert value is None

    def test_long_values_with_default_max_length(self):
        error, value = validate_string("a" * 256)
        assert error is not None
        assert "cannot be longer than 255" in error
        assert value is None

    def test_long_values_with_custom_max_length(self):
        error, value = validate_string("a" * 11, max_length=10)
        assert error is not None
        assert "cannot be longer than 10" in error
        assert value is None


class TestValidateStringWhenNotRequired:
    def test_acceptable_value(self):
        error, value = validate_string("foo", required=False)
        assert error is None
        assert value == "foo"

    def test_empty_values(self):
        for raw_value in ["", " ", None]:
            error, value = validate_string(raw_value, required=False)
            assert error is None
            assert value is None

    def test_wrong_types(self):
        for raw_value in [3, {}, []]:
            error, value = validate_string(raw_value, required=False)
            assert error is not None
            assert "must be a string" in error
            assert value is None

    def test_long_values_with_default_max_length(self):
        error, value = validate_string("a" * 256, required=False)
        assert error is not None
        assert "cannot be longer than 255" in error
        assert value is None

    def test_long_values_with_custom_max_length(self):
        error, value = validate_string("a" * 11, max_length=10, required=False)
        assert error is not None
        assert "cannot be longer than 10" in error
        assert value is None


class TestValidateRequestData:
    def test_non_dict_values(self):
        for raw_value in [None, "foo", 3, []]:
            error, value = validate_request_data(raw_value)
            assert error is not None
            assert "must be a JSON object" in error
            assert value is None

    def test_dict_value(self):
        raw_value = dict(foo="bar")
        error, value = validate_request_data(raw_value)
        assert error is None
        assert value == raw_value
