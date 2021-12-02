def validate_string(raw_value, required=True, max_length=255):
    if raw_value is None:
        if required:
            return "is required.", None
        else:
            return None, None

    if not isinstance(raw_value, str):
        return "must be a string.", None

    value = raw_value.strip()
    if len(value) == 0:
        if required:
            return "is required.", None
        else:
            return None, None

    if len(value) > max_length:
        return f"cannot be longer than {max_length} characters.", None

    return None, value


def validate_request_data(data):
    if data is None or not isinstance(data, dict):
        return "Request body must be a JSON object.", None
    return None, data
