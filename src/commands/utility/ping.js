const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply(`:ping_pong: Pong!\n**API Ping:** \`${interaction.client.ws.ping}ms\`\n**WebSocket Ping:** \`${Date.now() - interaction.createdTimestamp}ms\``);

	},
};