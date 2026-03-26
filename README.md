# mcp-forge

> The missing package manager for MCP servers.

[![npm version](https://img.shields.io/npm/v/mcp-forge)](https://www.npmjs.com/package/mcp-forge)
[![Registry](https://img.shields.io/badge/servers-20%2B-blue)](registry/servers.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

`mcp-forge` helps you discover and install [MCP (Model Context Protocol)](https://modelcontextprotocol.io) servers into Claude Desktop — no manual config editing required.

## Quick Start

```bash
# Search for servers
npx mcp-forge@latest search database

# Browse all servers
npx mcp-forge@latest list

# See details for a server
npx mcp-forge@latest info postgres

# Install a server into Claude Desktop
npx mcp-forge@latest install postgres
```

## Commands

| Command | Description |
|---|---|
| `search <query>` | Fuzzy search by keyword |
| `list [--category <cat>]` | Browse all servers, optionally by category |
| `info <id>` | Full details for one server |
| `install <id>` | Install into Claude Desktop config |

### Options

`--no-cache` — force a fresh registry fetch (applies to all commands)

## Categories

`files` · `git` · `databases` · `web` · `productivity` · `browser-automation` · `development`

## Adding a Server

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
