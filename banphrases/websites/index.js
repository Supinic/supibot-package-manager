module.exports = {
	name: "websites",
	type: "simple-replacement",
	priority: null,
	description: "Removes or replaces links to certain websites",
	definition: [
		{
			// URL shorteners
			replacee: /\b((goo\.gl)|(t\.co)|(tinyurl\.com))\b/g,
			replacement: "[LINK]",
			context: {
				channels: [28]
			}
		},
		{
			// Screamers
			replacee: /pnrtscr\.com/gi,
			replacement: "prntscr.com",
			context: {
				global: true
			}
		},
		{
			// Scam websites
			replacee: /(https?:\/\/)?(www\.)?discord-informations\.ru.+\b/g,
			replacement: "[SCAM LINK]",
			context: {
				global: true
			}
		},
		{
			// Discord media URL swap
			replacee: /media\.discordapp\.net/g,
			replacement: "cdn.discordapp.com",
			context: {
				global: true
			}
		},
		{
			// Link protection fallback
			replacee: /https?:\/\//g,
			replacement: "",
			context: {
				channels: [14]
			}
		}
	]
};
