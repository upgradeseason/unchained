from flask import request
from ..app import APP
from ..database import DB
from ..models import Address
from ..validation import validate_address_search_query, validate_address_search_network
from ..services import delete_address_service
from .base import json_response


@APP.route("/addresses", methods=["GET"])
def index_addresses():
    testnet = request.args.get("network")
    error, query = validate_address_search_query(request)
    if error:
        return json_response({"error": error}, status=400)

    error, testnet = validate_address_search_network(request)
    if error:
        return json_response({"error": error}, status=400)

    return json_response(
        {
            "addresses": [
                address.serialize()
                for address in Address.search(query=query, testnet=testnet)
            ],
        }
    )


@APP.route("/addresses/<value>", methods=["GET"])
def show_address(value):
    address = Address.fetch(value)
    if address is None:
        return json_response({"error": "Address not found."}, status=404)

    return json_response({"address": address.serialize_with_listings()})


@APP.route("/addresses/<value>", methods=["DELETE"])
def delete_address(value):
    address = Address.fetch(value)
    if address is None:
        return json_response({"error": "Address not found."}, status=404)

    delete_address_service(address)
    DB.session.commit()
    return json_response()
