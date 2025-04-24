import pytest
import requests
from urllib.parse import urljoin
import os
import uuid

# Set default test server URL, allow override via environment variable
API_BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:5000/v1/")

print(API_BASE_URL)


class ApiClient:
    """API client fixture for testing the Udgam API"""

    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.token = None
        self.headers = {"Content-Type": "application/json"}

    def set_auth_token(self, token):
        self.token = token
        self.headers["Authorization"] = f"Bearer {token}"

    def remove_auth(self):
        self.token = None
        if "Authorization" in self.headers:
            del self.headers["Authorization"]

    def url(self, path):
        return urljoin(self.base_url, path.lstrip("/"))

    def get(self, path, **kwargs):
        return requests.get(self.url(path), headers=self.headers, **kwargs)

    def post(self, path, json=None, **kwargs):
        return requests.post(self.url(path), json=json, headers=self.headers, **kwargs)

    def put(self, path, json=None, **kwargs):
        return requests.put(self.url(path), json=json, headers=self.headers, **kwargs)

    def delete(self, path, **kwargs):
        return requests.delete(self.url(path), headers=self.headers, **kwargs)


@pytest.fixture
def api_client():
    """Create a new API client for each test"""
    return ApiClient(base_url=API_BASE_URL)


@pytest.fixture
def auth_api_client(api_client):
    """Create an authenticated API client using test credentials"""
    # Use environment variables or default test credentials
    username = os.getenv("TEST_USERNAME", "testuser")
    password = os.getenv("TEST_PASSWORD", "yourpassword")

    # Attempt to login
    login_data = {"username": username, "password": password}
    response = api_client.post("/auth/login", json=login_data)

    if response.status_code != 200:
        # If login fails, try to register a test user
        register_data = {
            "username": username,
            "email": "test@example.com",
            "password": password,
            "firstName": "Test",
            "lastName": "User",
        }
        api_client.post("/auth/register", json=register_data)

        # Try login again
        response = api_client.post("/auth/login", json=login_data)

    # Set the token if login was successful
    if response.status_code == 200:
        api_client.set_auth_token(response.json()["token"])

    return api_client


@pytest.fixture
def test_idea(auth_api_client):
    """Create a test idea for use in tests"""
    # Generate a unique title to avoid conflicts
    unique_suffix = str(uuid.uuid4())[:8]
    idea_data = {
        "title": f"Test Idea {unique_suffix}",
        "description": "This is a test idea created for automated testing",
        "problemStatement": "Testing problem that needs solving",
        "targetMarket": "Test users",
        "tags": ["test", "automation"],
    }

    # Create the idea
    response = auth_api_client.post("/ideas", json=idea_data)
    idea = response.json()

    yield idea

    # Cleanup: try to delete the idea after test completes
    try:
        auth_api_client.delete(f"/ideas/{idea['id']}")
    except Exception:
        pass
