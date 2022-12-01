module.exports = {
	name: "ascii-art",
	type: "count-change",
	priority: null,
	description: "Changes the message if too much ASCII art is detected",
	definition: [
		{
			query: /[█▄▀░▒▓\u2802-\u28ff]/g,
			count: 10,
			appendix: "[ASCII art is disabled on Twitch]",
			context: {
				platforms: ["twitch"]
			}
		}
	]
};
