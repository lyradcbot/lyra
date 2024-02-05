const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('http')
		.setDescription('Comando para ver os status HTTP usando fotos de gatos')
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Comando para ver os status HTTP usando fotos de gatos')
				.addStringOption(option =>
					option.setName('website')
						.setDescription('Website que deseja verificar')
						.setRequired(true)
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cat')
				.setDescription('Comando para ver fotos de gatos')
				.addIntegerOption(option =>
					option.setName('status')
						.setDescription('Status HTTP que deseja ver')
						.setMaxValue(599)
						.setMinValue(100)
						.setRequired(true))),
	async execute (interaction) {
		await interaction.deferReply();
		if (interaction.options.getSubcommand() === 'status') {
			const website = interaction.options.getString('website');
			const formatedDomain = website.startsWith('http') ? website : `http://${website}`;
			const ipGrabberRegex = /(?:grabify|iplogger|ps3cfw|spylink|blasze|2noip|ipgrab|yourls|shorte\.st|adf\.ly|ouo\.io)\b/i;
			if (ipGrabberRegex.test(formatedDomain)) {
				const embed = new EmbedBuilder()
					.setTitle('IP Grabber')
					.setDescription('Você está tentando usar um IP Grabber, isso não é permitido.')
					.setColor('Red');
				return interaction.editReply({ embeds: [embed] });
			}
			try {
				const headers = {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
				};
				const response = await axios.get(formatedDomain, { headers });
				const status = response.status;

				const embed = new EmbedBuilder()
					.setTitle(`Status: ${status}`)
					.setDescription(`Status do site: ${formatedDomain}`)
					.setImage('attachment://cat.png')
					.setColor(status === 200 ? 'Green' : status >= 400 && status < 500 ? 'Yellow' : 'Red');

				const attachment = new AttachmentBuilder(`https://http.cat/${status}`, { name: 'cat.png' });

				await interaction.editReply({ embeds: [embed], files: [attachment] });
			}
			catch (error) {
				const errorStatus = error.response ? error.response.status : 'Erro na requisição';

				const embed = new EmbedBuilder()
					.setTitle(`Status: ${errorStatus}`)
					.setDescription(`Status do site: ${formatedDomain}`)
					.setColor('Red')
					.setImage('attachment://cat.png');

				const attachment = new AttachmentBuilder(`https://http.cat/${errorStatus}`, { name: 'cat.png' });

				await interaction.editReply({ content: '', embeds: [embed], files: [attachment] });
			}
		}
		if (interaction.options.getSubcommand() === 'cat') {
			const status = interaction.options.getInteger('status');
			const embed = new EmbedBuilder()
				.setTitle(`Status: ${status}`)
				.setImage('attachment://cat.png')
				.setColor(status === 200 ? 'Green' : status >= 400 && status < 500 ? 'Yellow' : 'Red');
			const attachment = new AttachmentBuilder(`https://http.cat/${status}`, { name: 'cat.png' });
			await interaction.editReply({ embeds: [embed], files: [attachment] });
		}
	},
};
