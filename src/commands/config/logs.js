const { SlashCommandBuilder, ChannelType } = require('discord.js');
const config = require('../../config.js');

const modules = config.auditLogModules.map(module => {
	return {
		name: module.name,
		value: module.id,
	};
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Configura o sistema de logs.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable')
				.setDescription('Ativa o sistema de logs.')
				.addBooleanOption(option =>
					option.setName('enabled')
						.setDescription('Ativa ou desativa o sistema de logs.')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Define o canal de logs.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Canal de logs.')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread, ChannelType.PrivateThread)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('addtype')
				.setDescription('Adiciona um tipo de log.')
				.addStringOption(option =>
					option.setName('type')
						.setDescription('Tipo de log.')
						.setAutocomplete(true)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('removetype')
				.setDescription('Remove um tipo de log.')
				.addStringOption(option =>
					option.setName('type')
						.setDescription('Tipo de log.')
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('all')
				.setDescription('Define se todos os logs serão ativados.')
				.addBooleanOption(option =>
					option.setName('all')
						.setDescription('Ativa ou desativa todos os logs.')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ignorechannel')
				.setDescription('Ignora um canal.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Canal.')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread, ChannelType.PrivateThread)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('removeignorechannel')
				.setDescription('Remove um canal ignorado.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Canal.')
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread, ChannelType.PrivateThread)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ignoreuser')
				.setDescription('Ignora um usuário.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Usuário.')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('removeignoreuser')
				.setDescription('Remove um usuário ignorado.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Usuário.')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ignorerole')
				.setDescription('Ignora um cargo.')
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Cargo.')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('removeignorerole')
				.setDescription('Remove um cargo ignorado.')
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Cargo.')
						.setRequired(true)
				)
		),
	async execute (interaction) {
		const subcommand = interaction.options.getSubcommand();
		const guildId = interaction.guild.id;
		if (subcommand === 'enable') {
			const enabled = interaction.options.getBoolean('enabled');
			await interaction.client.db.guild.setLogs(guildId, enabled);
			return interaction.reply(`O sistema de logs foi ${enabled ? 'ativado' : 'desativado'}.`);
		}
		if (subcommand === 'channel') {
			const channelId = interaction.options.getChannel('channel').id;
			await interaction.client.db.guild.setLogsChannel(guildId, channelId);
			return interaction.reply(`O canal de logs foi definido para <#${channelId}>.`);
		}
		if (subcommand === 'addtype') {
			const type = interaction.options.getString('type');
			await interaction.client.db.guild.addLogsType(guildId, type);
			return interaction.reply(`O tipo de log \`${type}\` foi adicionado.`);
		}
		if (subcommand === 'removetype') {
			const type = interaction.options.getString('type');
			await interaction.client.db.guild.removeLogsType(guildId, type);
			return interaction.reply(`O tipo de log \`${type}\` foi removido.`);
		}
		if (subcommand === 'all') {
			const all = interaction.options.getBoolean('all');
			await interaction.client.db.guild.setLogsAll(guildId, all);
			return interaction.reply(`Todos os logs foram ${all ? 'ativados' : 'desativados'}.`);
		}
		if (subcommand === 'ignorechannel') {
			const channel = interaction.options.getChannel('channel').id;
			await interaction.client.db.guild.addLogsIgnoredChannel(guildId, channel);
			return interaction.reply(`O canal <#${channel}> foi ignorado.`);
		}
		if (subcommand === 'removeignorechannel') {
			const channel = interaction.options.getChannel('channel').id;
			await interaction.client.db.guild.removeLogsIgnoredChannel(guildId, channel);
			return interaction.reply(`O canal <#${channel}> não é mais ignorado.`);
		}
		if (subcommand === 'ignoreuser') {
			const user = interaction.options.getUser('user').id;
			await interaction.client.db.guild.addLogsIgnoredUser(guildId, user);
			return interaction.reply(`O usuário <@${user}> foi ignorado.`);
		}
		if (subcommand === 'removeignoreuser') {
			const user = interaction.options.getUser('user').id;
			await interaction.client.db.guild.removeLogsIgnoredUser(guildId, user);
			return interaction.reply(`O usuário <@${user}> não é mais ignorado.`);
		}
		if (subcommand === 'ignorerole') {
			const role = interaction.options.getRole('role').id;
			await interaction.client.db.guild.addLogsIgnoredRole(guildId, role);
			return interaction.reply(`O cargo <@&${role}> foi ignorado.`);
		}
		if (subcommand === 'removeignorerole') {
			const role = interaction.options.getRole('role').id;
			await interaction.client.db.guild.removeLogsIgnoredRole(guildId, role);
			return interaction.reply(`O cargo <@&${role}> não é mais ignorado.`);
		}
	},
	async autocomplete (interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = modules;
		const filtered = choices.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase()));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.value })),
		);
	},
};