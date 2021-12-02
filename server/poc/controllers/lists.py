from flask import request
from ..app import APP
from ..database import DB
from ..models import List
from ..validation import validate_new_list, validate_list_search_query
from ..services import create_list_service, delete_list_service
from .base import json_response


@APP.route("/lists", methods=["GET"])
def index_lists():
    error, query = validate_list_search_query(request)
    if error:
        return json_response({"error": error}, status=400)

    return json_response(
        {
            "lists": [list.serialize() for list in List.search(query)],
        }
    )


@APP.route("/lists", methods=["POST"])
def create_list():
    data = request.get_json()

    error, list_params = validate_new_list(data)
    if error:
        return json_response({"error": error}, status=400)

    list = create_list_service(**list_params)
    DB.session.commit()

    return json_response({"id": list.id})


@APP.route("/lists/<list_id>", methods=["GET"])
def show_list(list_id):
    list = List.fetch(list_id)
    if list is None:
        return json_response({"error": "List not found."}, status=404)

    return json_response({"list": list.serialize_with_listings()})


@APP.route("/lists/<list_id>", methods=["DELETE"])
def delete_list(list_id):
    list = List.fetch(list_id)
    if list is None:
        return json_response({"error": "List not found."}, status=404)

    delete_list_service(list)
    DB.session.commit()

    return json_response()
