import datetime
from .. import db
from .comments import Comment


class Image(db.Document):
    registered_date = db.DateTimeField(default=datetime.datetime.now)
    storage = db.ListField()
    iid = db.StringField()
    path = db.StringField(required=True)
    owner = db.StringField(required=True)
    description = db.StringField()
    comments = db.EmbeddedDocumentListField(Comment)

    meta = {
        # 'db_alias': 'core',
        'collection': 'images'
    }
