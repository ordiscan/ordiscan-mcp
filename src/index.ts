#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import INSCRIPTION_INFO from "./actions/inscription-info.js";
import SAT_INFO from "./actions/sat-info.js";
import RUNE_INFO from "./actions/rune-info.js";
import ADDRESS_RARE_SATS from "./actions/address/rare-sat-balance.js";

const server = new Server(
  {
    name: "ordiscan-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      INSCRIPTION_INFO.tool,
      SAT_INFO.tool,
      RUNE_INFO.tool,
      ADDRESS_RARE_SATS.tool,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case INSCRIPTION_INFO.tool.name:
        return INSCRIPTION_INFO.handler(request);

      case SAT_INFO.tool.name:
        return SAT_INFO.handler(request);

      case RUNE_INFO.tool.name:
        return RUNE_INFO.handler(request);

      case ADDRESS_RARE_SATS.tool.name:
        return ADDRESS_RARE_SATS.handler(request);

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors
          .map(
            (e: z.ZodError["errors"][number]) =>
              `${e.path.join(".")}: ${e.message}`,
          )
          .join(", ")}`,
      );
    }
    throw error;
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ordiscan MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
