from ibm_watsonx_ai.foundation_models import ModelInference
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
import os

load_dotenv()

apikey = os.environ.get("WATSONX_API_KEY")
url = os.environ.get("WATSONX_URL")
project_id = os.environ.get("WATSONX_PROJECT_ID")

parameters = {
    "decoding_method": "sample",
    "max_new_tokens": 100,
    "min_new_tokens": 1,
    "temperature": 0.5,
    "top_k": 50,
    "top_p": 1,
}

print("creating watson")
watsonx_llm = WatsonxLLM(
    apikey=apikey,
    url=url,
    project_id=project_id,
    params=parameters,
    model_id="ibm/granite-3-8b-instruct",
)
print("created watson")
