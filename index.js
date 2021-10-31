(async () => {
	const commands = await require("./commands/index.js");

	module.exports = {
		commands
	};
})();
