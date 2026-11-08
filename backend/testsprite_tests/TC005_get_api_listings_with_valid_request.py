import requests

def test_get_api_listings_with_valid_request():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/listings"
    timeout = 30
    try:
        response = requests.get(url, timeout=timeout)
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        listings = response.json()
        assert isinstance(listings, list), "Response JSON is not a list"

        for item in listings:
            assert isinstance(item, dict), "Listing item is not a dictionary"
            assert "project_id" in item, "Missing 'project_id' in listing item"
            assert "name" in item, "Missing 'name' in listing item"
            assert "last_scan_at" in item, "Missing 'last_scan_at' in listing item"
            assert "status" in item, "Missing 'status' in listing item"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"


test_get_api_listings_with_valid_request()