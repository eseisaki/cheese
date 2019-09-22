def test_zk_client_start(zk_client):
    if zk_client.exists('/auth/1'):
        data, state = zk_client.get('/auth/1')
        assert data == b"4000"


def test_zk_client_stop(zk_client, real_zk_auth):
    real_zk_auth.stop()
    if zk_client.exists('/auth/1'):
        data, state = zk_client.get('/auth/1')
        assert data != b"4000"
