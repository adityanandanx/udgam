import pytest


class TestMarketResearch:
    """Tests for market research endpoints"""

    def test_get_market_insights(self, auth_api_client):
        """Test getting market insights for a specific location and domain"""
        # Try different locations
        locations = ["Mumbai, India", "San Francisco, USA"]
        domains = ["FoodTech", "EdTech"]

        for location in locations:
            for domain in domains:
                response = auth_api_client.get(
                    f"/market/insights?location={location}&domain={domain}"
                )

                assert response.status_code == 200
                data = response.json()
                assert "location" in data
                assert location in data["location"]
                assert "problems" in data
                assert isinstance(data["problems"], list)
                assert len(data["problems"]) > 0

                # Check problem structure
                for problem in data["problems"]:
                    assert "title" in problem
                    assert "description" in problem
                    assert "severity" in problem
                    assert "opportunities" in problem

    def test_market_insights_invalid_location(self, auth_api_client):
        """Test market insights with invalid location returns error"""
        response = auth_api_client.get("/market/insights?location=")

        assert response.status_code == 400
