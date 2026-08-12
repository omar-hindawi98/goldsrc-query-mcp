import type { McpServer } from "@modelcontextprotocol/server";
import { baseSchema, rconBatchSchema, rconSchema } from "./schema.js";
import { safely, text, withQuery } from "./utils.js";

const readOnly = { readOnlyHint: true, destructiveHint: false };
const destructive = { readOnlyHint: false, destructiveHint: true };

export function registerTools(server: McpServer) {
	server.registerTool(
		"ping",
		{
			title: "Ping",
			description:
				"Measure round-trip latency to a GoldSrc server. Use to check if a server is reachable and responsive.",
			inputSchema: baseSchema,
			annotations: readOnly,
		},
		({ address: host, port: p, timeout: t }) =>
			safely(() =>
				withQuery(host, p, t, (q) => q.ping()).then((ms) => text(`${ms}ms`)),
			),
	);

	server.registerTool(
		"get_server_info",
		{
			title: "Get Server Info",
			description:
				"Get server metadata: name, map, player counts, VAC status, and more. Use to get an overview of a server or check if it is online.",
			inputSchema: baseSchema,
			annotations: readOnly,
		},
		({ address: host, port: p, timeout: t }) =>
			safely(() => withQuery(host, p, t, (q) => q.serverInfo()).then(text)),
	);

	server.registerTool(
		"get_players",
		{
			title: "Get Players",
			description:
				"Get the current player list with names, scores, and time in-game. Use to see who is on a server.",
			inputSchema: baseSchema,
			annotations: readOnly,
		},
		({ address: host, port: p, timeout: t }) =>
			safely(() => withQuery(host, p, t, (q) => q.players()).then(text)),
	);

	server.registerTool(
		"get_rules",
		{
			title: "Get Rules",
			description: "Get all server cvars. Use to inspect server configuration.",
			inputSchema: baseSchema,
			annotations: readOnly,
		},
		({ address: host, port: p, timeout: t }) =>
			safely(() => withQuery(host, p, t, (q) => q.rules()).then(text)),
	);

	server.registerTool(
		"get_all",
		{
			title: "Get All",
			description:
				"Get server info, player list, and rules in one call. Use this instead of calling get_server_info, get_players, and get_rules separately.",
			inputSchema: baseSchema,
			annotations: readOnly,
		},
		({ address: host, port: p, timeout: t }) =>
			safely(async () => {
				const [info, players, rules] = await Promise.all([
					withQuery(host, p, t, (q) => q.serverInfo()),
					withQuery(host, p, t, (q) => q.players()),
					withQuery(host, p, t, (q) => q.rules()),
				]);
				return text({ info, players, rules });
			}),
	);

	server.registerTool(
		"send_rcon",
		{
			title: "Send RCON",
			description:
				"Send a single RCON command and return the response. Use for one-off commands; prefer send_rcon_batch when sending multiple commands.",
			inputSchema: rconSchema,
			annotations: destructive,
		},
		({ address: host, port: p, timeout: t, password, command }) =>
			safely(() =>
				withQuery(host, p, t, async (q) => {
					await q.connectRcon(password);
					return q.sendRcon(command);
				}).then((r) => text(r.data)),
			),
	);

	server.registerTool(
		"send_rcon_batch",
		{
			title: "Send RCON Batch",
			description:
				"Send multiple RCON commands over a single authenticated connection. Use instead of rcon when running more than one command.",
			inputSchema: rconBatchSchema,
			annotations: destructive,
		},
		({ address: host, port: p, timeout: t, password, commands }) =>
			safely(() =>
				withQuery(host, p, t, async (q) => {
					await q.connectRcon(password);
					const results = [];
					for (const command of commands) {
						const r = await q.sendRcon(command);
						results.push({ command, response: r.data });
					}
					return text(results);
				}),
			),
	);
}
