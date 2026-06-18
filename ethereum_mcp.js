import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

const server = new McpServer({
  name: "ethereum-balance-mcp",
  version: "1.0.0"
});

server.tool(
  "get_eth_balance",
  "Get Ethereum wallet balance",
  {
    address: z.string()
  },
  async ({ address }) => {
    try {
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);

      return {
        content: [
          {
            type: "text",
            text: `Balance of ${address}: ${ethBalance} ETH`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`
          }
        ]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
