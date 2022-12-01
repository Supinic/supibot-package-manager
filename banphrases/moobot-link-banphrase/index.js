module.exports = {
	name: "moobot-link-banphrase",
	type: "simple-replacement",
	priority: null,
	description: "Pads out the \"dot com\" string with more zero-width characters in order to escape a rather unfortunate banphrase by Moobot.",
	definition: [
		{
			replacee: /dot com/ig,
			replacement: "d\u{E0000}o\u{E0000}t \u{E0000}com",
			context: {
				channels: [971]
			}
		}
	]
};
