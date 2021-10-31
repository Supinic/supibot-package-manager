module.exports = (async () => {
	const commands = await require("./commands/index.js");

	return {
		commands
	};
})();
