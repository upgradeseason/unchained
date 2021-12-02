from json import dumps
from flask import Response


def json_response(data={}, status=200, mime_type="application/json"):
    response = Response(
        dumps({**data, "status": status}), status=status, mimetype=mime_type
    )

    headers = {
        "Access-Control-Allow-Origin": "*",
    }

    return response, status, headers
