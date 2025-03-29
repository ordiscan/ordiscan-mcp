import { Ordiscan } from "ordiscan";

export const getOrdiscanClient = () => {
  if (!process.env.ORDISCAN_API_KEY) {
    console.error("Error: ORDISCAN_API_KEY environment variable is required");
    process.exit(1);
  }

  return new Ordiscan(process.env.ORDISCAN_API_KEY);
};
