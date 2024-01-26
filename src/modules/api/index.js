module.exports = async (client) => {
	const fastify = require('fastify')();
	const cors = require('@fastify/cors');
	const { connection: db } = require('mongoose');

	const port = 5000;

	fastify.register(cors, {
	  origin: '*',
	});

	fastify.get('/status', async (request, reply) => {
	  const databasePing = async () => {
			const cNano = process.hrtime();
			await db.db.command({
		  ping: 1,
			});
			const time = process.hrtime(cNano);
			return (time[0] * 1e9 + time[1]) * 1e-6;
	  };

	  const [wsPing, databasePingResult] = await Promise.all([
			client.ws.ping,
			databasePing(),
	  ]);

	  const data = {
			guilds: client.guilds.cache.size,
			users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
			uptime: client.uptime,
			ready: client.readyAt,
			ping: {
		  ws: wsPing,
		  database: Math.round(databasePingResult),
			},
	  };

	  return reply.send(data);
	});

	fastify.get('/servers', async (request, reply) => {
	  const servers = client.guilds.cache.map(guild => ({
			name: guild.name,
			id: guild.id,
			owner: guild.ownerId,
			members: guild.memberCount,
			icon: guild.iconURL({ dynamic: true, size: 4096 }),
			createdAt: guild.createdAt,
			joinedAt: guild.joinedAt,
			region: guild.region,
			channels: guild.channels.cache.size,
			roles: guild.roles.cache.size,
			emojis: guild.emojis.cache.size,
			bans: guild.bans.cache.size,
			verified: guild.verified,
			premium: guild.premiumSubscriptionCount,
			premiumTier: guild.premiumTier,
	  }));

	  return reply.send(servers);
	});

	fastify.get('/commands', async (request, reply) => {
	  const data = await client.db.bot.getCommands();
	  const commands = data.commands;

	  return reply.send(commands);
	});

	fastify.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
	  console.log(`[GOGETA] (api) Servidor rodando em ${address}`.green);
	});
};
