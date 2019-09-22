import datetime
from .. import db
from .galleries import Gallery


class User(db.Document):
    registered_date = db.DateTimeField(default=datetime.datetime.now)
    username = db.StringField(required=True, unique=True)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    followers = db.ListField()
    following = db.ListField()
    galleries = db.EmbeddedDocumentListField(Gallery)
    profile_image = db.StringField()

    meta = {
        # 'db_alias': 'core',
        'collection': 'users'
    }
