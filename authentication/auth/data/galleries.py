import datetime
from .. import db


class Gallery(db.EmbeddedDocument):
    registered_date = db.DateTimeField(default=datetime.datetime.now)
    title = db.StringField(required=True)
    owner = db.StringField(required=True)
    images = db.ListField()

    meta = {
        # 'db_alias': 'core',
        'collection': 'galleries'
    }
