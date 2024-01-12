const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute (client) {
		console.log(`[CLIENT] Pronto! Estou ligado em ${client.user.tag}`.green);
		await client.vulkava.start(client.user.id);
		client.guilds.cache.map(async (guild) => {
			await client.db.lavalink.checkPlayer(guild.id);
			const data = await client.db.lavalink.getPlayer(guild.id);
			if (data.tracks.length > 0) {
				const player = client.vulkava.createPlayer({
					guildId: guild.id,
					voiceChannelId: data.voiceChannelId,
					textChannelId: data.textChannelId,
					selfDeaf: true
				});
				data.tracks.map(track => {
					player.queue.add(track);
				});
				player.connect();
				if (!player.playing) player.play();
			}
		});
	},
};