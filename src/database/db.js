const guildManager = require('./methods/guild.js');
const botManager = require('./methods/bot.js');

const methods = {
	guild: guildManager,
	bot: botManager,
};

module.exports = methods;