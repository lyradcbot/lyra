const emoji = require('../modules/emojis.json');
const { Colors, EmbedBuilder } = require('discord.js');

module.exports = (client) => {
	client.vulkava.on('recordFinished', async (node, guildId, id) => {
		const file = await node.getRecord(guildId, id);

		client.guilds.cache.get(guildId);
		const channel = client.channels.cache.get(id);
		const embed = new EmbedBuilder()
			.setDescription(`${emoji.volume} **|** A gravação terminou!`)
			.setColor(Colors.Blurple);
		channel.send({
			embeds: [embed],
			files: [
				  {
					name: 'recorded.mp3',
					attachment: file
				  }
			]
		  });

		client.records.delete(guildId);
		node.deleteRecord(guildId, id);
	});
	client.vulkava.on('trackStart', async (player, track) => {
		const channel = client.channels.cache.get(player.textChannelId);
		const playlist = {
			'description': `${emoji.music} **|** Tocando agora: \`${track.title.replace(/`/g, '')}\`.`,
			'color': Colors.Blurple
		};
		const queue = [];
		queue.push(track);
		player.queue.tracks.map(track => {
			queue.push(track);
		});
		await client.db.lavalink.checkPlayer(player.guildId);
		await client.db.lavalink.updatePlayer(player.guildId, player.voiceChannelId, player.textChannelId, player.selfDeaf, queue);
		await channel.send({
			embeds: [playlist]
		});
	});

	client.vulkava.on('queueEnd', async (player) => {
		const channel = client.channels.cache.get(player.textChannelId);
		const playlist = {
			'description': `${emoji.soundoff} **|** A fila de reprodução acabou, estou me desconectando do canal de voz.`,
			'color': Colors.Blurple
		};
		await client.db.lavalink.checkPlayer(player.guildId);
		await client.db.lavalink.updatePlayer(player.guildId, player.voiceChannelId, player.textChannelId, player.selfDeaf, []);
		await channel.send({
			embeds: [playlist]
		});
		player.destroy();
	});

	client.vulkava.on('error', (node, err) => {
		console.error(`[ VULKAVA ] Error on node ${node.identifier}`, err.message);
	});

	client.on('raw', (packet) => client.vulkava.handleVoiceUpdate(packet));
};
