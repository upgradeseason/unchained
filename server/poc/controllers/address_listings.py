from flask import request
from ..app import APP
from ..database import DB
from ..models import AddressListing, List
from ..validation import validate_new_address_listing
from ..services import create_address_listing_service, delete_address_listing_service
from .base import json_response


@APP.route("/lists/<list_id>/addresses/<value>", methods=["POST"])
def create_address_listing(list_id, value):
    list = List.fetch(list_id)
    if list is None:
        return json_response({"error": "List not found."}, status=404)

    data = request.get_json()

    error, listing_params = validate_new_address_listing(list, value, data)
    if error:
        return json_response({"error": error}, status=400)

    create_address_listing_service(**listing_params)
    DB.session.commit()

    return json_response()


@APP.route("/lists/<list_id>/addresses/<value>", methods=["DELETE"])
def delete_address_listing(list_id, value):
    listing = AddressListing.fetch(list_id=list_id, address_value=value)
    if listing is None:
        return json_response({"error": "Address not associated with list."}, status=404)

    delete_address_listing_service(listing)
    DB.session.commit()
    return json_response()
