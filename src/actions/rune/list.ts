import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";

export const InputSchema = z.object({
  sort: z.enum(["oldest", "newest"]),
});

const action: McpAction = {
  tool: {
    name: "runes_list",
    description: "Get a list of the oldest or newest runes",
    inputSchema: zodToJsonSchema(InputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { sort } = InputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().rune.list({
      sort,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
