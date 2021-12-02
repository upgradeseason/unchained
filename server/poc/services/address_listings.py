from ..database import DB
from ..models import Address, AddressListing


def create_address_listing_service(
    list_id=None, value=None, testnet=None, db_session=None
):
    db_session = db_session or DB.session

    address = Address.fetch(value)
    if address is None:
        address = Address(value=value, testnet=testnet)
        db_session.add(address)

    listing = AddressListing(list_id=list_id, address_value=value)
    db_session.add(listing)

    return listing


def delete_address_listing_service(listing, db_session=None):
    db_session = db_session or DB.session

    if listing.is_sole_listing_for_address:
        db_session.delete(listing.address)
    db_session.delete(listing)
