const { Events, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const emoji = require('../modules/emojis.json');

module.exports = {
	name: Events.MessageCreate,
	async execute (message) {
		if (message.channel.type === ChannelType.DM) return;
		const autoThreadEnabled = await message.client.db.guild.getAutoThreadStatus(message.guild.id);
		if (autoThreadEnabled) {
			const autoThreadChannels = await message.client.db.guild.getAutoThreadChannels(message.guild.id);
			if (!autoThreadChannels.includes(message.channel.id)) return;
			let startMessage = message.content;
			if (startMessage.length === 0) {
				startMessage = 'Thread criada automaticamente';
			}
			const thread = await message.startThread({
				name: message.content.slice(0, 10) + '...',
				autoArchiveDuration: 1440,
				reason: 'AutoThread',
			});
			const achiveButton = new ButtonBuilder()
				.setCustomId(`archivet;${message.author.id}`)
				.setLabel('Arquivar')
				.setEmoji(emoji.archive.replace(/</g, '').replace(/>/g, ''))
				.setStyle(ButtonStyle.Secondary);
			const editButton = new ButtonBuilder()
				.setCustomId(`editt;${message.author.id}`)
				.setLabel('Editar nome')
				.setEmoji(emoji.lapis.replace(/</g, '').replace(/>/g, ''))
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder()
				.addComponents(achiveButton, editButton);
			await thread.send({
				content: `Thread criada automaticamente por ${message.author}`,
				allowedMentions: { parse: [] },
				components: [row],
			});
		}
		// TODO: Caso for fazer algo, o autoThread é o único sistema disponível para bots if (message.author.bot) return;
	},
};