from .data_fetcher import fetch_data
import pandas as pd
import numpy as np


def score_locations(state: dict) -> dict:
    """
    Score locations based on identified factors.

    Args:
        state: Current state dictionary with factors

    Returns:
        Updated state with location scores
    """
    if "scores" in state and state["scores"]:
        return state  # Locations already scored

    factors = state["factors"]

    # Fetch data
    (
        district_data,
        population_data,
        internet_data,
        startup_data,
        infrastructure_data,
        education_data,
        healthcare_data,
        factor_weights,
    ) = fetch_data()

    # Normalize factor names for matching with the factor_weights dataframe
    normalized_factors = [factor.strip().title() for factor in factors]

    # Get weights for each factor
    # If a factor doesn't exist in our weights table, use a default balanced weight
    factor_weight_rows = []
    for factor in normalized_factors:
        matched_row = factor_weights[
            factor_weights["factor"].str.lower() == factor.lower()
        ]
        if not matched_row.empty:
            factor_weight_rows.append(matched_row.iloc[0].to_dict())
        else:
            # Default weights if factor not found
            factor_weight_rows.append(
                {
                    "factor": factor,
                    "population": 0.5,
                    "internet": 0.5,
                    "startup_ecosystem": 0.5,
                    "infrastructure": 0.5,
                    "transportation": 0.3,
                    "power_supply": 0.3,
                    "water_supply": 0.3,
                    "commercial_space": 0.3,
                    "education": 0.5,
                    "healthcare": 0.5,
                }
            )

    # Prepare dataframes for scoring
    merged_data = (
        population_data.merge(internet_data, on="district")
        .merge(startup_data, on="district")
        .merge(infrastructure_data, on="district")
        .merge(education_data, on="district")
        .merge(healthcare_data, on="district")
    )

    # Calculate combined factor weights
    factor_count = len(factor_weight_rows)
    combined_weights = {
        "population": sum(row["population"] for row in factor_weight_rows)
        / factor_count,
        "internet": sum(row["internet"] for row in factor_weight_rows) / factor_count,
        "startup_ecosystem": sum(row["startup_ecosystem"] for row in factor_weight_rows)
        / factor_count,
        "infrastructure": sum(row["infrastructure"] for row in factor_weight_rows)
        / factor_count,
        "transportation": sum(row["transportation"] for row in factor_weight_rows)
        / factor_count,
        "power_supply": sum(row["power_supply"] for row in factor_weight_rows)
        / factor_count,
        "water_supply": sum(row["water_supply"] for row in factor_weight_rows)
        / factor_count,
        "commercial_space": sum(row["commercial_space"] for row in factor_weight_rows)
        / factor_count,
        "education": sum(row["education"] for row in factor_weight_rows) / factor_count,
        "healthcare": sum(row["healthcare"] for row in factor_weight_rows)
        / factor_count,
    }

    # Normalize weights to sum to 1
    weight_sum = sum(combined_weights.values())
    for key in combined_weights:
        combined_weights[key] = (
            combined_weights[key] / weight_sum if weight_sum > 0 else 0.1
        )

    scores = []
    for idx, row in merged_data.iterrows():
        district = row["district"]
        lat = row["lat"]
        lng = row["lng"]

        # Calculate normalized scores for each metric
        pop_score = row["population"] / population_data["population"].max()
        net_score = row["penetration"] / 100
        start_score = row["ecosystem_score"] / 10
        infra_score = row["infrastructure_index"] / 10
        transport_score = row["transportation"] / 10
        power_score = row["power_supply"] / 10
        water_score = row["water_supply"] / 10
        commercial_score = row["commercial_space"] / 10
        education_score = row["education_score"] / 10
        healthcare_score = row["healthcare_score"] / 10

        # Apply combined weights from all factors
        final_score = (
            combined_weights["population"] * pop_score
            + combined_weights["internet"] * net_score
            + combined_weights["startup_ecosystem"] * start_score
            + combined_weights["infrastructure"] * infra_score
            + combined_weights["transportation"] * transport_score
            + combined_weights["power_supply"] * power_score
            + combined_weights["water_supply"] * water_score
            + combined_weights["commercial_space"] * commercial_score
            + combined_weights["education"] * education_score
            + combined_weights["healthcare"] * healthcare_score
        )

        # Include district name for better context in visualization
        scores.append(
            {
                "district": district,
                "lat": lat,
                "lng": lng,
                "weight": round(final_score, 2),
            }
        )

    # Return state update
    return {"scores": scores}
