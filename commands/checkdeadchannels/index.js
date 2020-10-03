module.exports = {
	Name: "checkdeadchannels",
	Aliases: ["cdc"],
	Author: "supinic",
	Last_Edit: "2020-09-08T17:25:36.000Z",
	Cooldown: 0,
	Description: "Iterates over active channels, takes the last posted message in each, and prints the dates + messages into a Pastebin paste. This is useful to determine if and which channels could potentially be removed from the bot because of prolonged inactivity.",
	Flags: ["pipe","skip-banphrase","system","whitelist"],
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function checkdeadchannels () {
		const promises = [];
		const regex = /^[^:]+$/;
		const channels = sb.Channel.data.filter(channel => (
			channel.Platform.Name === "twitch" && regex.test(channel.Name) && channel.Mode !== "Inactive"
		));
	
		for (const channel of channels) {
			const dbName = channel.getDatabaseName();
			promises.push((async () => {;
				const data = await sb.Query.getRecordset(rs => rs
					.select("User_Alias.Name AS Name", "Posted", "Text")
					.from("chat_line", dbName)
					.join("chat_data", "User_Alias")
					.orderBy(dbName + ".ID DESC")
					.limit(1)
					.single()
				);
	
				if (!data) {
					return {
						Posted: new Date(0),
						stuff: "Nothing?",
						channel: channel.Name
					};
				}
	
				data.Channel = channel.Name;
				return data;
			})());
		}
	
		const results = (await Promise.all(promises)).filter(Boolean).sort((a, b) => a.Posted - b.Posted);
		return { 
			reply: await sb.Pastebin.post(JSON.stringify(results, null, 4))
		};
	}),
	Dynamic_Description: null
};