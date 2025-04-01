import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";

export const InscriptionTraitsInputSchema = z.object({
  inscriptionId: z.string(),
});

const action: McpAction = {
  tool: {
    name: "inscription_traits",
    description: "Get the traits of an inscription",
    inputSchema: zodToJsonSchema(
      InscriptionTraitsInputSchema,
    ) as ToolInputSchema,
  },

  handler: async (request) => {
    const { inscriptionId } = InscriptionTraitsInputSchema.parse(
      request.params.arguments,
    );

    const info = await getOrdiscanClient().inscription.getTraits({
      inscriptionId,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
