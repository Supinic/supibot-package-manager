module.exports = {
	Name: "firstfollowedchannel",
	Aliases: ["ffc"],
	Author: "supinic",
	Cooldown: 10000,
	Description: "Fetches the first channel you or someone else have ever followed on Twitch.",
	Flags: ["mention","non-nullable","opt-out","pipe"],
	Params: null,
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function firstFollowedChannel (context, target) {
		const { controller } = sb.Platform.get("twitch");
		const channelID = await controller.getUserID(target ?? context.user.Name);
		if (!channelID) {
			return {
				success: false,
				reply: "Could not match user to a Twitch user ID!"
			};
		}

		const response = await sb.Got("Kraken", {
			url: `users/${channelID}/follows/channels`,
			searchParams: {
				// If the limit is 1, and the followed channel is banned, then no response will be used...

				// UPDATE: apparently this can mess up the entire response if enough channels are N/A,
				// so just skip the limit altogether...
				// limit: "10"
				direction: "asc",
				sortby: "created_at"
			}
		});

		const { follows } = response.body;
		const who = (!target || context.user.Name === target.toLowerCase())
			? "you"
			: "they";

		if (follows.length === 0) {
			return {
				reply: `${sb.Utils.capitalize(who)} don't follow anyone.`
			};
		}
		else {
			const follow = follows[0];
			const followUser = (follow.channel.name.toLowerCase() === context.user.Name)
				? "you!"
				: follow.channel.name;

			const delta = sb.Utils.timeDelta(new sb.Date(follow.created_at), false, true);
			return {
				reply: `The channel ${who} have followed the longest is ${followUser}, since ${delta}.`
			};
		}
	}),
	Dynamic_Description: null
};
