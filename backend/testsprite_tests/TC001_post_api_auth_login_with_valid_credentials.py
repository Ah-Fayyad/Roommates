import requests

def test_post_api_auth_login_with_valid_credentials():
    base_url = "http://localhost:5000"
    endpoint = "/api/auth/login"
    url = base_url + endpoint
    headers = {"Content-Type": "application/json"}
    payload = {
        "email": "user0@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "token" in data, "JWT token not found in response"
    assert isinstance(data["token"], str) and len(data["token"]) > 0, "Invalid JWT token"


test_post_api_auth_login_with_valid_credentials()