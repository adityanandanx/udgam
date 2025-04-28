def parse_markdown(state: dict = None) -> dict:
    """
    Parse markdown text from state or from the input and update the state with the idea.

    Args:
        state: Current state dictionary or markdown text

    Returns:
        Updated state dictionary with parsed idea
    """
    # Handle both direct text input and state dict
    if isinstance(state, str):
        markdown_text = state
    elif isinstance(state, dict) and "idea" in state:
        return state  # Idea already parsed
    else:
        markdown_text = state

    # Strip Markdown, keep only raw idea text
    from markdown import markdown
    from bs4 import BeautifulSoup

    html = markdown(markdown_text)
    soup = BeautifulSoup(html, features="html.parser")
    parsed_text = soup.get_text(separator=" ")

    # Return state update
    return {"idea": parsed_text}
