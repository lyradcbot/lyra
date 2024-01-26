const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../config');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('undertale')
		.setDescription('Faz uma caixa de fala do undertale.')
		.addStringOption(option =>
			option.setName('texto')
				.setDescription('A sua frase filosófica.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('O usuário que irá falar.')
				.setRequired(false)),
	async execute (interaction) {
		await interaction.deferReply();
		const user = interaction.options.getUser('usuario') || interaction.user;
		const texto = interaction.options.getString('texto');
		await axios.get(config.imageServer + `/undertalebox?avatar=${user.displayAvatarURL({ size: 4096, extension: 'png' })}&text=${encodeURI(texto)}`, { responseType: 'arraybuffer' }).then(async response => {
			const base64 = Buffer.from(response.data, 'base64');
			const attachment = new AttachmentBuilder(base64, {
				name: 'undertale.png'
			});
			await interaction.editReply({ files: [attachment] });
		});
	},
};