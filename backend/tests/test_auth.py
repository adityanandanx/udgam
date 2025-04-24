import pytest
import uuid


class TestAuthentication:
    """Tests for authentication endpoints"""

    def test_register_success(self, api_client):
        """Test successful user registration"""
        # Generate unique username to avoid conflicts
        unique_username = f"testuser_{uuid.uuid4().hex[:8]}"
        register_data = {
            "username": unique_username,
            "email": f"{unique_username}@example.com",
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User",
        }

        response = api_client.post("/auth/register", json=register_data)

        assert response.status_code == 201
        user_data = response.json()
        assert user_data["username"] == unique_username
        assert user_data["email"] == f"{unique_username}@example.com"
        assert "id" in user_data

    def test_register_duplicate_username(self, api_client, auth_api_client):
        """Test registration with duplicate username fails"""
        # Get current user's username
        me_response = auth_api_client.get("/users/me")
        existing_username = me_response.json()["username"]

        # Try to register with the same username
        register_data = {
            "username": existing_username,
            "email": "another@example.com",
            "password": "testpassword123",
            "firstName": "Another",
            "lastName": "User",
        }

        response = api_client.post("/auth/register", json=register_data)

        # Should fail with 400 Bad Request
        assert response.status_code == 400

    def test_login_success(self, api_client):
        """Test successful login"""
        login_data = {"username": "testuser", "password": "yourpassword"}

        response = api_client.post("/auth/login", json=login_data)

        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data

    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials"""
        login_data = {"username": "nonexistentuser", "password": "wrongpassword"}

        response = api_client.post("/auth/login", json=login_data)

        assert response.status_code == 401

    def test_get_current_user(self, auth_api_client):
        """Test getting current user profile"""
        response = auth_api_client.get("/users/me")

        assert response.status_code == 200
        user_data = response.json()
        assert "id" in user_data
        assert "username" in user_data
        assert "email" in user_data
