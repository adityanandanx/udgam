from models.models import Idea
import json


def idea_to_markdown(idea: Idea):
    nodes = json.loads(idea.nodes)
    edges = json.loads(idea.edges)

    id_to_label = {n["id"]: n["data"]["label"] for n in nodes}
    # build adjacency: parent id → list of child ids
    children = {n["id"]: [] for n in nodes}
    for e in edges:
        children[e["source"]].append(e["target"])
    # find root nodes (those that never appear as a target)
    all_targets = {e["target"] for e in edges}
    roots = [n["id"] for n in nodes if n["id"] not in all_targets]

    lines = []

    def dfs(node_id, depth):
        # add this node’s label
        lines.append("  " * depth + "- " + id_to_label[node_id])
        # recurse into its children
        for child_id in children.get(node_id, []):
            dfs(child_id, depth + 1)

    # traverse each root
    for r in roots:
        dfs(r, 0)

    return "\n".join(lines)
