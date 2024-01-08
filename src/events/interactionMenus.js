const { Events, EmbedBuilder, } = require('discord.js');
module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {
		if (!interaction.isUserContextMenuCommand()) return;

		if(interaction.customId == 'GuildIcon') {
			const guild = interaction.client.guilds.cache.get(interaction.values.join(''));

			if(!guild.icon) return interaction.reply('Esse servidor não tem um icone');

			const embed = new EmbedBuilder()
				.setTitle(`Ícone de \`${guild.name}\``)
				.setImage(guild.iconURL({ dynamic: true, size: 2048 }))
				.setTimestamp()
				.setColor('#f283cc')
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });


			interaction.reply({ content: interaction.user.toString(), embeds: [embed], ephemeral: true });
		}
	}
};