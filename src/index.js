require('colors');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { Client, Collection, } = require('discord.js');
const { Vulkava } = require('vulkava');
const config = require('./config.js');

const client = new Client({ intents: 3276799 });

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

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`.red);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

process.on('unhandledRejection', (err) => console.log(`${err}`.red));

process.on('uncaughtException', (err) => console.log(`${err}`.red));

client.on('error', (err) => console.log(`${err}`.red));

client.on('raw', (packet) => client.vulkava.handleVoiceUpdate(packet));

mongoose.connect(config.database.uri)
	.then(() => {
		require('./modules/transcriptServer/index.js');
		console.log('[DATABASE] Database Ready!'.green);
		client.login(config.client.token);
		require('./deployCommands.js');
	});