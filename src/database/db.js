const guildManager = require('./methods/guild.js');
const botManager = require('./methods/bot.js');
const lavalinkManager = require('./methods/players.js');

const methods = {
	guild: guildManager,
	bot: botManager,
	lavalink: lavalinkManager,
};

module.exports = methods;