module.exports = {
	Name: "ocr",
	Aliases: null,
	Author: "supinic",
	Cooldown: 10000,
	Description: "Takes your image link and attempts to find the text in it by using OCR.",
	Flags: ["external-input","mention","non-nullable","pipe"],
	Params: [
		{ name: "force", type: "boolean" },
		{ name: "lang", type: "string" }
	],
	Whitelist_Response: null,
	Static_Data: (() => ({
		languages: {
			ara: "Arabic",
			bul: "Bulgarian",
			chs: "Chinese",
			hrv: "Croatian",
			cze: "Czech",
			dan: "Danish",
			dut: "Dutch",
			eng: "English",
			fin: "Finnish",
			fre: "French",
			ger: "German",
			gre: "Greek",
			hun: "Hungarian",
			kor: "Korean",
			ita: "Italian",
			jpn: "Japanese",
			pol: "Polish",
			por: "Portuguese",
			rus: "Russian",
			slv: "Slovenian",
			spa: "Spanish",
			swe: "Swedish",
			tur: "Turkish"
		}
	})),
	Code: (async function ocr (context, ...args) {
		let language = "eng";
		if (context.params.lang) {
			language = sb.Utils.modules.languageISO.getCode(context.params.lang, "iso6393");
			if (!language) {
				return {
					success: false,
					reply: "Provided language could not be parsed!"
				};
			}
		}

		if (language === "chi") {
			language = "chs"; // thanks for using standard codes everyone
		}

		if (!this.staticData.languages[language]) {
			const list = Object.values(this.staticData.languages).join(", ");
			return {
				success: false,
				reply: `Language is not supported! Use one of these: ${list}`,
				cooldown: 2500
			};
		}

		const rawLink = args.shift();
		if (!rawLink) {
			return {
				success: false,
				reply: "No link provided!",
				cooldown: 2500
			};
		}

		const linkData = require("url").parse(rawLink);
		const link = (linkData.protocol && linkData.host)
			? `https://${linkData.host}${linkData.path}`
			: `https://${linkData.path}`;

		let data;
		let statusCode;
		const key = { language, link };

		// If force is true, don't even bother fetching the cache data
		const cacheData = (context.params.force) ? null : await this.getCacheData(key);
		if (cacheData) {
			data = cacheData.data;
			statusCode = cacheData.statusCode;
		}
		else {
			const response = await sb.Got({
				method: "GET",
				responseType: "json",
				throwHttpErrors: false,
				url: "https://api.ocr.space/parse/imageurl",
				headers: {
					apikey: sb.Config.get("API_OCR_SPACE")
				},
				searchParams: {
					url: link,
					language,
					scale: "true",
					isTable: "true",
					OCREngine: "1",
					isOverlayRequired: "false"
				}
			});

			statusCode = response.statusCode;
			data = response.body;

			// set cache with no expiration - only if request didn't time out
			if (!data.ErrorMessage || !data.ErrorMessage.some(i => i.includes("Timed out"))) {
				await this.setCacheData(key, { data, statusCode }, {
					expiry: 30 * 864e5
				});
			}
		}

		if (statusCode !== 200 || data?.OCRExitCode !== 1) {
			return {
				success: false,
				reply: (data?.ErrorMessage)
					? data.ErrorMessage.join(" ")
					: data
			};
		}

		const result = data.ParsedResults[0].ParsedText;
		return {
			reply: (result.length === 0)
				? "No text found."
				: result
		};
	}),
	Dynamic_Description: (async (prefix, values) => {
		const { languages } = values.getStaticData();
		const list = Object.values(languages).map(name => `<li>${name}</li>`).join("");

		return [
			"Attempts to read a provided image with OCR, and posts the found text in chat.",
			"You can specify a language, and only 3-letter codes are supported, i.e. 'jpn'.",
			"By default, the language is English (eng).",
			"",

			`<code>${prefix}ocr <a href="https://i.imgur.com/FutGrGV.png">https://i.imgur.com/FutGrGV.png</a></code>`,
			"HELLO WORLD LOL NAM",
			"",

			`<code>${prefix}ocr lang:japanese <a href="https://i.imgur.com/4iK4ZHy.png">https://i.imgur.com/4iK4ZHy.png</a></code>`,
			"ロ明寝マンRetweeted 蜜柑すい@mikansul・May11 ティフアに壁ドンされるだけ",
			"",

			`<code>${prefix}ocr (link) force:true</code>`,
			"Since the results of ocr results are cached, use force:true to forcibly run another detection.",
			"",

			"List of supported languages:",
			list
		];
	})
};
