module.exports = {
	Name: "firstline",
	Aliases: ["fl"],
	Author: "supinic",
	Cooldown: 5000,
	Description: "Posts the target user's first chat line in the context of the current or a specified channel, and the date they sent it.",
	Flags: ["external-input","mention","opt-out","pipe"],
	Params: [
		{ name: "channel", type: "string" },
		{ name: "textOnly", type: "boolean" }
	],
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function firstLine (context, user) {
		const { channel } = context.params;
		if (!context.channel && !channel) {
			return {
				success: false,
				reply: "In order to use this command in private messages, you have to provide a channel parameter! Check the command's extended help for more info."
			};
		}

		const targetChannel = (channel)
			? sb.Channel.get(channel)
			: context.channel;

		if (!targetChannel) {
			return {
				success: false,
				reply: "Provided channel not found in the database!"
			}
		}

		const targetUser = (user)
			? await sb.User.get(user)
			: context.user;

		if (!targetUser) {
			return {
				success: false,
				reply: "Provided user not found in the database!"
			};
		}

		let metaData = await sb.Query.getRecordset(rs => rs
			.select("First_Message_Posted", "First_Message_Text")
			.from("chat_data", "Message_Meta_User_Alias")
			.where("User_Alias = %n", targetUser.ID)
			.where("Channel = %n", targetChannel.ID)
			.limit(1)
			.single()
		);

		if (!metaData) {
			return {
				success: false,
				reply: "That user has not said anything in the specified channel!"
			};
		}
		else if (!metaData.First_Message_Posted) {
			const dbChannelName = targetChannel.getDatabaseName();
			if (!await sb.Query.isTablePresent("chat_line", dbChannelName)) {
				return {
					success: false,
					reply: `No first line data is available for that user in the specified channel!`
				};
			}

			const lineData = await sb.Query.getRecordset(rs => rs
				.select("Text", "Posted")
				.from("chat_line", dbChannelName)
				.where("User_Alias = %n", targetUser.ID)
				.orderBy("ID ASC")
				.limit(1)
				.single()
			);

			const row = await sb.Query.getRow("chat_data", "Message_Meta_User_Alias");
			await row.load({
				User_Alias: targetUser.ID,
				Channel: targetChannel.ID
			});

			row.setValues({
				First_Message_Posted: lineData.Posted,
				First_Message_Text: lineData.Text
			});

			await row.save({ skipLoad: true });

			metaData = {
				First_Message_Posted: lineData.Posted,
				First_Message_Text: lineData.Text
			};
		}

		if (context.params.textOnly) {
			return {
				reply: metaData.First_Message_Text
			};
		}

		const prefix = (targetUser.ID === context.user.ID) ? "Your" : "That user's";
		return {
			partialReplies: [
				{
					bancheck: false,
					message: `${prefix} first message in the specified channel was (${sb.Utils.timeDelta(metaData.First_Message_Posted)}):`
				},
				{
					bancheck: true,
					message: metaData.First_Message_Text
				}
			]
		};
	}),
	Dynamic_Description: null
};
