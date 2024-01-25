const { SlashCommandBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const emoji = require('../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setName('verificação')
		.setDescription('Configura o sistema de verificação.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('tipo')
				.setDescription('Configura o tipo de verificação').addStringOption(option =>
					option.setName('tipo')
						.setDescription('O tipo de verificação')
						.setRequired(true)
						.addChoices(
							{
								name: 'Letras',
								value: 'letras',
							},
							{
								name: 'Captcha',
								value: 'captcha',
							},
						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Configura o tipo de verificação').addStringOption(option =>
					option.setName('ativado')
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
				.setName('canal')
				.setDescription('Configura o canal de verificação').addChannelOption(option =>
					option.setName('canal')
						.setDescription('Nome do canal')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('Adiciona um cargo para novos membros').addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja adicionar')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('Remove um cargo para novos membros').addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja remover')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('enviar')
				.setDescription('Envia a mensagem de verificação')),
	async execute (interaction) {
		await interaction.deferReply();
		const type = interaction.options.getString('ativado');
		const type2 = interaction.options.getString('tipo');
		const channel = interaction.options.getChannel('canal');
		const role = interaction.options.getRole('cargo');
		if (interaction.options.getSubcommand() === 'tipo') {
			if (type2 === 'letras') {
				await interaction.client.db.guild.setVerificationType(interaction.guild.id, 'letters');
				const embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | O tipo de verificação foi definido para letras.`);
				return interaction.editReply({ embeds: [embed] });
			}
			if (type2 === 'captcha') {
				await interaction.client.db.guild.setVerificationType(interaction.guild.id, 'captcha');
				const embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | O tipo de verificação foi definido para captcha.`);
				return interaction.editReply({ embeds: [embed] });
			}
		}
		if (interaction.options.getSubcommand() === 'status') {
			if (type === 'on') {
				await interaction.client.db.guild.setVerification(interaction.guild.id, true);
				const embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | O sistema de verificação foi ativado.`);
				return interaction.editReply({ embeds: [embed] });
			}
			if (type === 'off') {
				await interaction.client.db.guild.setVerification(interaction.guild.id, false);
				const embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | O sistema de verificação foi desativado.`);
				return interaction.editReply({ embeds: [embed] });
			}
		}
		if (interaction.options.getSubcommand() === 'canal') {
			await interaction.client.db.guild.setVerificationChannel(interaction.guild.id, channel.id);
			const embed = new EmbedBuilder()
				.setColor('Green')
				.setDescription(`${emoji.success} | O canal de verificação foi definido para ${channel}.`);
			return interaction.editReply({ embeds: [embed] });
		}
		if (interaction.options.getSubcommand() === 'adicionar') {
			await interaction.client.db.guild.addVerificationRole(interaction.guild.id, role.id);
			const embed = new EmbedBuilder()
				.setColor('Green')
				.setDescription(`${emoji.success} | O cargo ${role} foi adicionado para novos membros.`);
			return interaction.editReply({ embeds: [embed] });
		}
		if (interaction.options.getSubcommand() === 'remover') {
			await interaction.client.db.guild.removeVerificationRole(interaction.guild.id, role.id);
			const embed = new EmbedBuilder()
				.setColor('Green')
				.setDescription(`${emoji.success} | O cargo ${role} foi removido para novos membros.`);
			return interaction.editReply({ embeds: [embed] });
		}
		if (interaction.options.getSubcommand() === 'enviar') {
			const channel = interaction.guild.channels.cache.get(await interaction.client.db.guild.getVerificationChannel(interaction.guild.id));
			const embed = new EmbedBuilder()
				.setColor('Green')
				.setDescription(`${emoji.success} | Clique no botão abaixo para verificar sua conta.`);
			const button = new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setLabel('Verificar')
				.setCustomId('verify');
			const actionRow = new ActionRowBuilder()
				.addComponents(button);
			await channel.send({ embeds: [embed], components: [actionRow] });
			const embed2 = new EmbedBuilder()
				.setColor('Green')
				.setDescription(`${emoji.success} | Mensagem enviada com sucesso.`);
			return interaction.editReply({ embeds: [embed2] });
		}
	}
};