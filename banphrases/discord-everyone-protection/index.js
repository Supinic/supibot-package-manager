module.exports = {
	name: "discord-everyone-protection",
	type: "simple-replacement",
	priority: null,
	description: "Changes the message if too much ASCII art is detected",
	definition: [
		{
			replacee: /@everyone/gi,
			replacement: "(@)everyone",
			context: {
				platforms: ["discord"]
			}
		}
	]
};
