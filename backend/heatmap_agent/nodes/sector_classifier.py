from client import watsonx_llm

sector_prompt = """You are an expert startup sector classifier.
Given a startup idea, return the most likely sectors it belongs to from the following list:
[FoodTech, EdTech, HealthTech, FinTech, AgriTech, MobilityTech, GreenTech, SaaS, Ecommerce, Social Media, Others]
DO NOT EXPLAIN YOURSELF. Just return the sectors in a comma-separated format.
Startup Idea:
{idea}
Sectors:"""


def classify_sector(state: dict) -> dict:
    """
    Classify the startup idea into relevant sectors.

    Args:
        state: Current state dictionary with the idea

    Returns:
        Updated state with sectors classification
    """
    if "sectors" in state and state["sectors"]:
        return state  # Sectors already classified

    idea = state["idea"]
    completion = watsonx_llm.invoke(sector_prompt.format(idea=idea))
    print(completion)
    sectors = [sector.strip() for sector in completion.split(",")]

    # Return state update
    return {"sectors": sectors}
