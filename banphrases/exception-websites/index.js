module.exports = {
	name: "websites",
	type: "advanced-replacement",
	priority: null,
	description: "Removes or replaces links to all websites except for those excluded",
	definition: [
		{
			/** @type {() => string | regex } */
			replacee: () => sb.Config.get("LINK_REGEX"),
			replacer: {}
			// (msg) => {
			// 	const regex = sb.Config.get("LINK_REGEX");
			// 	const linkList = msg.matchAll(regex);
			//
			// 	for (let [link, protocol] of linkList) {
			// 		const linkRegex = new RegExp(link.replace(/[-\/\\^$*+?.()|[\]{}]/gi, "\\$&"), "g");
			// 		if (link && !link.includes("http")) {
			// 			link = "https://" + link;
			//         	}
			//
			// 		const parsed = sb.Utils.parseURL(link);
			// 		if (parsed.hostname && !parsed.hostname.includes("supinic.com")) {
			// 			msg = msg.replace(linkRegex, "[LINK]");
			// 		}
			// 	}
			//
			// 	return msg;
			// }
		}
	]
};
