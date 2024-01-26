const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../config');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('laranjo')
		.setDescription('Faz uma montagem com o laranjo.')
		.addStringOption(option =>
			option.setName('piada')
				.setDescription('O texto da montagem.')
				.setRequired(true)),
	async execute (interaction) {
		await interaction.deferReply();
		const texto = interaction.options.getString('piada');
		await axios.get(config.imageServer + '/laranjo?text=' + encodeURI(texto), { responseType: 'arraybuffer' }).then(async response => {
			const base64 = Buffer.from(response.data, 'base64');
			const attachment = new AttachmentBuilder(base64, {
				name: 'laranjo.png'
			});
			await interaction.editReply({ files: [attachment] });
		});
	},
};