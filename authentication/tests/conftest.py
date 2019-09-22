from auth import app
from auth import zk_auth
import pytest
import os
from mongoengine import connect
from kazoo.client import KazooClient

@pytest.fixture
def real_zk_auth():
    real_zk_auth = zk_auth
    yield real_zk_auth

@pytest.fixture
def zk_client():
    zk_client = KazooClient(hosts=os.environ.get('ZK_HOST'))
    zk_client.start()
    yield zk_client

@pytest.fixture
def client():
    client = app.test_client()
    db = connect('cheese-test', alias='cheese_test', host='mongodb')
    db.drop_database('cheese-test')
    yield client
    db.drop_database('cheese-test')


@pytest.fixture
def utility():
    return Utility


class Utility:
    @staticmethod
    def register_user(client, username, password):
        url = '/register'
        data = {
            'username': username,
            'password': password,
            'email': username + '@email.com'
        }
        return client.post(url, json=data)

    @staticmethod
    def login_user(client, username, password):
        url = '/login'
        data = {'username': username, 'password': password}
        return client.post(url, json=data)
