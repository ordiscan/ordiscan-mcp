import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../types.js";
import { getOrdiscanClient } from "../ordiscan-client.js";

const RuneInfoInputSchema = z.object({
  runeName: z.string(),
});

const action: McpAction = {
  tool: {
    name: "rune_info",
    description: "Get rune info",
    inputSchema: zodToJsonSchema(RuneInfoInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const args = RuneInfoInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().rune.getInfo({
      name: args.runeName.replace(/•/g, ""),
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
