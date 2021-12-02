from flask_sqlalchemy import SQLAlchemy

from .app import APP

APP.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://poc:password@database:5432/poc_dev"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
DB = SQLAlchemy(APP)
