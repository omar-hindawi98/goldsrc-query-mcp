# goldsrc-query-mcp

[![npm version](https://img.shields.io/npm/v/goldsrc-query-mcp)](https://www.npmjs.com/package/goldsrc-query-mcp)
[![license](https://img.shields.io/npm/l/goldsrc-query-mcp)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/omar-hindawi98/goldsrc-query-mcp/ci.yml?branch=main&label=CI)](https://github.com/omar-hindawi98/goldsrc-query-mcp/actions/workflows/ci.yml)
[![E2E](https://img.shields.io/github/actions/workflow/status/omar-hindawi98/goldsrc-query-mcp/e2e.yml?branch=main&label=E2E)](https://github.com/omar-hindawi98/goldsrc-query-mcp/actions/workflows/e2e.yml)

An MCP server that lets AI assistants query GoldSrc game servers (Half-Life, Counter-Strike 1.6, etc.) using the [goldsrc-query](https://www.npmjs.com/package/goldsrc-query) library.

---

## Tools

| Tool | Description |
| --- | --- |
| `ping` | Round-trip latency in milliseconds |
| `get_server_info` | Server name, map, player counts, VAC status, and more |
| `get_players` | Current player list with names, scores, and time in-game |
| `get_rules` | All server cvars |
| `get_all` | Server info, player list, and rules in one call |
| `send_rcon` | Send a single RCON command and return the response |
| `send_rcon_batch` | Send multiple RCON commands over a single authenticated connection |

---

## Installation

```bash
npx goldsrc-query-mcp
```

Or install globally:

```bash
npm install -g goldsrc-query-mcp
```

**Requirements:** Node.js `>=20.12.0`

---

## Usage

### Transports

The server supports three transports selected via the `MCP_TRANSPORT` environment variable (or the `--http` flag for HTTP).

#### stdio (default)

```bash
node dist/index.js
# or
npx goldsrc-query-mcp
```

#### HTTP

```bash
MCP_TRANSPORT=http MCP_PORT=3000 node dist/index.js
# shorthand flag
node dist/index.js --http
```

#### HTTPS

```bash
MCP_TRANSPORT=https MCP_PORT=443 MCP_TLS_CERT=cert.pem MCP_TLS_KEY=key.pem node dist/index.js
```

`MCP_TLS_CERT` and `MCP_TLS_KEY` must both be set; the server exits with an error if either is missing.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "goldsrc": {
      "command": "npx",
      "args": ["goldsrc-query-mcp"]
    }
  }
}
```

### Example prompts

- "What map is `192.168.1.10:27015` running?"
- "How many players are on the server at `cs.example.com`?"
- "Show me all the cvars on my server."
- "Run `sv_gravity 800` on my server at `192.168.1.10` with password `secret`."
- "Kick all bots and change the map to de_dust2 on my server."

---

## Tool reference

All tools accept `address` (required), `port` (default `27015`), and `timeout` (default `3000`ms).

### `ping`

Returns the round-trip latency in milliseconds.

### `get_server_info`

Returns server metadata as JSON - name, map, player counts, VAC status, server type, environment, and optional EDF fields.

### `get_players`

Returns the player list as JSON - index, name, score, and duration (seconds in-game) per player.

### `get_rules`

Returns all server cvars as JSON - total count and a list of `{ name, value }` pairs.

### `get_all`

Returns server info, player list, and rules in a single call. Use this instead of calling `get_server_info`, `get_players`, and `get_rules` separately.

### `send_rcon`

```
address:  "192.168.1.10"
password: "your_rcon_password"
command:  "status"
```

Sends a single RCON command and returns the server response.

### `send_rcon_batch`

```
address:  "192.168.1.10"
password: "your_rcon_password"
commands: ["sv_gravity 800", "mp_friendlyfire 1", "changelevel de_dust2"]
```

Sends multiple RCON commands over a single authenticated connection. Returns an array of `{ command, response }` pairs. Use instead of `send_rcon` when running more than one command.

