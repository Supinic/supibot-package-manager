module.exports = {
	Name: "statistics",
	Aliases: ["stat", "stats"],
	Author: "supinic",
	Last_Edit: "2020-09-08T17:25:36.000Z",
	Cooldown: 10000,
	Description: "Posts various statistics regarding you, e.g. total afk time.",
	Flags: ["mention","pipe"],
	Whitelist_Response: null,
	Static_Data: ({
		types: [
			{
				names: ["aliases"],
				description: "Checks the global data for user-created supibot command aliases.",
				execute: async () => {
					const users = await sb.Query.getRecordset(rs => rs
						.select("ID")
						.from("chat_data", "User_Alias")
						.join({
							toTable: "User_Alias_Data",
							on: "User_Alias.ID = User_Alias_Data.User_Alias"
						})
						.flat("ID")
					);
	
					const usersData = (await sb.User.getMultiple(users)).filter(i => i.Data.aliasedCommands);
					const aliases = usersData.flatMap(i => Object.values(i.Data.aliasedCommands ?? {}));
					return {
						reply: `There are currently ${aliases.length} active command aliases, used by ${usersData.length} users.`
					}
				}
			},
			{
				names: ["total-afk", "afk", "gn", "brb", "food", "shower", "lurk", "poop", "work", "study"],
				description: "Checks the total time you have been afk for. Each status type is separate, you can use total-afk to check all of them combined.",
				execute: async (context, type, ...args) => {
					const data = await sb.Query.getRecordset(rs => {
						rs.select("COUNT(*) AS Amount")
							.select("SUM(UNIX_TIMESTAMP(Ended) - UNIX_TIMESTAMP(Started)) AS Delta")
							.from("chat_data", "AFK")
							.where("User_Alias = %n", context.user.ID)
							.single();
	
						if (type === "total-afk") {
							// Do not add a condition - counts totals
						}
						else if (type === "afk") {
							rs.where("Status = %s OR Status IS NULL", type);
						}
						else {
							rs.where("Status = %s", type);
						}
	
						return rs;
					});
	
					const target = (type === "total-afk") ? "(all combined)" : type;
	
					if (!data?.Delta) {
						return {
							reply: `You have not been AFK with status "${target}" at all.`
						};
					}
					else {
						const delta = sb.Utils.timeDelta(sb.Date.now() + data.Delta * 1000, true);
						const average = sb.Utils.timeDelta(sb.Date.now() + (data.Delta * 1000 / data.Amount), true);
	
						return {
							reply: sb.Utils.tag.trim `
								You have been AFK with status "${target}"
								${data.Amount} times,
								for a total of ~${delta}.
								This averages to ~${average} spent AFK per invocation.
							`
						};
					}
				}
			},
			{
				names: ["sr"],
				description: "Checks various sr statistics on supinic's channel.",
				execute: async function execute (context, type, ...args) {
					let branch = null;
					let targetUser = null;
					let videoID = null;
	
					if (args.length === 0) {
						branch = "user";
						targetUser = context.user;
					}
					else {
						const [target] = args;
						const userCheck = await sb.User.get(target);
						if (userCheck) {
							branch = "user";
							targetUser = userCheck;
						}
						else {
							branch = "video";
							videoID = target;
						}
					}
	
					if (branch === "user") {
						return await this.helpers.fetchUserStats(targetUser);
					}
					else if (branch === "video") {
						return await this.helpers.fetchVideoStats(videoID);
					}
				},
	
				helpers: {
					fetchUserStats: async function (targetUser) {
						const requests = await sb.Query.getRecordset(rs => rs
							.select("Link", "Length", "Start_Time", "End_Time")
							.from("chat_data", "Song_Request")
							.where("User_Alias = %n", targetUser.ID)
						);
	
						if (requests.length === 0) {
							return {
								reply: `No requested videos found.`
							};
						}
	
						const counter = {};
						let totalLength = 0;
						let mostRequested = null;
						let currentMax = 0;
	
						for (const video of requests) {
							if (typeof counter[video.Link] === "undefined") {
								counter[video.Link] = 0;
							}
	
							counter[video.Link]++;
							totalLength += (video.End_Time ?? video.Length) - (video.Start_Time ?? 0);
							if (currentMax < counter[video.Link]) {
								mostRequested = video.Link;
								currentMax = counter[video.Link];
							}
						}
	
						const total = sb.Utils.timeDelta(sb.Date.now() + totalLength * 1000, true);
						return {
							reply: sb.Utils.tag.trim `
								Videos requested: ${requests.length}, for a total runtime of ${total}.
								The most requested video is ${mostRequested} - queued ${currentMax} times.
							`
						};
					},
					fetchVideoStats: async function (videoID) {
						if (sb.Utils.linkParser.autoRecognize(videoID)) {
							videoID = sb.Utils.linkParser.parseLink(videoID);
						}
	
						const requests = await sb.Query.getRecordset(rs => rs
							.select("Added")
							.from("chat_data", "Song_Request")
							.where("Link = %s", videoID)
							.orderBy("ID DESC")
						);
	
						if (requests.length === 0) {
							return {
								reply: `No videos found by given ID.`
							};
						}
	
						const lastDelta = sb.Utils.timeDelta(requests[0].Added);
						return {
							reply: sb.Utils.tag.trim `
								This video has been requested ${requests.length} times.
								It was last requested ${lastDelta}.
							`
						};
					},
				}
			},
			{
				names: ["playsound", "ps"],
				description: "Checks the amount of times a given playsound has been used.",
				execute: async (context, type, name) => {
					const data = await sb.Query.getRecordset(rs => rs
						.select("Name", "Use_Count")
						.from("data", "Playsound")
					);
					
					if (name === "all" || name === "total") {
						const total = data.reduce((acc, cur) => acc += cur.Use_Count, 0);
						return {
							reply: `Playsounds have been used a total of ${total} times.`
						};
					}
									
					const target = data.find(i => i.Name === name);
					if (target) {
						return {
							reply: `That playsound has been used a total of ${target.Use_Count} times.`
						};
					}
					else {
						return {
							success: false,
							reply: `That playsound does not exist!`
						};
					}
				}
			},
			{
				names: ["cc", "tcc"],
				description: "Fetches the amount of cookies you (or someone else) have eaten so far. If you use \"total\", then you will see the total amount of cookies eaten.",
				execute: async function cookieCount (context, user) {
					if (context.platform.Name === "discord" && user && user.includes("@")) {
						user = await sb.Utils.getDiscordUserDataFromMentions(user, context.append) || context.user;
					}
				
					if (user === "total" || context.invocation === "tcc") {
						const cookies = await sb.Query.getRecordset(rs => rs
							.select("SUM(Cookies_Total) AS Total", "SUM(Cookie_Gifts_Sent) AS Gifts")
							.from("chat_data", "Extra_User_Data")
							.single()
						);
				
						return {
							reply: cookies.Total + " cookies have been eaten so far, out of which " + cookies.Gifts + " were gifted :)"
						};
					}
					else if (user === "list") {
						return {
							reply: "Check the cookie statistics here: https://supinic.com/bot/cookie/list"
						};
					}
				
					const targetUser = await sb.User.get(user || context.user, true);
					if (!targetUser) {
						return { reply: "Target user does not exist in the database!" };
					}
					else if (targetUser.Name === context.platform.Self_Name) {
						return { reply: "I don't eat cookies, sugar is bad for my circuits!" };
					}	
				
					const cookies = await sb.Query.getRecordset(rs => rs
						.select("Cookie_Today AS Today", "Cookies_Total AS Daily")
						.select("Cookie_Gifts_Sent AS Sent", "Cookie_Gifts_Received AS Received")
						.from("chat_data", "Extra_User_Data")
						.where("User_Alias = %n", targetUser.ID)
						.single()
					);
				
					const [who, target] = (context.user.ID === targetUser.ID)
						? ["You have", "you"]
						: ["That user has", "them"];
				
					if (!cookies || cookies.Daily === 0) {
						return { reply: who + " never eaten a single cookie!" };
					}
					else {
						// Today = has a cookie available today
						// Daily = amount of eaten daily cookies
						// Received = amount of received cookies, independent of Daily
						// Sent = amount of sent cookies, which is subtracted from Daily
				
						const total = cookies.Daily + cookies.Received - cookies.Sent + cookies.Today;
						const giftedString = (cookies.Sent === 0)
							? `${who} never given out a single cookie`
							: `${who} gifted away ${cookies.Sent} cookie(s)`;
				
						let reaction = "";
						const percentage = sb.Utils.round((cookies.Sent / total) * 100, 0);
						if (percentage <= 0) {
							reaction = "😧 what a scrooge 😒";
							if (cookies.Received > 100) {
								reaction += " and a glutton 😠🍔";
							}
						}
						else if (percentage < 15) {
							reaction = "🤔 a little frugal 😑";
						}
						else if (percentage < 40) {
							reaction = "🙂 a fair person 👍";
						}
						else if (percentage < 75) {
							reaction = "😮 a great samaritan 😃👌";
						}
						else {
							reaction = "😳 an absolutely selfless saint 😇";
						}
				
						let voidString = "";
						if (total < cookies.Received) {
							voidString = ` (the difference of ${cookies.Received - total} has been lost to the Void)`;
						}
				
						return {
							reply: `${who} eaten ${total} cookies so far. Out of those, ${cookies.Received} were gifted to ${target}${voidString}. ${giftedString} ${reaction}`
						};
					}
				}
			},
		]
	}),
	Code: (async function statistics (context, type, ...args) {
		if (!type) {
			return {
				reply: "No statistic type provided!",
				cooldown: { length: 1000 }
			}
		}
		
		type = type.toLowerCase();
		const target = this.staticData.types.find(i => i.names.includes(type));
	
		if (target) {
			return await target.execute(context, type, ...args);
		}
		else {
			return {
				reply: "Unrecognized statistic type provided!",
				cooldown: { length: 1000 }
			};
		}
	}),
	Dynamic_Description: async (prefix, values) => {
		const { types } = values.getStaticData();
		const list = types.map(i => {
			const names = i.names.sort().map(j => `<code>${j}</code>`).join("<br>");
			return `${names}<br>${i.description}`;
		}).join("");
	
		return [
			"Checks various statistics bound to you, found around supibot's data.",
			"",
	
			`<code>${prefix}stats (type)</code>`,
			"Statistics based on the type used",
			"",
	
			"Types:",
			`<ul>${list}</ul>`
		];	
	}
};
