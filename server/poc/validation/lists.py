from ..models import List
from .base import validate_string, validate_request_data


def validate_list_search_query(request):
    error, query = validate_string(request.args.get("q"), max_length=50, required=False)
    if error:
        return error, None

    if query is None or query.strip() == "":
        return None, None
    else:
        return None, query.split()


def validate_new_list(raw_data):
    params = {}

    error, data = validate_request_data(raw_data)
    if error:
        return error, None

    raw_name = data.get("name")
    error, name = validate_string(raw_name, max_length=50)
    if error:
        return f"List `name` {error}", None
    else:
        if List.exists_with_name(name):
            return f"List already exists with that name.", None
        else:
            params["name"] = name

    return None, params
