const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('httpcat')
		.setDescription('Comando para ver os status HTTP usando fotos de gatos')
		.addNumberOption(option =>
			option.setName('status_code')
				.setDescription('O código de status.')
				.setRequired(true)),
	async execute (interaction) {

		const attachment = new AttachmentBuilder('https://http.cat/' + interaction.options.getNumber('status_code'), {
			name: 'cat.png'
		});
		await interaction.reply({ files: [attachment] });
	}
};