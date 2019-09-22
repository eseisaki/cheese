from flask_restful import Api
from flask import Blueprint

from . import resources

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

api.add_resource(resources.index, '/')
api.add_resource(resources.UserRegistration, '/register')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout')
