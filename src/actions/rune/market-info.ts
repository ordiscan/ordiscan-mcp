import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";
import { RuneInputSchema, trimRuneName } from "./info.js";

const action: McpAction = {
  tool: {
    name: "rune_market_info",
    description: "Get the latest price of a rune",
    inputSchema: zodToJsonSchema(RuneInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const args = RuneInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().rune.getMarketInfo({
      name: trimRuneName(args.runeName),
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
