/* eslint-disable no-case-declarations */
const { SlashCommandBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setName('verificação')
		.setDescription('Configura o sistema de verificação.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('tipo')
				.setDescription('Configura o tipo de verificação')
				.addStringOption(option =>
					option.setName('tipo')
						.setDescription('O tipo de verificação')
						.setRequired(true)
						.addChoices(
							{ name: 'Letras', value: 'letras' },
							{ name: 'Alphanumeric', value: 'alphanumeric' },
						))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Configura o tipo de verificação')
				.addStringOption(option =>
					option.setName('ativado')
						.setDescription('Se você deseja Ativar ou Desativar')
						.setRequired(true)
						.addChoices(
							{ name: 'Ativar', value: 'on' },
							{ name: 'Desativar', value: 'off' },
						))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('canal')
				.setDescription('Configura o canal de verificação')
				.addChannelOption(option =>
					option.setName('canal')
						.setDescription('Nome do canal')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('Adiciona um cargo para novos membros')
				.addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja adicionar')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('Remove um cargo para novos membros')
				.addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo que deseja remover')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('enviar')
				.setDescription('Envia a mensagem de verificação')
		),
	async execute (interaction) {
		await interaction.deferReply();

		const subcommandName = interaction.options.getSubcommand();
		const clientDbGuild = interaction.client.db.guild;

		switch (subcommandName) {
			case 'tipo':
				const type2 = interaction.options.getString('tipo');
				const type2Map = { letras: 'letters', alphanumeric: 'alphanumeric' };

				await clientDbGuild.setVerificationType(interaction.guild.id, type2Map[type2]);
				await interaction.editReply(`${emoji.success} | Tipo de verificação alterado para: ${type2}`);
				break;

			case 'status':
				const type = interaction.options.getString('ativado');
				await clientDbGuild.setVerification(interaction.guild.id, type === 'on');
				await interaction.editReply(`${emoji.success} | Sistema de verificação ${type === 'on' ? 'ativado' : 'desativado'}`);
				break;

			case 'canal':
				const channel = interaction.options.getChannel('canal');
				await clientDbGuild.setVerificationChannel(interaction.guild.id, channel.id);
				await interaction.editReply(`${emoji.success} | Canal de verificação alterado para: ${channel}`);
				break;

			case 'adicionar':
				const roleAdd = interaction.options.getRole('cargo');
				await clientDbGuild.addVerificationRole(interaction.guild.id, roleAdd.id);
				await interaction.editReply(`${emoji.success} | Cargo adicionado com sucesso.`);
				break;

			case 'remover':
				const roleRemove = interaction.options.getRole('cargo');
				await clientDbGuild.removeVerificationRole(interaction.guild.id, roleRemove.id);
				await interaction.editReply(`${emoji.success} | Cargo removido com sucesso.`);
				break;

			case 'enviar':
				const v = await clientDbGuild.getVerification(interaction.guild.id);
				const channelVerification = await interaction.client.channels.cache.get(v.channel);

				const embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | Clique no botão abaixo para verificar sua conta.`);

				const button = new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setLabel('Verificar')
					.setCustomId('verify');

				const actionRow = new ActionRowBuilder().addComponents(button);

				await channelVerification.send({ embeds: [embed], components: [actionRow] });

				const embed2 = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${emoji.success} | Mensagem enviada com sucesso.`);

				return interaction.editReply({ embeds: [embed2] });

			default:
				break;
		}
	},
};
