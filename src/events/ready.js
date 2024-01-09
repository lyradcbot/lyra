const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute (client) {
		console.log(`[CLIENT] Pronto! Estou ligado em ${client.user.tag}`.green);
		await client.vulkava.start(client.user.id);
	},
};