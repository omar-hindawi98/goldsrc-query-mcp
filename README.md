# goldsrc-query-mcp

[![npm version](https://img.shields.io/npm/v/goldsrc-query-mcp)](https://www.npmjs.com/package/goldsrc-query-mcp)
[![license](https://img.shields.io/npm/l/goldsrc-query-mcp)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/omar-hindawi98/goldsrc-query-mcp/ci.yml?branch=main&label=CI)](https://github.com/omar-hindawi98/goldsrc-query-mcp/actions/workflows/ci.yml)

An MCP server that lets AI assistants query GoldSrc game servers (Half-Life, Counter-Strike 1.6, etc.) using the [goldsrc-query](https://www.npmjs.com/package/goldsrc-query) library.

---

## Tools

| Tool | Description |
| --- | --- |
| `ping` | Round-trip latency in milliseconds |
| `server_info` | Server name, map, player counts, VAC status, and more |
| `players` | Current player list with names, scores, and time in-game |
| `rules` | All server cvars |
| `rcon` | Send an RCON command and return the response |

---

## Installation

```bash
npm install -g goldsrc-query-mcp
```

**Requirements:** Node.js `>=20.12.0`

---

## Usage

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "goldsrc": {
      "command": "goldsrc-query-mcp"
    }
  }
}
```

Or run directly without installing:

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

---

## Tool reference

All tools accept `address` (required), `port` (default `27015`), and `timeout` (default `3000`ms).

### `ping`

```
address: "192.168.1.10"
port: 27015
```

Returns the round-trip latency in milliseconds.

### `server_info`

Returns server metadata as JSON - name, map, player counts, VAC status, server type, environment, and optional EDF fields.

### `players`

Returns the player list as JSON - index, name, score, and duration (seconds in-game) per player.

### `rules`

Returns all server cvars as JSON - total count and a list of `{ name, value }` pairs.

### `rcon`

```
address: "192.168.1.10"
password: "your_rcon_password"
command: "status"
```

Sends an RCON command over UDP using the GoldSrc RCON protocol and returns the server response.

---

## Development

```bash
npm run build        # compile TypeScript to dist/
npm run dev          # compile in watch mode
npm test             # run tests
npm run check        # lint + format (auto-fix)
npm run check:ci     # lint + format check (no writes, runs in CI)
```
