const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wikipedia')
		.setDescription('Pesquisa sobre algo na wikipédia.')
		.addStringOption(option =>
			option.setName('termo')
				.setDescription('O termo que deseja pesquisar.')
				.setRequired(true)),
	async execute (interaction) {
		await interaction.deferReply();
		const word = interaction.options.getString('termo');

		try {
			const response = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`);

			if (!response.status === 200) {
				throw new Error(`Erro na requisição: ${response.status}`);
			}

			const wikipedia = response.data;
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
		}
		catch (error) {
			console.error(error);
			const notFound = new EmbedBuilder()
				.setDescription(`${emoji.error} ${interaction.member} **|** Não encontrei nada sobre "${word}".`)
				.setColor('Red')
				.setFooter({
					text: `ID do usuário: ${interaction.user.id}`,
					iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
				});
			interaction.editReply({
				embeds: [notFound]
			});
		}
	},
};
