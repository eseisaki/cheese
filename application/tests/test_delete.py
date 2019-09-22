import pytest


def test_delete_image_success(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    iid = utility.mock_add_image('user', 'puppy.gif')

    url = '/delete_image'
    data = {'image_id': iid}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 500


def test_delete_image_not_found(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/delete_image'
    data = {'image_id': ''}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 404


def test_delete_gallery_success(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/delete_gallery'
    data = {'gallery_title': 'gallery'}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 200


def test_delete_gallery_not_found(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/delete_gallery'
    data = {'gallery_title': ''}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 404


def test_delete_comment_success(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    iid = utility.mock_add_image('user', 'puppy.gif')
    cid = utility.mock_add_comment('user', iid, 'awesome_comment')

    url = '/delete_comment'
    data = {'comment_id': cid, 'image_id': iid}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 200


def test_delete_comment_not_found(client, utility):
    utility.mock_user('user')

    # comment and/or image don't exist
    url = '/delete_comment'
    data = {'comment_id': '', 'image_id': ''}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 404

def test_delete_follower_success(client, utility):
    utility.mock_user('user')
    utility.mock_user('john')
    utility.mock_follow('user', 'john')

    url = '/delete_follower'
    data = {'username': 'john'}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 200

def test_delete_follower_forbidden(client, utility):
    utility.mock_user('user')

    url = '/delete_follower'
    data = {'username': 'user121231'}
    response = client.delete(url,json=data, headers=utility.mock_token())

    assert response.status_code == 403
