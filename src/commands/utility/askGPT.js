const { SlashCommandBuilder } = require('discord.js');
const askGPT = require('../../modules/chatGPT');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('askgpt')
		.setDescription('Pergunte ao GPT-3')
		.addStringOption(option =>
			option.setName('pergunta')
				.setDescription('O que você quer perguntar.')
				.setRequired(true)),
	async execute (interaction) {
		const question = interaction.options.getString('pergunta');
		const response = await askGPT(question);
		await interaction.reply(response);
	}
};