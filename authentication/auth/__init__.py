from flask import Flask
from flask_cors import CORS
from os import environ
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from kazoo.client import KazooClient

app = Flask(__name__)

app.config.from_envvar('APP_CONFIG_FILE')
app.config['MONGODB_HOST'] = environ.get('MONGODB_HOST')
app.config['ZK_HOST'] = environ.get('ZK_HOST')


db = MongoEngine(app)
jwt = JWTManager(app)

zk_auth = KazooClient(hosts=app.config['ZK_HOST'])
zk_auth.start()
zk_auth.ensure_path("/auth")

if not zk_auth.exists('/auth/1'):
    zk_auth.create('/auth/1', b"4000", ephemeral=True)

CORS(app)
from .routes import api_blueprint
app.register_blueprint(api_blueprint)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers[
        'Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT, OPTIONS'
    response.headers[
        'Access-Control-Allow-Headers'] = 'Access-Control-Allow-Origin'
    response.headers[
        'Access-Control-Expose-Headers'] = 'Authorization, Headers, error'
    response.headers['Content-Type'] = 'application/json'

    return response