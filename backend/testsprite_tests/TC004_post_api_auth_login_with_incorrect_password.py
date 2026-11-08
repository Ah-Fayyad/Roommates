import requests

def test_post_api_auth_login_with_incorrect_password():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/auth/login"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "email": "user0@example.com",
        "password": "wrongpassword"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"
        # Optionally assert error message structure if known
        json_resp = response.json()
        assert "error" in json_resp or "message" in json_resp, "Response JSON missing error/message field"
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_post_api_auth_login_with_incorrect_password()
