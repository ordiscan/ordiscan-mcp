import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";
import { TxInputSchema } from "./inscriptions.js";

const action: McpAction = {
  tool: {
    name: "tx_runes",
    description: "Get runes in a transaction",
    inputSchema: zodToJsonSchema(TxInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { txid } = TxInputSchema.parse(request.params.arguments);

    const info = await getOrdiscanClient().tx.getRunes({
      txid,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
