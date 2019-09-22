from app_logic import app
from kazoo.client import KazooClient
from app_logic import zk_app
from app_logic.data.users import User
from app_logic.data.galleries import Gallery
from app_logic.data.images import Image
from app_logic.data.comments import Comment
import pytest
import os
from app_logic import zk_get_storage_children
from mongoengine import connect
from flask_jwt_extended import create_access_token
from app_logic import STORAGE_HOST


@pytest.fixture
def client():
    client = app.test_client()
    db = connect('cheese-test', alias='cheese_test', host='mongodb')
    db.drop_database('cheese-test')
    yield client
    db.drop_database('cheese-test')



@pytest.fixture
def mock_zk_storage():
    mock_zk_storage = KazooClient(hosts=os.environ.get('ZK_HOST'))
    mock_zk_storage.start()
    mock_zk_storage.delete('/storage', recursive=True)  
    yield mock_zk_storage
    mock_zk_storage.delete('/storage', recursive=True)
    mock_zk_storage.stop()


@pytest.fixture
def mock_zk_app():
    mock_zk_app = KazooClient(hosts=os.environ.get('ZK_HOST'))
    mock_zk_app.start()
    yield mock_zk_app
    mock_zk_app.stop()

@pytest.fixture
def real_zk_app():
    real_zk_app = zk_app
    yield real_zk_app
# ~------------------------------------------------~
@pytest.fixture
def utility():
    return Utility

@pytest.fixture
def mock_add_comment():
    return Utility.mock_add_comment


class Utility:
    @staticmethod
    def mock_zk_get_children(zk_client):
        return zk_get_storage_children(zk_client)

    @staticmethod
    def mock_zk_create_storage_nodes(zk_client, num):
        zk_client.ensure_path('/storage')
        for i in range(num):
            if not zk_client.exists('/storage/'+str(i)):
                zk_client.create('/storage/'+str(i), b"1000")

    @staticmethod
    def mock_zk_delete_storage_nodes(zk_client, num):
        for i in range(num):
            if zk_client.exists('/storage/'+str(i)):
                zk_client.delete('/storage/'+str(i))

    @staticmethod
    def mock_token():
        # identity = user
        # expiration = False
        token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjA4NTkzNjcsIm5iZiI6MTU2MDg1OTM2NywianRpIjoiZjAyYzVhZjEtNGM1OS00ZTEwLWI3NzYtZjQxYjczZGVhYTA3IiwiaWRlbnRpdHkiOiJ1c2VyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.If6TqeTNMxf7LbP_XID14Xsu1R0hGB3o9_gNtDcziXk'
        return [('Authorization', 'Bearer ' + token)]

    @staticmethod
    def mock_user(username):
        user = User()
        user.username = username
        user.password = 'very_secret_password'
        user.email = username+'@email.com'
        user.save()

    @staticmethod
    def mock_gallery(username, title):
        user = User.objects(username=username).first()
        gallery = Gallery()
        gallery.title = title
        gallery.owner = user.username
        user.galleries.insert(0, gallery)
        user.save()

    @staticmethod
    def mock_follow(user1, user2):
        me = User.objects(username=user1).first()
        friend = User.objects(username=user2).first()
        friend.followers.append(user1)
        friend.save()
        me.following.append(user2)
        me.save()

    @staticmethod
    def mock_add_image(owner, filename):
        image = Image()
        image.path = '/uploads/'+filename
        image.owner = owner
        image.storage.append(('http://'+STORAGE_HOST[0]+':100', 0))
        image.save()
        image.iid = str(image.id)
        image.save()
        me = User.objects(username=owner).first()
        emb_gallery = me.galleries[0]
        emb_gallery.images.insert(0, image.iid)
        me.save()
        return image.iid

    @staticmethod
    def mock_add_comment(owner, iid, text):
        me = User.objects(username=owner).first()
        comment = Comment()
        comment.owner = owner
        comment.text = text
        comment._id = 'super_unique_id'
        image = Image.objects(iid=iid).first()
        image.comments.append(comment)
        image.save()
        return comment._id
    
    @staticmethod
    def get_image_count(owner):
        me = User.objects(username=owner).first()
        return len(me.galleries[0].images)
