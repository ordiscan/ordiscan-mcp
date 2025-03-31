import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";

export const CollectionInputSchema = z.object({
  name: z.string(),
});

const action: McpAction = {
  tool: {
    name: "inscription_collection_info",
    description: "Get info about an Ordinals collection",
    inputSchema: zodToJsonSchema(CollectionInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { name } = CollectionInputSchema.parse(request.params.arguments);
    const slug = name.replace(/ /g, "-").toLowerCase();

    const info = await getOrdiscanClient().collection.getInfo({
      slug,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
