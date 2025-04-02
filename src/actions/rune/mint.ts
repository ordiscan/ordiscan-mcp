import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { trimRuneName } from "./info.js";
import { ORDISCAN_URL } from "../../ordiscan-client.js";

export const MintRuneInputSchema = z.object({
  runeName: z.string(),
});

const action: McpAction = {
  tool: {
    name: "mint_rune",
    description: "Generate a link that lets the user mint a specific rune",
    inputSchema: zodToJsonSchema(MintRuneInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const args = MintRuneInputSchema.parse(request.params.arguments);

    const runeName = trimRuneName(args.runeName);

    const url = `${ORDISCAN_URL}/rune/${runeName}?mint=true`;

    return {
      content: [
        {
          type: "text",
          text: `Here is the link: "${url}". Please render it with markdown for the user.`,
        },
      ],
    };
  },
};

export default action;
