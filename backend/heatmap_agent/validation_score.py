from langchain.llms import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
import json

# Set your HF token
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "<YOUR_HUGGINGFACEHUB_TOKEN>"

# Load Granite model
llm = HuggingFaceEndpoint(
    repo_id="ibm/granite-13b-chat-v2", temperature=0.3, max_new_tokens=700
)

# Prompt template
prompt_template = PromptTemplate.from_template(
    """
Given the following mindmap structure of a startup idea:

{mindmap}

Analyze the full structure and generate a JSON output in this format:

{{
    "score": (number between 0 and 10),
    "marketFitScore": (number between 0 and 10),
    "feasibilityScore": (number between 0 and 10),
    "innovationScore": (number between 0 and 10),
    "insights": [
        {{"aspect": "marketFit", "description": "..."}},
        {{"aspect": "implementation", "description": "..."}}
    ]
}}

Only output raw JSON without any explanation.
"""
)

chain = LLMChain(llm=llm, prompt=prompt_template)


def build_mindmap_tree(nodes, edges):
    id_to_node = {node["id"]: node for node in nodes}
    children_map = {}

    # Build children mapping from edges
    for edge in edges:
        parent_id = edge["source"]
        child_id = edge["target"]
        children_map.setdefault(parent_id, []).append(child_id)

    def build_subtree(node_id, depth=0):
        node = id_to_node[node_id]
        label = node["data"]["label"]
        subtree = "  " * depth + f"- {label}\n"
        for child_id in children_map.get(node_id, []):
            subtree += build_subtree(child_id, depth + 1)
        return subtree

    # Assume 'root' is the starting node
    return build_subtree("root")


def generate_idea_evaluation(nodes, edges):
    results = []

    # Build the mindmap from nodes and edges
    mindmap_text = build_mindmap_tree(nodes, edges)

    # Send full mindmap to Granite model
    response = chain.run({"mindmap": mindmap_text})

    try:
        parsed = json.loads(response)
        parsed["id"] = "root"  # Attach root id or your idea id
        results.append(parsed)
    except json.JSONDecodeError:
        print(f"Failed to parse JSON. Response: {response}")

    return results
