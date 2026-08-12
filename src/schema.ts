import * as z from "zod/v4";

export const baseSchema = z.object({
	address: z.string().describe("IP address or hostname"),
	port: z.number().int().min(1).max(65535).default(27015).describe("Port number (default: 27015)"),
	timeout: z.number().int().min(100).default(3000).describe("Request timeout in milliseconds (default: 3000)"),
});

const rconBase = baseSchema.extend({
	password: z.string().describe("RCON password"),
});

export const rconSchema = rconBase.extend({
	command: z.string().describe("Command to execute"),
});

export const rconBatchSchema = rconBase.extend({
	commands: z.array(z.string()).min(1).describe("Commands to execute in order"),
});
