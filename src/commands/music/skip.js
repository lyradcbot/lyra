const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula a música atual'),
	async execute (interaction) {
		const joinChannel = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** Você precisa entrar em um canal de voz para executar os comandos de música.`)
			.setColor('Blurple');
		if (!interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [joinChannel]
			});
		}
		const player = interaction.client.vulkava.players.get(interaction.guild.id);
		if (!player) {
			const noMusic = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** Não há música tocando no momento.`)
				.setColor('Blurple');
			return interaction.reply({ embeds: [noMusic] });
		}
		const skip = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** A música atual foi pulada.`)
			.setColor('Blurple');
		if (!player) return interaction.reply({ embeds: [skip] });
		player.skip();
		await interaction.reply({ embeds: [skip] });
	}
};