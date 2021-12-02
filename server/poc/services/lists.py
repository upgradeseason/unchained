from ..database import DB
from ..models import List


def create_list_service(name=None, db_session=None):
    db_session = db_session or DB.session
    list = List(name=name)
    db_session.add(list)
    return list


def delete_list_service(list, db_session=None):
    db_session = db_session or DB.session
    for listing in list.listings:
        db_session.delete(listing)
    db_session.delete(list)
