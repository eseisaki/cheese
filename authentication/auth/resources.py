from flask_jwt_extended import create_access_token,\
    create_refresh_token, jwt_required
from flask_restful import Resource
from flask import make_response, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from .data.users import User
from operator import itemgetter


class index(Resource):
    def get(self):
        return "Hello from ~Authentication"


class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        user = User()
        # user lookup
        user_exists = User.objects(username=data['username']).first()

        try:
            hashed_pw = generate_password_hash(data['password'],
                                               method='sha256')
            user.username = data['username']
            user.email = data['email']
            user.password = data['password']
            if Validation(user):
                user.password = hashed_pw
                user.save()
                output = {
                    'email': user.email,
                    'username': user.username,
                    'password': user.password
                }

                # Auth Token init
                access_token = create_access_token(identity=data['username'])
                refresh_token = create_refresh_token(identity=data['username'])
                resp = jsonify(output)
                headers = {'Authorization': access_token}

                return make_response(resp, 201, headers)
            else:
                return make_response(jsonify('data_validation'), 400)
        except Exception as e:
            if 'E11000' in str(e):
                return make_response(jsonify({"NotUniqueError": str(e)}), 409)
            else:
                return make_response(
                    jsonify({"Unknown exeption occured": str(e)}), 500)


class UserLogin(Resource):
    def post(self):
        data = request.get_json()

        # user lookup
        current_user = User.objects(username=data['username']).first()
        if not current_user:
            return make_response(jsonify('404'), 404)

        # username & password validation
        if check_password_hash(current_user.password, data['password']):

            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            resp = jsonify({'msg': 'logged_in'})
            headers = {'Authorization': access_token}

            return make_response(resp, 200, headers)
        else:
            return make_response(jsonify('401'), 401)


class UserLogoutAccess(Resource):
    @jwt_required
    def get(self):
        resp = jsonify({'msg': 'logged_out'})
        # unset_jwt_cookies(resp)
        return make_response(resp, 200)


def Validation(item):
    output = True
    for k, v in item._fields.items():
        #print(v.required, item[k])
        if v.required and item[k] == "":
            return False
    return output
