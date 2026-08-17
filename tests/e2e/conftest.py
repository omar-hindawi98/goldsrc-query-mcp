import os
import pytest
from strands.models.ollama import OllamaModel


CSTRIKE_HOST = "127.0.0.1"
CSTRIKE_PORT = 27015
RCON_PASSWORD = "e2e_test_password"


@pytest.fixture(scope="session")
def ollama_model():
    host = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    model_id = os.environ.get("AGENT_MODEL_NAME", "llama3.2:1b")
    return OllamaModel(host=host, model_id=model_id)
