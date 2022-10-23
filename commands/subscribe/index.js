module.exports = {
	Name: "subscribe",
	Aliases: ["unsubscribe"],
	Author: "supinic",
	Cooldown: 5000,
	Description: "Subscribe or unsubscribe to a plethora of events, such as a channel going live, or a suggestion you made being updated. Check the extended help for detailed info on each event.",
	Flags: ["mention","pipe","skip-banphrase"],
	Params: null,
	Whitelist_Response: null,
	Static_Data: (() => ({
		types: [
			{
				name: "Suggestion",
				aliases: ["suggest", "suggestion", "suggestions"],
				notes: "Whenever a suggestion you've made is updated, you will receive a private system reminder about it. Changes are detected every minute.",
				response: {
					added: "You will now receive private system reminders whenever a suggestion you made changes.",
					removed: "You will no longer receive suggestion reminders."
				}
			},
			{
				name: "Node.js updates",
				aliases: ["node", "nodejs", "node.js"],
				notes: "Every hour, supibot checks for new versions of Node.js. If a change is detected, you will be notified in #supinic.",
				response: {
					added: "You will now be pinged whenever a new version of Node.js is detected.",
					removed: "You will no longer receive pings when Node.js is updated."
				}
			},
			{
				name: "Runelite",
				aliases: ["runelite"],
				notes: "Every hour, supibot checks for new releases of Runelite. If a change is detected, you will be notified in #supinic.",
				response: {
					added: "You will now be pinged whenever a new release of Runelite is detected.",
					removed: "You will no longer receive pings when Runelite releases an update."
				}
			},
			{
				name: "GGG tracker",
				aliases: ["ggg", "poe"],
				notes: "Every minute, Supibot checks for new posts by GGG staff on their forums and Reddit. If you are subscribed, a new post like this will ping you in #supinic.",
				response: {
					added: "You will now be pinged whenever GGG staff posts.",
					removed: "You will no longer be pinged when GGG staff posts."
				}
			},
			{
				name: "Channel live",
				aliases: ["live", "online"],
				notes: "Usage: <code>subscribe/unsubscribe live (channel)</code> Every time a channel with Supibot in their chat goes live, users with this subscription for the specific channel will be notified of this via PMs.",
				handler: async function (context, subscription, ...args) {
					const { invocation } = context;
					if (!subscription.loaded) {
						if (invocation === "subscribe") {
							subscription.setValues({
								User_Alias: context.user.ID,
								Channel: null,
								Platform: context.platform.ID,
								Type: "Channel live",
								Data: "{}",
								Active: true
							});

							await subscription.save();
						}
						else if (invocation === "unsubscribe") {
							return {
								success: false,
								reply: "You're not subscribed yet, and can't unsubscribe!"
							};
						}
					}

					const data = JSON.parse(subscription.values.Data ?? "{}");
					data.channels = data.channels ?? [];

					const twitch = sb.Platform.get("twitch");
					const channels = args
						.map(i => sb.Channel.get(i.toLowerCase(), twitch))
						.filter(i => i !== null && i.Type !== "Inactive")
						.map(i => i.ID);

					if (channels.length === 0) {
						if (invocation === "unsubscribe") {
							subscription.values.Active = false;
							subscription.values.Data = null;
							await subscription.save();

							return {
								reply: "Successfully unsubscribed from all channels going live."
							};
						}
						else if (args.length === 0) {
							return {
								reply: (data.channels.length === 0)
									? "You're not subscribed to any channels."
									: `You're subscribed to these ${data.channels.length} channels: ${data.channels.map(i => sb.Channel.get(i).Name).join(", ")}`
							};
						}
						else {
							return {
								success: false,
								reply: "No proper channels provided! You can only subscribe to channels with Supibot."
							};
						}
					}

					let response;
					const lengthBefore = data.channels.length;
					if (invocation === "subscribe") {
						data.channels.push(...channels);
						data.channels = data.channels.filter((i, ind, arr) => arr.indexOf(i) === ind);

						response = (data.channels.length > lengthBefore)
							? `Successfully subscribed to ${data.channels.length - lengthBefore} channels going live.`
							: "You did not subscribe to any new channels.";
					}
					else if (invocation === "unsubscribe") {
						data.channels = data.channels.filter(i => !channels.includes(i));

						response = (data.channels.length < lengthBefore)
							? `Successfully unsubscribed from ${lengthBefore - data.channels.length} channels going live.`
							: "You did not unsubscribe from any channels.";
					}

					subscription.values.Active = (data.channels.length !== 0);
					subscription.values.Data = JSON.stringify(data, null, 4);
					await subscription.save();

					return {
						reply: response
					};
				}
			},
			{
				name: "Changelog",
				aliases: ["changelog"],
				notes: "Every minute, Supibot checks for new changelogs. If you are subscribed, you will receive a private system reminder from Supibot.",
				response: {
					added: "You will now receive a reminder whenever a new changelog is posted.",
					removed: "You will no longer receive changelog reminders."
				}
			},
			{
				name: "OSRS",
				aliases: ["osrs"],
				notes: "Every 15 minutes, Supibot checks for news on the Old School Runescape website. If a new article is detected, you will be notified in #supinic.",
				response: {
					added: "You will now be pinged whenever a new OSRS article is published.",
					removed: "You will no longer receive pings when a new OSRS article is published."
				}
			}
		]
	})),
	Code: (async function subscribe (context, type, ...args) {
		if (!type) {
			return {
				success: false,
				reply: "No event provided! Check the command's extended help for a list."
			};
		}

		type = type.toLowerCase();
		const event = this.staticData.types.find(i => i.name === type || i.aliases.includes(type));
		if (!event) {
			return {
				success: false,
				reply: "Incorrect event provided! Check the extended command's help for a list."
			};
		}

		const { invocation } = context;
		const subData = await sb.Query.getRecordset(rs => rs
			.select("ID", "Active")
			.from("data", "Event_Subscription")
			.where("User_Alias = %n", context.user.ID)
			.where("Type = %s", event.name)
			.limit(1)
			.single()
		);

		if (typeof event.handler === "function") {
			const subscription = await sb.Query.getRow("data", "Event_Subscription");
			if (subData?.ID) {
				await subscription.load(subData.ID);
			}

			return event.handler(context, subscription, ...args);
		}

		const response = (invocation === "subscribe") ? event.response.added : event.response.removed;
		if (subData) {
			if (
				(invocation === "subscribe" && subData.Active)
				|| (invocation === "unsubscribe" && !subData.Active)
			) {
				const preposition = (invocation === "subscribe") ? "to" : "from";
				return {
					success: false,
					reply: `You are already ${invocation}d ${preposition} this event!`
				};
			}

			await sb.Query.getRecordUpdater(rs => rs
				.update("data", "Event_Subscription")
				.set("Active", !subData.Active)
				.where("ID = %n", subData.ID)
			);

			return {
				reply: `Sucessfully ${invocation}d. ${response}`
			};
		}
		else {
			if (invocation === "unsubscribe") {
				return {
					success: false,
					reply: `You are not subscribed to this event, so you cannot unsubscribe!`
				};
			}

			const row = await sb.Query.getRow("data", "Event_Subscription");
			row.setValues({
				User_Alias: context.user.ID,
				Platform: context.platform.ID,
				Type: event.name,
				Active: true
			});

			await row.save();
			return {
				reply: `Sucessfully subscribed. ${response}`
			};
		}
	}),
	Dynamic_Description: (async function (prefix) {
		const { types } = this.staticData;
		const typesList = types.map(i => sb.Utils.tag.trim `
			<li>
				<code>${i.name}</code>
				<br>Aliases: ${i.aliases.map(j => `<code>${j}</code>`).join(", ") || "(none)"}
				<br>${i.notes}			
			</li>
		`).join("");

		return [
			"Subscribes or unsubscribes your account from an event in Supibot's database.",
			"Depending on the event, you will be notified in different ways.",
			"",

			`<code>${prefix}subscribe (type)</code>`,
			"You will be subscribed to a given event.",
			"",

			`<code>${prefix}unsubscribe (type)</code>`,
			"You will be unsubscribed from a given event.",
			"",

			"List of available events:",
			`<ul>${typesList}</ul>`
		];
	})
};
