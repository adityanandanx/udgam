import pytest


class TestDocuments:
    """Tests for document management endpoints"""

    def test_list_documents_for_idea(self, auth_api_client, test_idea):
        """Test listing documents for an idea"""
        response = auth_api_client.get(f"/ideas/{test_idea['id']}/documents")

        assert response.status_code == 200
        documents = response.json()
        assert isinstance(documents, list)
        # A new idea shouldn't have documents yet
        assert len(documents) == 0

    def test_generate_document(self, auth_api_client, test_idea):
        """Test generating a new document for an idea"""
        document_types = ["pitchDeck", "businessPlan", "executiveSummary"]
        formats = ["markdown", "pdf"]

        # Test generating different document types
        for doc_type in document_types:
            for doc_format in formats:
                document_data = {"type": doc_type, "format": doc_format}

                response = auth_api_client.post(
                    f"/ideas/{test_idea['id']}/documents", json=document_data
                )

                assert response.status_code == 201
                document = response.json()
                assert document["ideaId"] == test_idea["id"]
                assert document["type"] == doc_type
                assert document["format"] == doc_format
                assert "content" in document
                assert "id" in document

                # Verify the document appears in the list
                list_response = auth_api_client.get(
                    f"/ideas/{test_idea['id']}/documents"
                )
                assert list_response.status_code == 200
                documents = list_response.json()
                assert any(doc["id"] == document["id"] for doc in documents)

    def test_generate_document_for_nonexistent_idea(self, auth_api_client):
        """Test generating document for non-existent idea fails"""
        non_existent_id = "00000000-0000-4000-a000-000000000000"
        document_data = {"type": "pitchDeck", "format": "markdown"}

        response = auth_api_client.post(
            f"/ideas/{non_existent_id}/documents", json=document_data
        )

        assert response.status_code == 404
