import os
from io import BytesIO
import time

def test_post_image_success(client, utility):

    url = '/post_image'
    filename = 'tokio.jpg'
    data = {'file': (BytesIO(b'IMAGE DATA'), filename)}

    response = client.post(url, buffered=True,
                           content_type='multipart/form-data',
                           data=data, headers=utility.mock_token())

    assert response.status_code == 201
    assert os.path.exists('/app/images/'+filename) == True

def test_delete_image_success(client, utility):
    filename = 'tokio.jpg'
    # try:
    #     file = (BytesIO(b'IMAGE_DATA'), filename)
    #     file.save(os.path.join('/app/images', file.filename))
    # except:
    #    print('file_not_saved')
    test_post_image_success(client, utility)
    url = '/delete_image'
    data = {'filename': filename}
    response = client.delete(url, json=data, headers=utility.mock_token())

    assert response.status_code == 204