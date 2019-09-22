import datetime
from .. import db


class Comment(db.EmbeddedDocument):
    registered_date = db.DateTimeField(default=datetime.datetime.now)
    _id = db.StringField()
    text = db.StringField(required=True)
    owner = db.StringField(required=True)

    meta = {
        # 'db_alias': 'core',
        'collection': 'comments'
    }
