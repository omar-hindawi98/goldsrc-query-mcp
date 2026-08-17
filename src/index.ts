import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { readFileSync } from "node:fs";
import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { toNodeHandler } from "@modelcontextprotocol/node";
import pkg from "../package.json" with { type: "json" };
import { registerTools } from "./tools.js";

function factory() {
	const server = new McpServer({ name: pkg.name, version: pkg.version });
	registerTools(server);
	return server;
}

const transport = process.env.MCP_TRANSPORT ?? (process.argv.includes("--http") ? "http" : "stdio");

if (transport === "http" || transport === "https") {
	const port = Number(process.env.MCP_PORT ?? 3000);
	const handler = createMcpHandler(factory);
	const nodeHandler = toNodeHandler(handler);

	if (transport === "https") {
		const tlsCert = process.env.MCP_TLS_CERT;
		const tlsKey = process.env.MCP_TLS_KEY;
		if (!tlsCert || !tlsKey) {
			process.stderr.write("MCP_TLS_CERT and MCP_TLS_KEY must be set for HTTPS transport\n");
			process.exit(1);
		}
		const server = createHttpsServer(
			{ cert: readFileSync(tlsCert), key: readFileSync(tlsKey) },
			nodeHandler,
		);
		server.listen(port, () => {
			process.stderr.write(`MCP HTTPS server listening on port ${port}\n`);
		});
	} else {
		const server = createHttpServer(nodeHandler);
		server.listen(port, () => {
			process.stderr.write(`MCP HTTP server listening on port ${port}\n`);
		});
	}
} else {
	serveStdio(factory);
}
