module.exports = {
	Name: "channelfounderlist",
	Aliases: ["cfl", "founders"],
	Author: "supinic",
	Cooldown: 10000,
	Description: "Shows the list of founders for the specified (or current) channel. Does not \"ping\" the users in chat.",
	Flags: ["mention"],
	Params: [
		{ name: "includeDates", type: "boolean" },
		{ name: "subStatus", type: "boolean" }
	],
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function channelFounderList (context, channelName) {
		if (!channelName && context.platform.Name !== "twitch") {
			return {
				success: false,
				reply: `When not on Twitch, you must provide the channel name!`
			};
		}

		const channel = encodeURIComponent(channelName ?? context.channel.Name);
		const response = await sb.Got("Leppunen", `v2/twitch/founders/${channel}`);
		if (response.statusCode === 404) {
			return {
				success: false,
				reply: `There is no such channel with that name!`
			};
		}

		const separator = (context.params.subStatus) ? " " : ", ";
		const foundersString = response.body.founders.map(i => {
			let message = `${i.login[0]}\u{E0000}${i.login.slice(1)}`;
			if (context.params.subStatus) {
				const stillSubbed = (i.isSubscribed) ? "✅" : "⛔";
				message += ` ${stillSubbed}`;
			}
			if (context.params.includeDates) {
				const date = new sb.Date(i.entitlementStart);
				message += ` (${date.format("Y-m-d")})`;
			}

			return message;
		}).join(separator);

		return {
			reply: `Current founders list: ${foundersString}`
		};
	}),
	Dynamic_Description: (async (prefix) => [
		"Fetches the list of current founders of a given (or current) Twitch channel",
		"",

		`<code>${prefix}channelfounderlist</code>`,
		`<code>${prefix}cfl</code>`,
		`<code>${prefix}founders</code>`,
		`List of founders for the current channel.`,
		``,

		`<code>${prefix}cfl <u>(channel)</u></code>`,
		`List of founders for the provided channel.`,
		``,

		`<code>${prefix}cfl <u>includeDates:true</u></code>`,
		`<code>${prefix}cfl (channel) <u>includeDates:true</u></code>`,
		`Also provides the date when the given user became a founder.`,

		`<code>${prefix}cfl <u>subStatus:true</u></code>`,
		`<code>${prefix}cfl (channel) <u>subStatus:true</u></code>`,
		`Also provides whether or not that user is still subscribed`
	])
};
