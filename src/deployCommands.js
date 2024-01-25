const { REST, Routes } = require('discord.js');
const db = require('./database/db.js');
const config = require('./config.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const warnings = [];

const loadCommands = (commands, warnings) => {
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);

			try {
				const command = require(filePath);

				if ('data' in command && 'execute' in command) {
					command.data.dm_permission = false;
					commands.push(command.data.toJSON());
				}
				else {
					warnings.push(`[WARNING] O comando no arquivo ${filePath} está faltando as propriedades "data" ou "execute".`);
				}
			}
			catch (error) {
				warnings.push(`[ERROR] Falha ao carregar comando do arquivo ${filePath}: ${error.message}`);
			}
		}
	}
};

const rest = new REST().setToken(config.client.token);

(async () => {
	try {
		loadCommands(commands, warnings);

		console.log(`[SLASH] Recarregando ${commands.length} slash commands.`.cyan);
		const data = await rest.put(
			Routes.applicationCommands(config.client.id),
			{ body: commands },
		);

		await db.bot.updateBot({ commands: { commands: data } });
		console.log(`[SLASH] Recarregados ${data.length} slash commands.`.green);

		warnings.forEach(warning => console.warn(warning.red));
	}
	catch (error) {
		console.error(error);
	}
})();
