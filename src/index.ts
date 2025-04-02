#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import INSCRIPTION_LIST from "./actions/inscription/list.js";
import INSCRIPTION_INFO from "./actions/inscription/info.js";
import INSCRIPTION_TRAITS from "./actions/inscription/traits.js";
import INSCRIBE from "./actions/inscribe.js";
import SAT_INFO from "./actions/sat-info.js";
import RUNE_LIST from "./actions/rune/list.js";
import RUNE_INFO from "./actions/rune/info.js";
import RUNE_MARKET_INFO from "./actions/rune/market-info.js";
import RUNE_NAME_UNLOCK from "./actions/rune/unlock-date.js";
import COLLECTION_INFO from "./actions/collection/info.js";
import TX_INSCRIPTIONS from "./actions/tx/inscriptions.js";
import TX_RUNES from "./actions/tx/runes.js";
import ADDRESS_INSCRIPTIONS from "./actions/address/inscription-ids.js";
import ADDRESS_RUNES from "./actions/address/rune-balance.js";
import ADDRESS_BRC20 from "./actions/address/brc20-balance.js";
import ADDRESS_RARE_SATS from "./actions/address/rare-sat-balance.js";

const actions = [
  INSCRIPTION_LIST,
  INSCRIPTION_INFO,
  INSCRIPTION_TRAITS,
  INSCRIBE,
  SAT_INFO,
  RUNE_LIST,
  RUNE_INFO,
  RUNE_MARKET_INFO,
  RUNE_NAME_UNLOCK,
  COLLECTION_INFO,
  ADDRESS_INSCRIPTIONS,
  ADDRESS_RUNES,
  ADDRESS_BRC20,
  ADDRESS_RARE_SATS,
  TX_INSCRIPTIONS,
  TX_RUNES,
];

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
    tools: actions.map((action) => action.tool),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    const action = actions.find(
      (action) => action.tool.name === request.params.name,
    );

    if (!action) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    return action.handler(request);
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
