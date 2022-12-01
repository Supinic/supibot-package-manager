module.exports = {
	name: "prevent-custom-trivia",
	type: "simple-replacement",
	priority: null,
	description: "Removes control characters.",
	definition: [
		{
			replacee: /\x01/g,
			replacement: "",
			context: {
				global: true
			}
		}
	]
};
