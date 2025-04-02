# Ordiscan MCP Server

A model context protocol server for getting information about Ordinals and Runes on Bitcoin

https://github.com/user-attachments/assets/9dddacdf-add0-4a96-8444-5e0803e695a7

## Installation

To use with Claude Desktop, add the server config:

- On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ordiscan": {
      "command": "npx",
      "args": [
        "ordiscan-mcp@latest"
      ],
      "env": {
        "ORDISCAN_API_KEY": "YOUR_API_KEY"
      }
    },

  }
}
```

Note that you need an Ordiscan API key, which you can obtain for free [here](https://ordiscan.com/docs/api).

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

