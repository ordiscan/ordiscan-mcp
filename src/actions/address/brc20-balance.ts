import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";
import { AddressInputSchema } from "./rare-sat-balance.js";

const action: McpAction = {
  tool: {
    name: "brc20_balance",
    description: "Get the BRC-20 balances of a Bitcoin address",
    inputSchema: zodToJsonSchema(AddressInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { address } = AddressInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().address.getBrc20Tokens({
      address,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
