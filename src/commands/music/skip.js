const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula a música atual'),
	async execute (interaction) {
		const joinChannel = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** Você precisa entrar em um canal de voz para executar os comandos de música.`)
			.setColor('#cd949d');
		if (!interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [joinChannel]
			});
		}
		const player = interaction.client.vulkava.players.get(interaction.guild.id);
		if (!player) {
			const noMusic = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** Não há música tocando no momento.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [noMusic] });
		}
		const skip = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** A música atual foi pulada.`)
			.setColor('#cd949d');
		if (!player) return interaction.reply({ embeds: [skip] });
		player.skip();

		const playlist = {
			'description': `<:music:1194308116901285921> **|** Tocando agora: \`${player.track.title.replace(/`/g, '')}\`.`,
			'color': '#cd949d'
		};
		setTimeout(() => {
			interaction.channel.send({
				embeds: [playlist]
			});

		}, 3000);

		await interaction.reply({ embeds: [skip] });
	}
};