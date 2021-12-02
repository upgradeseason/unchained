from flask_migrate import Migrate
from .app import APP
from .database import DB

migrate = Migrate(APP, DB)
