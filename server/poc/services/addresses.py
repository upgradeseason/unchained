from ..database import DB


def delete_address_service(address, db_session=None):
    db_session = db_session or DB.session
    for listing in address.listings:
        db_session.delete(listing)
    db_session.delete(address)
