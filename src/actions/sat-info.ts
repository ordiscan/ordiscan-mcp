import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../types.js";
import { getOrdiscanClient } from "../ordiscan-client.js";

const SatInfoInputSchema = z.object({
  satNumber: z.number(),
});

const action: McpAction = {
  tool: {
    name: "sat_info",
    description: "Get sat info",
    inputSchema: zodToJsonSchema(SatInfoInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const args = SatInfoInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().sat.getInfo(args.satNumber);

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
