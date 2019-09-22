from io import BytesIO
import pytest
import os


def test_post_follow_success(client, utility):
    utility.mock_user('user')
    utility.mock_user('john')

    # attempt to follow john & succeed
    url = '/follow'
    data = {'username': 'john'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 201


def test_post_follow_unacceptable(client, utility):
    utility.mock_user('user')

    # attempt to follow himself & fail
    url = '/follow'
    data = {'username': 'user'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 406


def test_post_follow_not_found(client, utility):
    utility.mock_user('user')

    # attempt to follow non-existing user & fail
    url = '/follow'
    data = {'username': 'user2312321'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 404


def test_post_gallery_success(client, utility):
    utility.mock_user('user')

    url = '/add_gallery'
    data = {'gallery_title': 'gallery'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 201

def test_post_image_success(client, utility, mock_zk_storage):
    utility.mock_zk_create_storage_nodes(mock_zk_storage, 4)

    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/add_image?gallery_title=gallery'
    data = {'file': (BytesIO(b'IMAGE DATA'), 'tokio.jpg')}

    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())

    assert response.status_code == 500


def test_post_image_insufficient_storages(client, utility, mock_zk_storage):
    utility.mock_zk_create_storage_nodes(mock_zk_storage, 1)

    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/add_image?gallery_title=gallery'
    data = {'file': (BytesIO(b'IMAGE DATA'), 'tokio.jpg')}

    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())

    assert response.status_code == 501

def test_post_image_gallery_not_found(client, utility):
    utility.mock_user('user')
    # Gallery is missing

    url = '/add_image?gallery_title='
    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data={}, headers=utility.mock_token())
    assert response.status_code == 404


def test_post_image_bad_type(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/add_image?gallery_title=gallery'
    data = {'txt': (BytesIO(b'IMAGE DATA'), 'tokio.jpg')}
    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())
    assert response.status_code == 400


def test_post_image_bad_filename(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/add_image?gallery_title=gallery'
    data = {'file': ''}
    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())
    assert response.status_code == 400


def test_post_image_bad_extension(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    url = '/add_image?gallery_title=gallery'
    data = {'file': (BytesIO(b'IMAGE DATA'), 'tokio.pdf')}
    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())
    assert response.status_code == 400


def test_post_comment_success(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    iid = utility.mock_add_image('user', 'car.jpg')

    url = '/comment'
    data = {'image_id': iid, 'text': 'awesome comment!'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 201


def test_post_comment_not_found(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    # attempt to comment on a photo with invalid id
    url = '/comment'
    data = {'image_id': '', 'text': 'awesome comment!'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 404


def test_post_comment_forbidden(client, utility):
    utility.mock_user('user')
    utility.mock_user('john')
    utility.mock_gallery('john', 'gallery')
    iid = utility.mock_add_image('john', 'car.jpg')

    # attempt to comment on john's photo, but haven't followed him
    url = '/comment'
    data = {'image_id': iid, 'text': 'awesome comment!'}
    response = client.post(url, json=data, headers=utility.mock_token())

    assert response.status_code == 403
