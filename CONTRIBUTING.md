# Contributing

## Getting started

```bash
git clone https://github.com/omar-hindawi98/goldsrc-query-mcp.git
cd goldsrc-query-mcp
npm install
```

## Development workflow

```bash
npm run build        # compile TypeScript to dist/
npm run dev          # compile in watch mode
npm test             # run unit tests
npm run test:watch   # run unit tests in watch mode
npm run check        # lint + format (auto-fix)
npm run check:ci     # lint + format check (no writes, runs in CI)
```

## E2E tests

End-to-end tests spin up a real Counter-Strike 1.6 server via Docker and run a [Strands Agents](https://strandsagents.com) agent against every MCP tool using a local Ollama model.

**Requirements:** Docker, Node.js >=20, Python >=3.11, [uv](https://docs.astral.sh/uv/)

```bash
# start dependencies
docker compose up -d cstrike ollama
docker compose exec ollama ollama pull llama3.2:1b

# build the MCP server
npm run build

# run e2e suite
uv run pytest tests/e2e/ -v
```

Environment variables accepted by the test suite:

| Variable | Default | Description |
| --- | --- | --- |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama API base URL |
| `AGENT_MODEL_NAME` | `llama3.2:1b` | Model to pull and use |

## Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org). Your commit message must match the format:

```
<type>(<scope>): <description>

feat(tools): add rcon tool
fix(server): handle connection timeout
docs: update README examples
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Commit messages are validated automatically on commit via Husky + commitlint.

## Pull requests

- Keep PRs focused - one concern per PR
- Add or update tests for any changed behaviour
- Make sure `npm run check:ci`, `npm run build`, and `npm test` all pass before opening a PR
- Fill in the PR template (What / Why / How to test)

## Releasing

Releases are automated via [Release Please](https://github.com/googleapis/release-please). Merging a PR with conventional commits to `main` will open or update a release PR automatically. No manual versioning needed.
