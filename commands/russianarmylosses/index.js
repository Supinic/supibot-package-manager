module.exports = {
	Name: "russianarmylosses",
	Aliases: ["ral"],
	Author: "boring_nick",
	Cooldown: 15000,
	Description: "Fetches the latest losses of the Russian Army in Ukraine as provided by the General Staff of Ukraine.",
	Flags: ["mention", "non-nullable", "pipe"],
	Params: [
		{ name: "term", type: "string" }
	],
	Whitelist_Response: null,
	Static_Data: (() => ({
		// While this data is provided by the API (https://russianwarship.rip/api-documentation/v1#/Terms/getAllStatisticalTerms),
		// some of the names are too long for chat and have been shortened.
		terms: {
			personnel_units: "Personnel",
			tanks: "Tanks",
			armoured_fighting_vehicles: "Combat vehicles",
			artillery_systems: "Artillery",
			mlrs: "MLRS",
			aa_warfare_systems: "AA",
			planes: "Planes",
			helicopters: "Helicopters",
			vehicles_fuel_tanks: "Vehicles/Fuel tanks",
			warships_cutters: "Ships",
			cruise_missiles: "Missiles",
			uav_systems: "UAV",
			special_military_equip: "Special equipment",
			atgm_srbm_systems: "ATGM/SRBM"
		}
	})),
	Code: (async function russianArmyLosses(context) {
		const terms = this.staticData.terms;
		const { term } = context.params;

		const response = await sb.Got("GenericAPI", {
			responseType: "json",
			throwHttpErrors: false,

			prefixUrl: "https://russianwarship.rip/api/v1",
			url: "statistics/latest"
		});
		const data = response.body["data"];
		const stats = data["stats"];
		const increase = data["increase"];

		let reply;
		if (term) {
			let key;
			for (const termKey in terms) {
				if (terms[termKey].toLowerCase() == term.toLowerCase()) {
					key = termKey;
					break
				}
			}

			if (key) {
				reply = `Latest Russian Army losses for ${term}: ${stats[key]}`;
				const statsIncrease = increase[key];
				if (statsIncrease != 0) {
					reply += `(+${statsIncrease})`;
				}
			} else {
				return {
					success: false,
					reply: `An invalid term has been provided!`
				};
			}
		} else {
			reply = "Latest Russian Army losses: ";
			for (const key in stats) {
				const term = terms[key] ? terms[key] : key; // In case there is a new term
				reply += `${term}: ${stats[key]}`;
				const statsIncrease = increase[key];
				if (statsIncrease != 0) {
					reply += `(+${statsIncrease})`;
				}
				reply += ", ";
			}
			reply = reply.slice(0, -2);
		}


		return {
			reply
		};
	}),
	Dynamic_Description: null
};
