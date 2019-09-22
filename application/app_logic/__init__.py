from flask import Flask
from flask_cors import CORS
from os import environ
from kazoo.client import KazooClient
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
import time

app = Flask(__name__)

app.config.from_envvar('APP_CONFIG_FILE')
app.config['MONGODB_HOST'] = environ.get('MONGODB_HOST')
app.config['ZK_HOST'] = environ.get('ZK_HOST')

STORAGE_HOST = []
for i in range(4):
    STORAGE_HOST.append(environ.get('STORAGE_HOST_'+str(i)))

MAX_RETRIES = 3

db = MongoEngine(app)
jwt = JWTManager(app)


zk_app = KazooClient(hosts=app.config['ZK_HOST'])
zk_app.start()
zk_app.ensure_path("/app")

if not zk_app.exists('/app/1'):
    zk_app.create('/app/1', b"5000", ephemeral=True)


def zk_get_storage_children(zk_client):
    retries = 0
    if not zk_client.exists('/storage'):
        return []

    while len(zk_client.get_children('/storage')) < 2 and retries < MAX_RETRIES:
        retries += 1
        time.sleep(1)

    # if retries == MAX_RETRIES:
    #     return []
    return zk_client.get_children('/storage')


CORS(app)
from .routes import api_blueprint
app.register_blueprint(api_blueprint)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers[
        'Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS, DELETE'
    response.headers[
        'Access-Control-Allow-Headers'] = 'Access-Control-Allow-Origin'
    response.headers[
        'Access-Control-Expose-Headers'] = 'Authorization, Headers, error'
    response.headers['Content-Type'] = 'application/json, multipart/form-data'

    return response
