import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import pkg from "../package.json" with { type: "json" };
import { registerTools } from "./tools.js";

serveStdio(() => {
  const server = new McpServer({ name: pkg.name, version: pkg.version });
  registerTools(server);
  return server;
});
