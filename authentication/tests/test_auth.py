def test_index(client):
    response = client.get('/')
    assert response.status_code == 200

def test_user_register_success(client, utility):
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 201


def test_user_register_bad_request(client, utility):
    # empty fields
    response = utility.register_user(client, '', '')
    assert response.status_code == 400
    # empty password
    response = utility.register_user(client, 'user', '')
    assert response.status_code == 400
    # empty username
    response = utility.register_user(client, '', 'pass')
    assert response.status_code == 400


def test_user_register_duplicate_data(client, utility):
    # register user
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 201
    # register a second user with the same username
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 409


def test_user_login_success(client, utility):
    # register user
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 201

    # attempt login
    response = utility.login_user(client, 'user', 'pass')
    assert response.status_code == 200


def test_user_login_not_found(client, utility):
    # attempt login, but account doesnt exist
    response = utility.login_user(client, 'some_user', 'pass')
    assert response.status_code == 404


def test_user_login_unauthorized(client, utility):
    # register user
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 201

    # attempt login, but credentials dont match
    response = utility.login_user(client, 'user', 'wrong_pass')
    assert response.status_code == 401


def test_user_logout_success(client, utility):
    # register user
    response = utility.register_user(client, 'user', 'pass')
    assert response.status_code == 201

    # get a valid access token from the response
    token = response.headers['Authorization']
    # pass token as headers argument
    url = '/logout'
    response = client.get(url, headers=[('Authorization', 'Bearer ' + token)])
    assert response.status_code == 200


def test_user_logout_unauthorized(client, utility):
    # access token is 'empty' or invalid
    token = ''
    url = '/logout'
    response = client.get(url, headers=[('Authorization', 'Bearer ' + token)])
    assert response.status_code == 422
