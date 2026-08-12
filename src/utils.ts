import { Query } from "goldsrc-query";

export async function withQuery<T>(host: string, p: number, t: number, fn: (q: Query) => Promise<T>): Promise<T> {
	const q = new Query(host, p, t);
	q.connect();
	try {
		return await fn(q);
	} finally {
		q.close();
	}
}

export function text(value: unknown) {
	const t = typeof value === "string" ? value : JSON.stringify(value, null, 2);
	return { content: [{ type: "text" as const, text: t }] };
}

export function error(err: unknown) {
	const t = err instanceof Error ? err.message : String(err);
	return { content: [{ type: "text" as const, text: t }], isError: true };
}

export async function safely<T>(fn: () => Promise<T>): Promise<T | ReturnType<typeof error>> {
	try {
		return await fn();
	} catch (err) {
		return error(err);
	}
}
