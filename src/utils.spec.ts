import { error, text } from "./utils.js";

describe("text", () => {
	it("returns string as-is", () => {
		expect(text("42ms")).toEqual({ content: [{ type: "text", text: "42ms" }] });
	});

	it("serializes objects as pretty JSON", () => {
		const result = text({ a: 1 });
		expect(result.content[0].text).toBe(JSON.stringify({ a: 1 }, null, 2));
	});
});

describe("error", () => {
	it("returns isError: true with Error message", () => {
		expect(error(new Error("timed out"))).toEqual({
			content: [{ type: "text", text: "timed out" }],
			isError: true,
		});
	});

	it("coerces non-Error values to string", () => {
		expect(error("bad password")).toEqual({
			content: [{ type: "text", text: "bad password" }],
			isError: true,
		});
	});
});
