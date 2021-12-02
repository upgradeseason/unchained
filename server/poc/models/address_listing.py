from ..database import DB


class AddressListing(DB.Model):

    __tablename__ = "address_listings"

    __table_args__ = (
        DB.Index(
            "ix_address_listings_list_id_address_value",
            "list_id",
            "address_value",
            unique=True,
        ),
    )

    list_id = DB.Column(DB.Integer, DB.ForeignKey("lists.id"), primary_key=True)

    address_value = DB.Column(
        DB.String(90), DB.ForeignKey("addresses.value"), primary_key=True
    )

    @property
    def is_sole_listing_for_address(self):
        return len(self.address.listings) == 1

    @classmethod
    def fetch(cls, list_id=None, address_value=None):
        return cls.query.filter_by(list_id=list_id, address_value=address_value).first()
