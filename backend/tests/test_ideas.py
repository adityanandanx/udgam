import pytest


class TestIdeas:
    """Tests for idea management endpoints"""

    def test_create_idea(self, auth_api_client):
        """Test creating a new idea"""
        idea_data = {
            "title": "Test Idea Creation",
            "description": "This is a test idea created by automated tests",
            "problemStatement": "Testing problem statement",
            "targetMarket": "Test users",
            "tags": ["test", "automation", "pytest"],
        }

        response = auth_api_client.post("/ideas", json=idea_data)

        assert response.status_code == 201
        created_idea = response.json()
        assert created_idea["title"] == idea_data["title"]
        assert "id" in created_idea
        assert "userId" in created_idea

        # Clean up - delete the created idea
        delete_response = auth_api_client.delete(f"/ideas/{created_idea['id']}")
        assert delete_response.status_code == 204

    def test_get_idea_by_id(self, auth_api_client, test_idea):
        """Test retrieving a specific idea by ID"""
        response = auth_api_client.get(f"/ideas/{test_idea['id']}")

        assert response.status_code == 200
        idea = response.json()
        assert idea["id"] == test_idea["id"]
        assert idea["title"] == test_idea["title"]

    def test_update_idea(self, auth_api_client, test_idea):
        """Test updating an existing idea"""
        update_data = {
            "title": f"{test_idea['title']} - Updated",
            "description": "Updated description",
            "problemStatement": test_idea["problemStatement"],
            "targetMarket": test_idea["targetMarket"],
            "status": "active",
        }

        response = auth_api_client.put(f"/ideas/{test_idea['id']}", json=update_data)

        assert response.status_code == 200
        updated_idea = response.json()
        assert updated_idea["id"] == test_idea["id"]
        assert updated_idea["title"] == update_data["title"]
        assert updated_idea["description"] == update_data["description"]
        assert updated_idea["status"] == "active"

    def test_list_ideas(self, auth_api_client, test_idea):
        """Test listing all ideas with filters"""
        # Get all ideas
        response = auth_api_client.get("/ideas")

        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "total" in data
        assert isinstance(data["data"], list)

        # Check if our test idea is in the results
        idea_ids = [idea["id"] for idea in data["data"]]
        assert test_idea["id"] in idea_ids

        # Test with filters
        filtered_response = auth_api_client.get("/ideas?status=active&limit=5")
        assert filtered_response.status_code == 200

    def test_generate_ideas(self, auth_api_client):
        """Test generating new idea suggestions"""
        generation_data = {
            "domain": "EdTech",
            "problemArea": "Personalized learning for K-12 students",
            "constraints": ["mobile-first", "low-connectivity areas"],
            "userPreferences": {
                "targetAgeGroup": "6-12",
                "focusSubjects": ["mathematics", "science"],
            },
        }

        response = auth_api_client.post("/ideas/generate", json=generation_data)

        assert response.status_code == 200
        data = response.json()
        assert "ideas" in data
        assert len(data["ideas"]) > 0
        for idea in data["ideas"]:
            assert "title" in idea
            assert "description" in idea

    def test_validate_idea(self, auth_api_client, test_idea):
        """Test validating an idea"""
        response = auth_api_client.post(f"/ideas/{test_idea['id']}/validate")

        assert response.status_code == 200
        validation = response.json()
        assert "score" in validation
        assert "marketFitScore" in validation
        assert "feasibilityScore" in validation
        assert "innovationScore" in validation
        assert "insights" in validation

        # All scores should be numbers between 0 and 10
        assert 0 <= validation["score"] <= 10
        assert 0 <= validation["marketFitScore"] <= 10
        assert 0 <= validation["feasibilityScore"] <= 10
        assert 0 <= validation["innovationScore"] <= 10

    def test_refine_idea(self, auth_api_client, test_idea):
        """Test refining an existing idea"""
        refinement_data = {
            "ideaId": test_idea["id"],
            "refinementGoal": "marketFit",
            "constraints": ["must be mobile app", "focus on user experience"],
        }

        response = auth_api_client.post("/ideas/refine", json=refinement_data)

        assert response.status_code == 200
        data = response.json()
        assert "originalIdea" in data
        assert "refinements" in data
        assert data["originalIdea"]["id"] == test_idea["id"]
        assert len(data["refinements"]) > 0

        # Check that the refinements have the expected structure
        for refinement in data["refinements"]:
            assert "aspect" in refinement
            assert "suggestion" in refinement
            assert "reasoning" in refinement
