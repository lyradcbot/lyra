const emoji = require('../modules/emojis.json');
const { Colors } = require('discord.js');

module.exports = (client) => {
	client.vulkava.on('recordFinished', async (node, guildId, id) => {
		console.log(node);
		console.log(guildId);
		console.log(id);
		const file = await node.getRecord(guildId, id);

		client.guilds.cache.get(guildId);
		const channel = client.channels.cache.get(id);

		channel.send({
			content: 'Record finished!',
			files: [
				  {
					name: 'rec.mp3',
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
