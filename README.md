# Ordiscan MCP Server

A model context protocol server for getting information about Ordinals and Runes on Bitcoin

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

- On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ordiscan-server": {
      "command": "node",
      "args": [
        "/path/to/ordiscan-mcp/build/index.js"
      ],
      "env": {
        "ORDISCAN_API_KEY": "YOUR_API_KEY"
      }
    },

  }
}
```

Note that you need an Ordiscan API key, which you can obtain for free [here](https://ordiscan.com/docs/api).
