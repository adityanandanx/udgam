from langgraph.graph import StateGraph
from .nodes.md_parser import parse_markdown
from .nodes.sector_classifier import classify_sector
from .nodes.factor_identifier import identify_factors
from .nodes.location_scorer import score_locations
from .nodes.heatmap_generator import generate_heatmap
from typing import TypedDict, List, Dict, Any, Callable


class HeatmapAgentState(TypedDict):
    idea: str
    sectors: List[str]
    factors: List[str]
    scores: List[dict]
    heatmap: List[dict]


graph = StateGraph(HeatmapAgentState)

graph.add_node("parse_markdown", parse_markdown)
graph.add_node("classify_sector", classify_sector)
graph.add_node("identify_factors", identify_factors)
graph.add_node("score_locations", score_locations)
graph.add_node("generate_heatmap", generate_heatmap)

graph.add_edge("parse_markdown", "classify_sector")
graph.add_edge("classify_sector", "identify_factors")
graph.add_edge("identify_factors", "score_locations")
graph.add_edge("score_locations", "generate_heatmap")

# Define input/output nodes
graph.set_entry_point("parse_markdown")
graph.set_finish_point("generate_heatmap")

agent = graph.compile()


# Wrapper function for consistent caching
def generate_idea_heatmap(idea_markdown: str) -> Dict[str, Any]:
    """
    Generates a heatmap for an idea using the agent pipeline.

    Args:
        idea_markdown: The markdown representation of the idea

    Returns:
        Dict containing the heatmap data and other relevant information
    """
    result = agent.invoke({"idea": idea_markdown})

    # Ensure the heatmap is in a consistent format for caching
    if "heatmap" not in result or not result["heatmap"]:
        # Return a default structure if heatmap generation failed
        return {"heatmap": [], "error": "Failed to generate heatmap", "success": False}

    return {
        "heatmap": result["heatmap"],
        "sectors": result.get("sectors", []),
        "factors": result.get("factors", []),
        "success": True,
    }
