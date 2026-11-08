import requests

def test_post_api_auth_signup_missing_password():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/auth/signup"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "email": "testuser@example.com",
        "name": "Test User"
        # password is intentionally missing to test validation error
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "errors" in data and isinstance(data["errors"], list), f"Expected 'errors' list in response, got: {data}"

    password_error_found = any(err.get("field") == "password" for err in data["errors"])
    assert password_error_found, f"Expected validation error mentioning password field, got: {data}"

test_post_api_auth_signup_missing_password()