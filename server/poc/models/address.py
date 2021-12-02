from sqlalchemy.ext.associationproxy import association_proxy
from ..database import DB


class Address(DB.Model):

    __tablename__ = "addresses"

    value = DB.Column(DB.String(90), primary_key=True)
    testnet = DB.Column(DB.Boolean(), nullable=False, index=True)

    listings = DB.relationship("AddressListing", backref="address")
    lists = association_proxy("listings", "list")

    def serialize(self):
        return {
            "value": self.value,
            "testnet": self.testnet,
            "list_count": len(self.listings),
        }

    def serialize_with_listings(self):
        return {
            "value": self.value,
            "testnet": self.testnet,
            "lists": [
                {
                    "id": listing.list.id,
                    "name": listing.list.name,
                }
                for listing in self.listings
            ],
        }

    @classmethod
    def search(cls, query=None, testnet=None, db_session=None):
        filters = []

        if query is not None:
            pattern = f"%{query}%"
            filters.append(cls.value.like(pattern))

        if testnet is not None:
            filters.append(cls.testnet == testnet)

        db_session = db_session or DB.session

        return db_session.query(cls).filter(*filters).all()

    @classmethod
    def fetch(cls, value, db_session=None):
        db_session = db_session or DB.session

        return db_session.query(cls).filter(cls.value==value).first()
