const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setName('autorole')
		.setDescription('Configura o sistema de cargos automáticos.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('Adiciona um cargo para novos membros').addStringOption(option =>
					option.setName('tipo')
						.setDescription('Se você deseja adicionar um cargo para membros ou bots')
						.setRequired(true)
						.addChoices(
							{
								name: 'Membros',
								value: 'membros',
							},
							{
								name: 'Bots',
								value: 'bots',
							},
						))
				.addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja adicionar')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('Remove um cargo para novos membros').addStringOption(option =>
					option.setName('tipo')
						.setDescription('Se você deseja remover um cargo para membros ou bots')
						.setRequired(true)
						.addChoices(
							{
								name: 'Membros',
								value: 'membros',
							},
							{
								name: 'Bots',
								value: 'bots',
							},
						))
				.addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja remover')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Mostra o status do sistema de cargos automáticos').addStringOption(option =>
					option.setName('tipo')
						.setDescription('Se você deseja Ativar ou Desativar')
						.setRequired(true)
						.addChoices(
							{
								name: 'Ativar',
								value: 'on',
							},
							{
								name: 'Desativar',
								value: 'off',
							},
						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('listar')
				.setDescription('Lista os cargos automáticos').addStringOption(option =>
					option.setName('tipo')
						.setDescription('Se você deseja listar os cargos para membros ou bots')
						.setRequired(true)
						.addChoices(
							{
								name: 'Membros',
								value: 'membros',
							},
							{
								name: 'Bots',
								value: 'bots',
							},
						))),
	async execute (interaction) {
		if (interaction.options.getSubcommand() === 'adicionar') {
			const role = interaction.options.getRole('cargo');
			const type = interaction.options.getString('tipo');
			if (type === 'membros') {
				await interaction.client.db.guild.addAutoroleUser(interaction.guild.id, role.id);
				await interaction.client.db.guild.setAutorole(interaction.guild.id, true);
				return interaction.reply(`${emoji.success} | O cargo ${role} foi adicionado para novos membros.`);
			}
			if (type === 'bots') {
				await interaction.client.db.guild.addAutoroleBot(interaction.guild.id, role.id);
				await interaction.client.db.guild.setAutorole(interaction.guild.id, true);
				return interaction.reply(`${emoji.success} | O cargo ${role} foi adicionado para novos bots.`);
			}
		}
		if (interaction.options.getSubcommand() === 'remover') {
			const role = interaction.options.getRole('cargo');
			const type = interaction.options.getString('tipo');
			if (type === 'membros') {
				await interaction.client.db.guild.removeAutoroleUser(interaction.guild.id, role.id);
				return interaction.reply(`${emoji.success} | O cargo ${role} foi removido para novos membros.`);
			}
			if (type === 'bots') {
				await interaction.client.db.guild.removeAutoroleBot(interaction.guild.id, role.id);
				return interaction.reply(`${emoji.success} | O cargo ${role} foi removido para novos bots.`);
			}
		}
		if (interaction.options.getSubcommand() === 'status') {
			const type = interaction.options.getString('tipo');
			if (type === 'on') {
				await interaction.client.db.guild.setAutorole(interaction.guild.id, true);
				return interaction.reply(`${emoji.success} | O sistema de cargos automáticos foi ativado.`);
			}
			if (type === 'off') {
				await interaction.client.db.guild.setAutorole(interaction.guild.id, false);
				return interaction.reply(`${emoji.success} | O sistema de cargos automáticos foi desativado.`);
			}
		}
		if (interaction.options.getSubcommand() === 'listar') {
			const type = interaction.options.getString('tipo');
			if (type === 'membros') {
				const roles = await interaction.client.db.guild.getAutoroleUsers(interaction.guild.id);
				if (roles.length === 0) return interaction.reply(`${emoji.error} | Nenhum cargo foi adicionado para novos membros.`);
				const mapped = roles.map(role => `<@&${role}>`);
				const embed = new EmbedBuilder()
					.setTitle('AutoRole - ' + interaction.guild.name)
					.setDescription(`Cargos adicionados para novos membros: ${mapped.join(', ')}`)
					.setColor('#cd949d')
					.setTimestamp();
				return interaction.reply({ embeds: [embed] });
			}
			if (type === 'bots') {
				const roles = await interaction.client.db.guild.getAutoroleBots(interaction.guild.id);
				if (roles.length === 0) return interaction.reply(`${emoji.error} | Nenhum cargo foi adicionado para novos bots.`);
				const mapped = roles.map(role => `<@&${role}>`);
				const embed = new EmbedBuilder()
					.setTitle('AutoRole - ' + interaction.guild.name)
					.setDescription(`Cargos adicionados para novos bots: ${mapped.join(', ')}`)
					.setColor('#cd949d')
					.setTimestamp();
				return interaction.reply({ embeds: [embed] });
			}
		}
	}
};