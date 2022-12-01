module.exports = {
	name: "transliterate-cyrillic",
	type: "advanced-replacement",
	priority: null,
	description: "Transliterates the Cyrillic script into Latin - to avoid banphrases",
	definition: [
		{
			query: /([А-Я])/gi,
			replacer: (total, match) => sb.Utils.transliterate(match),
			context: {
				channels: [14]
			}
		}
	]
};
