module.exports = {
	Name: "epal",
	Aliases: ["ForeverAlone"],
	Author: "supinic",
	Cooldown: 10000,
	Description: "Fetches a random person from epal.gg - posts their description. If used on Supinic's channel with TTS on, and if they have an audio introduction, it will be played on stream.",
	Flags: ["mention"],
	Params: [
		{ name: "game", type: "string" },
		{ name: "gender", type: "string" },
		{ name: "sex", type: "string" }
	],
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function epal (context) {
		let games = await this.getCacheData({ type: "games" });
		if (!games) {
			const response = await sb.Got("GenericAPI", {
				method: "POST",
				responseType: "json",
				url: "https://play.epal.gg/web/product-type/list-by-user-online-games"
			});

			games = response.body.content.map(i => ({
				ID: i.id,
				name: i.name,
				gameID: i.gameNum
			}));

			await this.setCacheData({ type: "games" }, games, {
				expiry: 7 * 864e5 // 1 day
			});
		}

		let gameData = sb.Utils.randArray(games);
		if (context.params.game) {
			const gameNameList = games.map(i => i.name);
			const [bestMatch] = sb.Utils.selectClosestString(context.params.game, gameNameList, {
				fullResult: true,
				ignoreCase: true
			});

			if (bestMatch.score === 0) {
				return {
					success: false,
					reply: "No matching game could be found!"
				};
			}

			gameData = games.find(i => i.name === bestMatch.original);
		}

		let selectedSex = "1";
		if (context.params.gender || context.params.sex) {
			const gender = (context.params.gender ?? context.params.sex).toLowerCase();
			if (gender === "male") {
				selectedSex = "0";
			}
			else if (gender === "female") {
				selectedSex = "1";
			}
			else {
				return {
					success: false,
					reply: "No matching gender could be found!"
				};
			}
		}

		const profileKey = { gameID: gameData.ID, sex: selectedSex };
		let profilesData = await this.getCacheData(profileKey);
		if (!profilesData) {
			const response = await sb.Got("GenericAPI", {
				method: "POST",
				responseType: "json",
				url: "https://play.epal.gg/web/product-search/list",
				json: {
					pn: 1,
					ps: 20, // If set above 20, the resulting array is empty
					sex: selectedSex,
					orderField: 4,
					productType: gameData.ID,
					clientNo: "bb203a8d12"
				}
			});

			if (!response.body.content) {
				return {
					success: false,
					reply: `No profile data is currently available! Try again later.`
				};
			}

			profilesData = response.body.content.map(i => ({
				ID: i.userId,
				level: i.levelDesc,
				name: i.userName,
				gameLevel: i.levelName,
				description: i.introductionText,
				audioFile: i.introductionSpeech,
				profilePicture: i.cover,
				revenue: (i.serveNum)
					? sb.Utils.round(i.serveNum * i.price / 100, 2)
					: null,
				price: {
					regular: (i.price / 100),
					unit: i.priceUnitDesc ?? "hour",
					discount: (i.discountPrice)
						? sb.Utils.round(i.discountPrice / 100)
						: null,
					discountAmount: (i.discountAmount)
						? `${sb.Utils.round((1 - i.discountAmount) * 100)}%`
						: null
				}
			}));

			await this.setCacheData(profileKey, profilesData, { expiry: 864e5 });
		}

		if (profilesData.length === 0) {
			return {
				success: false,
				reply: "This game/gender combination has no active profiles!"
			};
		}

		const ttsData = sb.Command.get("tts").data;
		const {
			audioFile,
			description,
			gameLevel,
			name,
			revenue,
			price
		} = sb.Utils.randArray(profilesData);

		if (context.channel?.ID === 38 && sb.Config.get("TTS_ENABLED") && !ttsData.pending) {
			ttsData.pending = true;

			await sb.LocalRequest.playSpecialAudio({
				url: audioFile,
				volume: sb.Config.get("TTS_VOLUME"),
				limit: 20_000
			});

			ttsData.pending = false;
		}

		let type = "(other)";
		if (selectedSex === "0") {
			type = "(M)";
		}
		else if (selectedSex === "1") {
			type = "(F)";
		}

		const levelString = (gameLevel)
			? `at level ${gameLevel}`
			: "";

		const priceString = (price.discount)
			? `$${price.discount} (${price.discountAmount} discount!) per ${price.unit}`
			: `$${price.regular} per ${price.unit}`;

		const revenueString = (revenue !== null && revenue > 0)
			? `Total revenue: $${revenue}.`
			: "";

		const roleString = (gameData.role)
			? `${gameData.role} in`
			: "";

		return {
			reply: sb.Utils.tag.trim `
				${name} ${type} plays ${roleString} ${gameData.name} ${levelString} for ${priceString}.
				${revenueString}
				${description}
			`
		};
	}),
	Dynamic_Description: (async function (prefix) {
		const gameData = await this.getCacheData({ type: "games" });
		const games = (gameData)
			? gameData.map(i => `<li><code>${i.name}</code></li>`).sort().join("")
			: "<li>No game data available - use the command to populate the list!</li>";

		return [
			`Fetches a random description of a user profile from <a target="_blank" href="egirl.gg">egirl.gg</a>.`,
			`If this command is executed in Supinic's channel and TTS is on, the user introduction audio will be played.`,
			"",

			`<code>${prefix}ForeverAlone</code>`,
			"Random user, female only",
			"",

			`<code>${prefix}ForeverAlone sex:(male/female)</code>`,
			"Random user, specified sex only",
			"",

			`<code>${prefix}ForeverAlone game:(game)</code>`,
			"Random user, selected game only. Only uses the first word of the game you provide.",
			`List of games: <ul>${games}</ul>`
		];
	})
};
