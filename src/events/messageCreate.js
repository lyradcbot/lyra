const { Events, ChannelType } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute (message) {
		if (message.author.bot) return;
		if (message.channel.type === ChannelType.DM) return;
		const autoThreadEnabled = await message.client.db.guild.getAutoThreadStatus(message.guild.id);
		if (autoThreadEnabled) {
			const autoThreadChannels = await message.client.db.guild.getAutoThreadChannels(message.guild.id);
			if (!autoThreadChannels.includes(message.channel.id)) return;
			const thread = await message.startThread({
				name: message.content.slice(0, 10) + '...',
				autoArchiveDuration: 1440,
				reason: 'AutoThread',
			});
			await thread.send({
				content: `Thread criada automaticamente por ${message.author}`,
			});
		}
	},
};