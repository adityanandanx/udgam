def generate_heatmap(state: dict) -> dict:
    """
    Generate heatmap data from location scores in GeoJSON format.

    Args:
        state: Current state dictionary with scores and factors

    Returns:
        Updated state with heatmap data in GeoJSON format
    """
    if "heatmap" in state and state["heatmap"]:
        return state  # Heatmap already generated

    scores = state["scores"]
    factors = state.get("factors", [])

    # Convert scores to GeoJSON format
    geojson = {
        "type": "FeatureCollection",
        "factors": factors,  # Include factors once at the top level
        "features": [],
    }

    for score in scores:
        feature = {
            "type": "Feature",
            "properties": {
                "weight": score["weight"],
                "district": score["district"],
                # No factors here - they're at the top level
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    score["lng"],
                    score["lat"],
                ],  # GeoJSON uses [longitude, latitude] order
            },
        }
        geojson["features"].append(feature)

    # Return state update with GeoJSON format
    return {"heatmap": geojson}
