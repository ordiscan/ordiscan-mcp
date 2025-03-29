import { zodToJsonSchema } from "zod-to-json-schema";

import { Ordiscan } from "ordiscan";

const getOrdiscanClient = () => {
  if (!process.env.ORDISCAN_API_KEY) {
    console.error("Error: ORDISCAN_API_KEY environment variable is required");
    process.exit(1);
  }

  return new Ordiscan(process.env.ORDISCAN_API_KEY);
};

import { McpAction, ToolInputSchema } from "../types.js";
import { z } from "zod";

const InscriptionInfoInputSchema = z
  .object({
    inscriptionNumber: z.number().optional(),
    inscriptionId: z.string().optional(),
  })
  .refine(
    (data) =>
      data.inscriptionNumber !== undefined || data.inscriptionId !== undefined,
    {
      message:
        "You need to provide either an inscription number of an inscription ID!",
    },
  );

const action: McpAction = {
  tool: {
    name: "inscription_info",
    description: "Get inscription info",
    inputSchema: zodToJsonSchema(InscriptionInfoInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const args = InscriptionInfoInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().inscription.getInfo(
      args.inscriptionId || args.inscriptionNumber || 0,
    );

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
