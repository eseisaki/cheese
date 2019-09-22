import datetime
from .. import db
from .galleries import Gallery


class FollowObj(db.Document):
    username = db.StringField(required=True, unique=True)
    profile_image = db.StringField()
    in_common = db.BooleanField()

    meta = {
        # 'db_alias': 'core',
        'collection': 'follow_obj'
    }
