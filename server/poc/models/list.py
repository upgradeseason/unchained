from sqlalchemy.ext.associationproxy import association_proxy
from ..database import DB


class List(DB.Model):

    __tablename__ = "lists"

    id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(50), nullable=False, index=True, unique=True)

    listings = DB.relationship("AddressListing", backref="list")
    addresses = association_proxy("listings", "address")

    def has_address_with_value(self, value):
        for listing in self.listings:
            if listing.address.value == value:
                return True
        return False

    def serialize(self):
        return {"id": self.id, "name": self.name, "address_count": len(self.listings)}

    def serialize_with_listings(self):
        return {
            "id": self.id,
            "name": self.name,
            "addresses": [
                {
                    "value": listing.address.value,
                }
                for listing in self.listings
            ],
        }

    @classmethod
    def search(cls, query=None):
        if query:
            term = query[0].strip()
            pattern = f"%{term}%"
            return cls.query.filter(cls.name.ilike(pattern)).all()
        else:
            return cls.query.all()

    @classmethod
    def fetch(cls, list_id):
        return cls.query.filter_by(id=list_id).first()

    @classmethod
    def exists_with_name(cls, name):
        return cls.query.filter_by(name=name).first() is not None
