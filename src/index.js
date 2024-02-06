module.exports = async (shardId, shardCount) => {
	const fs = require('fs/promises');
	const path = require('path');
	const mongoose = require('mongoose');
	const { Client, Collection, GatewayIntentBits } = require('discord.js');
	const { Vulkava } = require('vulkava');
	const config = require('./config.js');

	const client = new Client({
		ws: { properties: { browser: 'Discord iOS' }
		},
		allowedMentions: {
			parse: ['users'],
			repliedUser: true
		},
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessages
		],
		shardCount: shardCount,
		shards: [shardId]
	});
	if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) config.lavalink.nodes = config.lavalink.nodes.filter(node => node.hostname !== 'localmachine');
	client.vulkava = new Vulkava({
		nodes: config.lavalink.nodes,
		defaultSearchSource: 'soundcloud',
		spotify: {
			clientId: config.lavalink.spotify.clientId,
			clientSecret: config.lavalink.spotify.clientSecret
		},
		sendWS: (guildId, payload) => {
			client.guilds.cache.get(guildId)?.shard.send(payload);
		}
	});

	client.records = new Map();
	client.bassboost = new Map();
	client.karaoke = new Map();
	client.nightCore = new Map();
	client.eightD = new Map();
	client.commands = new Collection();
	client.db = require('./database/db.js');
	require('./modules/playerEvents.js')(client);

	const loadCommands = async () => {
		const foldersPath = path.join(__dirname, 'commands');
		const commandFolders = await fs.readdir(foldersPath);

		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = await fs.readdir(commandsPath);

			for (const file of commandFiles.filter(file => file.endsWith('.js'))) {
				const filePath = path.join(commandsPath, file);
				const { data, execute } = require(filePath);

				if (data && execute) {
					client.commands.set(data.name, { data, execute, autocomplete: require(filePath).autocomplete });
				}
				else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`.red);
				}
			}
		}
	};

	const loadEvents = async () => {
		const eventsPath = path.join(__dirname, 'events');
		const eventFiles = await fs.readdir(eventsPath);

		for (const file of eventFiles.filter(file => file.endsWith('.js'))) {
			const filePath = path.join(eventsPath, file);
			const { name, execute, once } = require(filePath);

			if (once) {
				client.once(name, execute);
			}
			else {
				client.on(name, execute);
			}
		}
	};

	// process.on('unhandledRejection', (err) => console.log(`${err}`.red));
	// process.on('uncaughtException', (err) => console.log(`${err}`.red));
	// client.on('error', (err) => console.log(`${err}`.red));
	// client.on('raw', (packet) => client.vulkava.handleVoiceUpdate(packet));

	const startBot = async () => {
		try {
			await mongoose.connect(config.database.uri);
			console.log('[DATABASE] Database Ready!'.green);
			await loadCommands();
			await loadEvents();
			if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
				require('../packages/transcript/index.js');
				require('../packages/images/index.js');
			}
			await client.db.bot.checkBot();
			require('./deployCommands.js');
			await client.login(config.client.token);
		}
		catch (error) {
			console.error(`[ERROR] An error occurred: ${error.message}`.red);
			process.exitCode = 1;
		}
	};

	startBot();

};