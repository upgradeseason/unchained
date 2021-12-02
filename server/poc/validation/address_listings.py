from .base import validate_string, validate_request_data
from .addresses import validate_address


def validate_new_address_listing(list, raw_value, raw_data):
    params = {"list_id": list.id}

    error, data = validate_request_data(raw_data)
    if error:
        return error, None

    testnet = data.get("testnet", False)
    if not isinstance(testnet, bool):
        return "Address listing `testnet` must be `true` or `false`.", None
    params["testnet"] = testnet

    error, value = validate_address(raw_value, testnet)
    if error:
        return f"Address listing `value` {error}", None
    else:
        if list.has_address_with_value(value):
            return f"List already has this address.", None
        else:
            params["value"] = value

    return None, params
