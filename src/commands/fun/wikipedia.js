const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wikipedia')
		.setDescription('Pesquisa sobre tudo.').addStringOption(option =>
			option.setName('termo')
			  .setDescription('O termo para pesquisar')
			  .setRequired(true)),
	async execute (interaction) {
		await interaction.deferReply();
		const word = interaction.options.getString('termo');
		await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`).then(async (res) => {
			const wikipedia = res.data;
			const embed = new EmbedBuilder()
				.setTitle(`${emoji.wikipedia} ` + wikipedia.title)
				.setURL(wikipedia.content_urls.desktop.page)
				.setDescription(wikipedia.extract)
				.setColor('Blue')
				.setFooter({
					text: `ID do usuário: ${interaction.user.id}`,
					iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
				});
			if (wikipedia.thumbnail) {
				embed.setThumbnail(wikipedia.thumbnail.source);
			}
			else {
				embed.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 }));
			}
			if (wikipedia.originalimage) {
				embed.setImage(wikipedia.originalimage.source);
			}
			interaction.editReply({ embeds: [embed] });
		});
	},
};