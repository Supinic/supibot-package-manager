module.exports = {
	Name: "cloudflarestatus",
	Aliases: ["cloudflare","cfs"],
	Author: "supinic",
	Cooldown: 10000,
	Description: "Checks current Cloudflare status as a short summary.",
	Flags: ["developer","non-nullable","pipe"],
	Params: null,
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function cloudflareStatus () {
		const response = await sb.Got("GenericAPI", {
			url: "https://yh6f0r4529hb.statuspage.io/api/v2/summary.json",
			responseType: "json",
			throwHttpErrors: false,
			retry: 0,
			timeout: 5000
		});

		const { incidents, page, status, scheduled_maintenances: maintenances } = response.body;
		const update = sb.Utils.timeDelta(new sb.Date(page.updated_at));
		return {
			reply: sb.Utils.tag.trim `
				Cloudflare status: ${status.description};
				Incidents: ${incidents.length};
				Scheduled maintenances: ${maintenances.length}
				(last updated ${update})
			`
		};
	}),
	Dynamic_Description: null
};
