module.exports = [
	{
		name: "Name",
		failMessage: "non-empty string",
		checkCallback: (v) => (
			(v.type === "Literal")
			&& (typeof v.value === "string") && (v.value.length > 0)
		)
	},
	{
		name: "Aliases",
		failMessage: "Array of string Literals, or null Literal",
		checkCallback: (v) => (
			(v.type === "ArrayExpression" && v.elements.every(i => i.type === "Literal" && typeof i.value === "string"))
			|| (v.type === "Literal" && v.value === null)
		)
	},
	{
		name: "Description",
		valueKind: "Literal",
		valueTypes: ["string", "null"]
	},
	{
		name: "Cooldown",
		valueKind: "Literal",
		valueTypes: ["number"]
	},
	{
		name: "Flags",
		failMessage: "Object of string Literal keys and boolean Literal values, or string[], or null Literal",
		checkCallback: (v) => (
			(v.type === "ObjectExpression" && v.properties.every(i => i.key.type === "Literal" && typeof i.key.value === "string" && i.value.type === "Literal" && typeof i.value.value === "boolean"))
			|| (v.type === "ArrayExpression" && v.elements.every(i => i.type === "Literal" && typeof i.value === "string"))
			|| (v.type === "Literal" && v.value === null)
		)
	},
	{
		name: "Author",
		valueKind: "Literal",
		valueTypes: ["string", "null"]
	},
	{
		name: "Whitelist_Response",
		valueKind: "Literal",
		valueTypes: ["string", "null"]
	},
	{
		name: "Code",
		failMessage: "non-generator FunctionExpression or ArrowFunctionExpression",
		checkCallback: (v) => (
			(v.type === "FunctionExpression" || v.type === "ArrowFunctionExpression")
			&& v.generator === false && (typeof v.method !== "boolean" || v.method === false)
		)
	},
	{
		name: "Static_Data",
		failMessage: "null literal, non-generator FunctionExpression or ArrowFunctionExpression",
		checkCallback: (v) => (
			(v.type === "Literal" && v.value === null)
			|| (
				(v.type === "FunctionExpression" || v.type === "ArrowFunctionExpression")
				&& v.generator === false
				&& (typeof v.method !== "boolean" || v.method === false)
			)
		)
	},
	{
		name: "Dynamic_Description",
		failMessage: "null literal, non-generator FunctionExpression or ArrowFunctionExpression",
		checkCallback: (v) => (
			(v.type === "Literal" && v.value === null)
			|| (
				(v.type === "FunctionExpression" || v.type === "ArrowFunctionExpression")
				&& v.generator === false
				&& (typeof v.method !== "boolean" || v.method === false)
			)
		)
	}
];