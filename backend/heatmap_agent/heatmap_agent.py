from langgraph.graph import StateGraph
from nodes.md_parser import parse_markdown
from nodes.sector_classifier import classify_sector
from nodes.factor_identifier import identify_factors
from nodes.location_scorer import score_locations
from nodes.heatmap_generator import generate_heatmap
from typing import TypedDict, List


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
