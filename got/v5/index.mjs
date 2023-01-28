export const definition = {
	name: "V5",
	optionsType: "function",
	options: (() => ({
		prefixUrl: "https://api.twitch.tv/v5",
		headers: {
			Accept: "application/vnd.twitchtv.v5+json",
			"Client-ID": sb.Config.get("TWITCH_CLIENT_ID")
		}
	})),
	parent: "Global",
	description: null
};
