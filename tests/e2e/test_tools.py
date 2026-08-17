from mcp import StdioServerParameters, stdio_client
from strands import Agent
from strands.tools.mcp import MCPClient

from .conftest import CSTRIKE_HOST, CSTRIKE_PORT, RCON_PASSWORD

_MCP_CMD = StdioServerParameters(command="node", args=["dist/index.js"])
_ADDR = f"{CSTRIKE_HOST}:{CSTRIKE_PORT}"


def _make_agent(ollama_model):
    client = MCPClient(lambda: stdio_client(_MCP_CMD))
    return Agent(model=ollama_model, tools=[client])


def test_ping(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(f"Use the ping tool on the server at address {CSTRIKE_HOST} port {CSTRIKE_PORT}."))
    assert "ms" in result.lower() or any(c.isdigit() for c in result)


def test_get_server_info(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(f"Use get_server_info on {CSTRIKE_HOST} port {CSTRIKE_PORT} and show me the result."))
    assert "counter-strike" in result.lower() or "e2e" in result.lower()


def test_get_players(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(f"Use get_players on {CSTRIKE_HOST} port {CSTRIKE_PORT} and show me the result."))
    assert result.strip()


def test_get_rules(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(f"Use get_rules on {CSTRIKE_HOST} port {CSTRIKE_PORT} and show me the result."))
    assert "mp_" in result or "sv_" in result


def test_get_all(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(f"Use get_all on {CSTRIKE_HOST} port {CSTRIKE_PORT} and show me the full result."))
    lower = result.lower()
    assert "info" in lower or "rules" in lower or "players" in lower


def test_send_rcon(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(
        f"Use send_rcon on {CSTRIKE_HOST} port {CSTRIKE_PORT} "
        f"with password {RCON_PASSWORD} and command 'status'. Show me the response."
    ))
    assert "hostname" in result.lower() or "players" in result.lower() or "map" in result.lower()


def test_send_rcon_batch(ollama_model):
    agent = _make_agent(ollama_model)
    result = str(agent(
        f"Use send_rcon_batch on {CSTRIKE_HOST} port {CSTRIKE_PORT} "
        f"with password {RCON_PASSWORD} and commands ['version', 'status']. Show me both responses."
    ))
    assert result.strip()
