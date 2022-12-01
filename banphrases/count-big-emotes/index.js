module.exports = {
	name: "count-big-emotes",
	type: "count-change",
	priority: null,
	description: "Replies with a different message if too many large emotes are detected",
	definition: [
		{
			query: "BAND",
			count: 10,
			change: "FeelsDankMan GuitarTime I am a band",
			context: {
				channels: [14]
			}
		},
		{
			query: /(NaM)|(FishMoley)|(YetiZ)|(TaxiBro)/g,
			count: 13,
			change: "[Tall message]",
			context: {
				channels: [14]
			}
		}
	]
};
