import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_api_auth_signup_with_valid_data():
    url = f"{BASE_URL}/api/auth/signup"
    payload = {
        "email": "newuser@example.com",
        "password": "ValidPass123!",
        "name": "New User"
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = None
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201, f"Expected status 201, got {response.status_code}"
        data = response.json()
        assert "id" in data, f"Response JSON missing 'id': {data}"
        assert isinstance(data["id"], (str, int)) and data["id"], f"Invalid user id in response: {data['id']}"
    finally:
        # If user created, delete user to clean up
        if response and response.status_code == 201:
            user_id = response.json().get("id")
            if user_id:
                try:
                    del_url = f"{BASE_URL}/api/auth/user/{user_id}"
                    del_resp = requests.delete(del_url, timeout=TIMEOUT)
                    # We do not assert delete response here as cleanup best effort
                except Exception:
                    pass

test_post_api_auth_signup_with_valid_data()