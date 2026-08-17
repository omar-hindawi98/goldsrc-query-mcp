import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const HOST = "127.0.0.1";
const PORT = 27015;
const RCON_PASSWORD = "e2e_test_password";

describe("goldsrc-query-mcp tools", () => {
	let client: Client;

	beforeAll(async () => {
		const transport = new StdioClientTransport({
			command: "node",
			args: ["dist/index.js"],
		});
		client = new Client({ name: "e2e", version: "1.0.0" });
		await client.connect(transport);
	});

	afterAll(async () => {
		await client?.close();
	});

	async function callTool(name: string, args: Record<string, unknown>) {
		const result = await client.callTool({ name, arguments: args });
		const content = result.content as Array<{ type: string; text: string }>;
		return content.map((c) => c.text).join("\n");
	}

	it("ping", async () => {
		const result = await callTool("ping", { address: HOST, port: PORT });
		expect(result).toMatch(/\d+ms/);
	});

	it("get_server_info", async () => {
		const result = await callTool("get_server_info", {
			address: HOST,
			port: PORT,
		});
		expect(result.toLowerCase()).toMatch(/counter-strike|e2e/);
	});

	it("get_players", async () => {
		const result = await callTool("get_players", { address: HOST, port: PORT });
		expect(result).toBeTruthy();
	});

	it("get_rules", async () => {
		const result = await callTool("get_rules", { address: HOST, port: PORT });
		expect(result).toMatch(/mp_|sv_/);
	});

	it("get_all", async () => {
		const result = await callTool("get_all", { address: HOST, port: PORT });
		expect(result.toLowerCase()).toMatch(/info|rules|players/);
	});

	it("send_rcon", async () => {
		const result = await callTool("send_rcon", {
			address: HOST,
			port: PORT,
			password: RCON_PASSWORD,
			command: "status",
		});
		expect(result.toLowerCase()).toMatch(/hostname|players|map/);
	});

	it("send_rcon_batch", async () => {
		const result = await callTool("send_rcon_batch", {
			address: HOST,
			port: PORT,
			password: RCON_PASSWORD,
			commands: ["version", "status"],
		});
		expect(result).toBeTruthy();
	});
});
