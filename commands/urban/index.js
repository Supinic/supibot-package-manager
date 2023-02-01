module.exports = {
	Name: "urban",
	Aliases: null,
	Author: "supinic",
	Cooldown: 10000,
	Description: "Fetches the top definition of a given term from Urban Dictionary. You can append \"index:#\" at the end to access definitions that aren't first in the search.",
	Flags: ["external-input","mention","non-nullable","pipe"],
	Params: [
		{ name: "index", type: "number" }
	],
	Whitelist_Response: null,
	Static_Data: (() => ({
		timeout: 10000,
		fauxKey: "ab71d33b15d36506acf1e379b0ed07ee",
		brokenWords: ["as", "at", "but", "by", "for", "if", "in", "into", "of", "on", "or", "this", "to", "with"]
	})),
	Code: (async function urban (context, ...args) {
		if (args.length === 0) {
			return {
				success: false,
				reply: "No term has been provided!",
				cooldown: 2500
			};
		}

		const term = args.join(" ");
		const lowerTerm = term.toLowerCase();
		const response = await sb.Got("GenericAPI", {
			url: "https://api.urbandictionary.com/v0/define",
			searchParams: {
				api_key: this.staticData.fauxKey,
				term
			},
			throwHttpErrors: false,
			retry: {
				limit: 0
			},
			timeout: {
				request: this.staticData.timeout
			}
		});

		if (response.statusCode === 500) {
			const autocompleteResponse = await sb.Got("GenericAPI", {
				url: "https://api.urbandictionary.com/v0/autocomplete-extra",
				searchParams: {
					api_key: this.staticData.fauxKey,
					term
				},
				retry: {
					limit: 0
				},
				timeout: {
					request: this.staticData.timeout
				}
			});

			const match = autocompleteResponse.body.results.find(i => i.term.toLowerCase() === lowerTerm);
			if (match) {
				return {
					reply: `Short description: ${match.preview}`
				};
			}
			else {
				return {
					success: false,
					reply: sb.Utils.tag.trim `
						For whatever reason, UrbanDictionary cannot process this word! 
						Check it for yourself: https://api.urbandictionary.com/v0/define?term=${term}
					`
				};
			}
		}

		if (!response.body.list || response.body.result_type === "no_results") {
			return {
				success: false,
				reply: "No results found!"
			};
		}

		const items = response.body.list
			.filter(i => i.word.toLowerCase() === args.join(" ").toLowerCase())
			.sort((a, b) => b.thumbs_up - a.thumbs_up);

		const index = context.params.index ?? null;
		const item = items[index ?? 0];
		if (!item) {
			return {
				success: false,
				reply: (items.length === 0)
					? `No such definition exists!`
					: `No definition with index ${index ?? 0}! Maximum available: ${items.length - 1}.`
			};
		}

		let extra = "";
		if (items.length > 1 && index === null) {
			extra = `(${items.length - 1} extra definitions)`;
		}

		const thumbs = `(+${item.thumbs_up}/-${item.thumbs_down})`;
		const example = (item.example)
			? ` - Example: ${item.example}`
			: "";

		const content = (item.definition + example).replace(/[\][]/g, "");

		let url = "";
		if (typeof context.params.index !== "number" && items.length > 1) {
			if (term.includes(" ")) {
				url = `https://urbandictionary.com/define.php?term=${encodeURI(term)}`;
			}
			else {
				url = `https://urbandictionary.com/${encodeURI(term)}`;
			}
		}

		return {
			reply: `${url} ${extra} ${thumbs} ${content}`
		};
	}),
	Dynamic_Description: null
};
