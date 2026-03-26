# Contributing to mcp-hub

## Adding an MCP Server

Edit `registry/servers.json` and add an entry following this schema:

```json
{
  "id": "my-server",
  "name": "My Server",
  "description": "One-line description of what this server does",
  "author": "github-username",
  "category": "files",
  "command": "npx",
  "args": [
    "-y",
    "@scope/my-mcp-server",
    {
      "name": "param-name",
      "description": "Human-readable prompt shown to the user during install",
      "required": true
    }
  ],
  "tags": ["keyword1", "keyword2"],
  "stars": 0,
  "url": "https://github.com/author/repo"
}
```

### Field Reference

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique kebab-case identifier matching `/^[a-z0-9]+(-[a-z0-9]+)*$/` |
| `name` | Yes | Human-readable display name |
| `description` | Yes | One-line description |
| `category` | Yes | One of: `files`, `git`, `databases`, `web`, `productivity`, `browser-automation`, `development` |
| `command` | Yes | Executable: `npx`, `uvx`, `docker`, etc. |
| `args` | Yes | Array of static strings or user-input descriptors (see below) |
| `author` | No | GitHub username or org |
| `tags` | No | Keywords for search matching |
| `stars` | No | GitHub star count |
| `url` | No | GitHub or homepage URL |

### Args

Each element in `args` is either:
- A **static string** (passed verbatim): `"-y"`, `"@scope/package"`
- A **user-input descriptor** (prompts the user at install time):
  ```json
  { "name": "param-name", "description": "Shown as prompt", "required": true }
  ```

### Known Limitations

- `env` map is not supported in v1. Servers requiring API keys must be configured manually after install.
- File writes are not concurrent-safe. Do not run two `install` commands simultaneously.

### Validation

Run `npm run validate-registry` locally before submitting a PR. CI will also run this check automatically.
