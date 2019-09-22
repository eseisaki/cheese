

def test_zk_client_start(zk_client):
    if zk_client.exists('/storage/1000'):
        data, state = zk_client.get('/storage/1000')
        assert data == b"1000"


def test_zk_client_stop(zk_client,zk_storage):
    zk_storage.stop()
    if zk_client.exists('/storage/1000'):
        data, state = zk_client.get('/storage/1000')
        assert data != b"1000"
