# Database Schema

The entire data model for this application consists of three tables
describing two main domain models and a many-to-many join between
them:

* [Lists](./list.py) -- are named containers for addresses
* [Addresses](./address.py) -- are bitcoin addresses with some metadata
* [AddressListings](./address_listing.py) -- represent an association between an address and a
  list.  Since the intended relationship between these models is
  many-to-many, this table is required.  Since the intended
  relationship is unique, this table has a unique index.

This directory contains SQLAlchemy models which describe this data
schema.
