from client import watsonx_llm

# List of valid factors from our factor_weights.csv
VALID_FACTORS = [
    "Market Size",
    "Internet Penetration",
    "Digital Infrastructure",
    "Logistics Network",
    "Talent Pool",
    "Investor Ecosystem",
    "Competition",
    "Infrastructure",
    "Power Supply",
    "Water Resources",
    "Commercial Space",
    "Education Access",
    "Healthcare Facilities",
    "Green Initiatives",
    "Tech Adoption",
    "Public Transportation",
    "Government Support",
    "Disposable Income",
    "Youth Population",
    "Urbanization",
]

factor_prompt = """You are an expert in analyzing startup success factors in India.

For the sectors {sectors}, identify exactly 3-5 of the most important factors from the list below that would determine the success of a startup in India.

Choose ONLY from this specific list of factors:
{valid_factors}

Return your answer as a comma-separated list of factors with no additional text or explanation.
For example: "Market Size, Talent Pool, Digital Infrastructure, Competition"
"""


def identify_factors(state: dict) -> dict:
    """
    Identify important success factors based on sectors.

    Args:
        state: Current state dictionary with sectors

    Returns:
        Updated state with identified factors
    """
    if "factors" in state and state["factors"]:
        return state  # Factors already identified

    sectors = state["sectors"]
    sector_list = ", ".join(sectors)

    # Format the valid factors as a bulleted list for the prompt
    valid_factors_formatted = "\n".join([f"- {factor}" for factor in VALID_FACTORS])

    # Get factors from LLM
    completion = watsonx_llm.invoke(
        factor_prompt.format(sectors=sector_list, valid_factors=valid_factors_formatted)
    )

    # Process and validate factors
    raw_factors = [factor.strip() for factor in completion.split(",")]

    # Validate that returned factors are in our list (case-insensitive matching)
    valid_factors_lower = [f.lower() for f in VALID_FACTORS]
    factors = []

    for factor in raw_factors:
        for valid_factor in VALID_FACTORS:
            if (
                factor.lower() == valid_factor.lower()
                or factor.lower() in valid_factor.lower()
            ):
                factors.append(valid_factor)  # Use the canonical version from our list
                break

    # Ensure we have at least 3 factors, default to top general factors if needed
    if len(factors) < 3:
        default_factors = ["Market Size", "Talent Pool", "Infrastructure"]
        for factor in default_factors:
            if factor not in factors:
                factors.append(factor)
            if len(factors) >= 3:
                break
    print(f"Identified factors: {factors}")
    # Return state update
    return {"factors": factors}
