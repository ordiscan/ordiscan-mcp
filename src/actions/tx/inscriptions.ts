import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { McpAction, ToolInputSchema } from "../../types.js";
import { getOrdiscanClient } from "../../ordiscan-client.js";

export const TxInputSchema = z.object({
  txid: z.string(),
});

const action: McpAction = {
  tool: {
    name: "tx_inscriptions",
    description: "Get inscriptions in a transaction",
    inputSchema: zodToJsonSchema(TxInputSchema) as ToolInputSchema,
  },

  handler: async (request) => {
    const { txid } = TxInputSchema.parse(request.params.arguments);

    const newInscriptions = await getOrdiscanClient().tx.getNewInscriptions({
      txid,
    });

    const transferredInscriptions =
      await getOrdiscanClient().tx.getInscriptionTransfers({
        txid,
      });

    const info = {
      newInscriptions,
      transferredInscriptions,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
};

export default action;
