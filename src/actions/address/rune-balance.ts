import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";
import { AddressInputSchema } from "./rare-sat-balance.js";

const action: McpAction = {
  tool: {
    name: "runes_balance",
    description: "Get the rune balances of a Bitcoin address",
    inputSchema: zodToJsonSchema(AddressInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { address } = AddressInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().address.getRunes({
      address,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
