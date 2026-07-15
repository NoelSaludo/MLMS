import pytest

def test_check_health(client):
    response = client.get("/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["server"] == "is active"
    assert data["database connection"] is True
