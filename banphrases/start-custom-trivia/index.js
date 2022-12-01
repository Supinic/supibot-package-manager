module.exports = {
	name: "start-custom-trivia",
	type: "simple-replacement",
	priority: null,
	description: "Prevents the bot from being able to start custom trivias on another bot - as a proxy.",
	definition: [
		{
			replacee: /^`customtrivia\d*/,
			replacement: "[TRIVIA]",
			context: {
				global: true
			}
		}
	]
};
