const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../config');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('perfeito')
		.setDescription('Quando alguém diz que "nada é perfeito".')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('O usuário que será a perfeição.')
				.setRequired(false)),
	async execute (interaction) {
		await interaction.deferReply();
		const user = interaction.options.getUser('usuario') || interaction.user;
		await axios.get(config.imageServer + `/perfeito?avatar=${user.displayAvatarURL({ size: 4096, extension: 'png' })}`, { responseType: 'arraybuffer' }).then(async response => {
			const base64 = Buffer.from(response.data, 'base64');
			const attachment = new AttachmentBuilder(base64, {
				name: 'perfeito.png'
			});
			await interaction.editReply({ files: [attachment] });
		});
	},
};