import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../types.js";
import { getOrdiscanClient } from "../ordiscan-client.js";

export const InscribeInputSchema = z.object({
  content: z.string(),
  contentType: z.string(),
});

const action: McpAction = {
  tool: {
    name: "inscribe",
    description:
      "Generate a link to prepare for the inscription of the content",
    inputSchema: zodToJsonSchema(InscribeInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { content, contentType } = InscribeInputSchema.parse(
      request.params.arguments,
    );

    const { identifier } = (await getOrdiscanClient().fetch("/beta/inscribe", {
      method: "POST",
      body: JSON.stringify({ content, contentType }),
    })) as { identifier: string };

    const typeSlug = contentType === "text/plain" ? "text" : "html";

    const url = `http://localhost:3000/inscribe/${typeSlug}/${identifier}?pay=true`;

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
