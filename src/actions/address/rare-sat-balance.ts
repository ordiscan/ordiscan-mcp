import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";

const AddressInputSchema = z.object({
  address: z.string(),
});

const action: McpAction = {
  tool: {
    name: "rare_sat_balance",
    description: "Get the rare sats for a Bitcoin address",
    inputSchema: zodToJsonSchema(AddressInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { address } = AddressInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().address.getRareSats({
      address,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
