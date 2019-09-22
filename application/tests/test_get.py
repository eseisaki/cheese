import pytest

def test_get_profile_success(client, utility):
    # create 2 users
    utility.mock_user('user')
    utility.mock_user('john')

    # 'user' visits john's profile
    url = '/public_profile?username=john'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 200
    # assert response.json['username'] == 'john'

    # # not following John yet ~UI: render Follow btn
    # assert response.json['is_stranger'] == True


def test_get_profile_not_found(client, utility):
    # create user
    utility.mock_user('user')

    # 'user' visits a profile that doesnt exists
    url = '/public_profile?username=user1'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 404


def test_get_galleries_success(client, utility):
    utility.mock_user('user')
    utility.mock_user('john')
    utility.mock_follow('user', 'john')
    url = '/get_galleries?username=john'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 200


def test_get_galleries_forbidden(client, utility):
    utility.mock_user('user')
    # user DOES NOT follow john yet OR john doesnt exist
    url = '/get_galleries?username=john'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 403


def test_get_images_success(client, utility, mock_zk_storage):
    utility.mock_zk_create_storage_nodes(mock_zk_storage, 1)

    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    utility.mock_add_image('user', 'cat_photo.jpg')

    url = '/gallery_photos?username=user&gallery_title=gallery'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 200
    utility.mock_zk_delete_storage_nodes(mock_zk_storage, 1)

def test_get_images_not_found(client, utility):
    utility.mock_user('user')

    # this user doesnt exists
    url = '/gallery_photos?username=user12312'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 404

def test_get_images_storage_not_found(client, utility, mock_zk_storage):

    # Create zk_storage node
    utility.mock_zk_create_storage_nodes(mock_zk_storage, 1)

    # Add two images
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    utility.mock_add_image('user', 'cat_photo.jpg')
    utility.mock_add_image('user', 'cat_photo2.jpg')

    url = '/gallery_photos?username=user&gallery_title=gallery'
    response = client.get(url, headers=utility.mock_token())

    # Assert that the number of returned 'image object' EQUALS to the number of added images
    assert response.status_code == 200
    #assert len(response.json) == utility.get_image_count('user')
    
    # Delete the zk_storage node
    utility.mock_zk_delete_storage_nodes(mock_zk_storage, 1)

    url = '/gallery_photos?username=user&gallery_title=gallery'
    response = client.get(url, headers=utility.mock_token())

    # Image Objects returned should be 0
    assert response.status_code == 501


def test_get_comments_success(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    iid = utility.mock_add_image('user', 'car.png')
    url = '/get_comments?username=user&image_id='+iid
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 200


def test_get_comments_forbidden(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')
    iid = utility.mock_add_image('user', 'car.png')

    url = '/get_comments?username=john&image_id'+iid
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 403


def test_get_comments_not_found(client, utility):
    utility.mock_user('user')
    utility.mock_gallery('user', 'gallery')

    # image_id = null
    url = '/get_comments?username=user'
    response = client.get(url, headers=utility.mock_token())

    assert response.status_code == 404
