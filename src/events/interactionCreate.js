const { Events, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, ButtonBuilder } = require('discord.js');
const { generate } = require('../modules/discordTranscript');
const emoji = require('../modules/emojis.json');
const config = require('../config');

module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {
		await interaction.client.db.guild.checkGuild(interaction.guild.id);
		if (interaction.isModalSubmit()) {
			if (interaction.customId.startsWith('editThread')) {
				const thread = await interaction.channel;
				const userId = interaction.customId.split(';')[1];
				if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} Você não pode editar essa thread!`, ephemeral: true });
				const newName = interaction.fields.fields.get('threadName').value;
				await interaction.reply({ content: `${emoji.success} Nome da thread editado com sucesso!`, ephemeral: true }).then(async () => {
					await thread.setName(newName);
				});
			}
		}
		if (interaction.isButton()) {
			if (interaction.customId.startsWith('openTicket')) {
				await interaction.deferReply({
					ephemeral: true,
				});
				const guildId = interaction.customId.split(';')[1];
				const userId = interaction.user.id;
				const ticketStatus = await interaction.client.db.guild.getTickets(guildId);
				if (ticketStatus === 'false') return interaction.reply({ content: `${emoji.error} Os tickets foram desativados pela equipe do servidor!`, ephemeral: true });
				const ticketCategory = await interaction.client.db.guild.getTicketsCategory(guildId);
				const roles = await interaction.client.db.guild.getTicketsSupportRole(guildId);
				const logs = await interaction.client.db.guild.getTicketsLogs(guildId);
				const rolePerm = roles.map(role => {
					return {
						id: role,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
					};
				});
				const channel = await interaction.guild.channels.create({
					name: `ticket-${interaction.user.username}`.toLowerCase(),
					type: ChannelType.GuildText,
					parent: ticketCategory,
					permissionOverwrites: [
						{
							id: interaction.guild.id,
							deny: [PermissionFlagsBits.ViewChannel],
						},
						{
							id: userId,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
						},
						...rolePerm,
					],
				});
				const welcomeEmbed = new EmbedBuilder()
					.setTitle('Bem-vindo ao seu ticket!')
					.setDescription('A equipe em breve irá te atender.')
					.setColor('Blurple');
				const closeButton = new ButtonBuilder()
					.setStyle('Danger')
					.setLabel('Fechar Ticket')
					.setEmoji('🔒')
					.setCustomId(`closet;${userId}`);
				const transcriptButton = new ButtonBuilder()
					.setStyle('Secondary')
					.setLabel('Transcrição')
					.setEmoji('📝')
					.setCustomId(`transcriptt;${userId}`);
				const actionsRow = new ActionRowBuilder().addComponents(closeButton, transcriptButton);
				await channel.send({ content: `${interaction.user}`, embeds: [welcomeEmbed], components: [actionsRow] }).then(async (msg) => {
					await msg.pin();
				});
				const alertEmbed = new EmbedBuilder()
					.setTitle('Ticket aberto!')
					.setDescription(`Um ticket foi aberto por ${interaction.user}, clique no link abaixo para ir até o ticket.`)
					.addFields(
						{
							name: 'Informações',
							value: `**Usuário:** ${interaction.user}\n**Ticket:** ${channel}`,
							inline: true
						},
						{
							name: 'Ações',
							value: `[Fechar Ticket](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${channel.lastMessageId})`,
							inline: true
						}
					)
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
					.setFooter({
						text: `ID do usuário: ${interaction.user.id}`,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
					})
					.setTimestamp()
					.setColor('Green');
				if (logs !== null) {
					const logChannel = await interaction.client.channels.cache.get(logs);
					await logChannel.send({ embeds: [alertEmbed] }).catch(() => {});
				}
				const successEmbed = new EmbedBuilder()
					.setTitle('Ticket aberto!')
					.setDescription(`O ticket foi aberto com sucesso! ${channel}`)
					.setColor('Blurple');
				await interaction.editReply({ embeds: [successEmbed] });
			}
			if (interaction.customId.startsWith('closet')) {
				await interaction.deferReply();
				const ticketChannel = interaction.channel;
				const guildId = interaction.guild.id;
				const logs = await interaction.client.db.guild.getTicketsLogs(guildId);
				const transcript = await interaction.client.db.guild.getTicketsTranscript(guildId);
				const transcriptChannel = await interaction.client.channels.cache.get(transcript);
				const alertEmbed = new EmbedBuilder();
				alertEmbed.setTitle('Ticket fechado!');
				alertEmbed.setDescription(`Um ticket foi fechado por ${interaction.user}, clique no link abaixo para ir até o ticket.`);
				alertEmbed.addFields(
					{
						name: 'Informações',
						value: `**Usuário:** ${interaction.user}\n**Ticket:** ${ticketChannel}`,
						inline: true
					},
				);
				alertEmbed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }));
				alertEmbed.setFooter({
					text: `ID do usuário: ${interaction.user.id}`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
				});
				alertEmbed.setTimestamp();
				alertEmbed.setColor('Red');
				const transcriptFile = await generate(interaction.channel);
				if (logs !== null && transcriptChannel !== null) {
					const logChannel = await interaction.client.channels.cache.get(logs);
					await logChannel.send({ embeds: [alertEmbed] }).catch(() => {});
				}
				else if (logs !== null && transcriptChannel === null) {
					const logChannel = await interaction.client.channels.cache.get(logs);
					await logChannel.send({ embeds: [alertEmbed], files: [transcriptFile] }).catch(() => {});
				}
				if (transcriptChannel !== null) {
					transcriptChannel.send({ files: [transcriptFile] }).then(async (m) => {
						const transEmbed = new EmbedBuilder()
							.setTitle('Transcrição gerada!')
							.setDescription(`A transcrição do ticket foi gerada com sucesso! ${ticketChannel}`)
							.addFields(
								{
									name: 'Informações',
									value: `**Usuário:** ${interaction.user}\n**Ticket:** \`${ticketChannel.name}\``,
									inline: true
								},
								{
									name: 'Pessoas no ticket',
									value: ticketChannel.members.map(member => `<@${member.id}>`).join(', '),
									inline: true
								},
								{
									name: 'Acesse o transcript',
									value: `[Clique aqui](${config.transcriptServer}/transcript?link=${m.attachments.first().url})`
								}
							)
							.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
							.setFooter({
								text: `ID do usuário: ${interaction.user.id}`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
							})
							.setColor('Yellow');
						transcriptChannel.send({ embeds: [transEmbed] }).catch(() => {});
					});
				}
				const unixTime = Math.round((Date.now() + 60000) / 1000);
				const closeEmbed = new EmbedBuilder()
					.setTitle('Ticket fechado!')
					.setDescription(`O ticket foi fechado por ${interaction.user} e será deletado em: <t:${unixTime}:R>.`)
					.setColor('Red');
				await interaction.editReply({ embeds: [closeEmbed] }).then(() => {
					setTimeout(async () => {
						await ticketChannel.delete();
					}, 60000);
				});
			}
			if (interaction.customId.startsWith('transcriptt')) {
				await interaction.deferReply();
				const ticketChannel = interaction.channel;
				const guildId = interaction.guild.id;
				const transcript = await interaction.client.db.guild.getTicketsTranscript(guildId);
				const transcriptChannel = await interaction.client.channels.cache.get(transcript);
				const transcriptFile = await generate(interaction.channel);
				transcriptChannel.send({ files: [transcriptFile] }).then(async (m) => {
					const transEmbed = new EmbedBuilder()
						.setTitle('Transcrição gerada!')
						.setDescription(`A transcrição do ticket foi gerada com sucesso! ${ticketChannel}`)
						.addFields(
							{
								name: 'Informações',
								value: `**Usuário:** ${interaction.user}\n**Ticket:** \`${ticketChannel.name}\``,
								inline: true
							},
							{
								name: 'Pessoas no ticket',
								value: ticketChannel.members.map(member => `<@${member.id}>`).join(', '),
								inline: true
							},
							{
								name: 'Acesse o transcript',
								value: `[Clique aqui](${config.transcriptServer}/transcript?link=${m.attachments.first().url})`
							}
						)
						.setFooter({
							text: `ID do usuário: ${interaction.user.id}`,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
						})
						.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
						.setColor('Yellow');
					transcriptChannel.send({ embeds: [transEmbed] }).catch(() => {});
				});
				const successEmbed = new EmbedBuilder()
					.setTitle('Transcrição gerada!')
					.setDescription(`A transcrição do ticket foi gerada com sucesso! Confira em: ${transcriptChannel}`)
					.setColor('Blurple');
				await interaction.editReply({ embeds: [successEmbed] });
			}
			if (interaction.customId.startsWith('archivet')) {
				const thread = await interaction.channel;
				const userId = interaction.customId.split(';')[1];
				if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} Você não pode arquivar essa thread!`, ephemeral: true });
				await interaction.reply({ content: `${emoji.success} Thread arquivada com sucesso!`, ephemeral: true }).then(async () => {
					await thread.setArchived(true);
				});
			}
			if (interaction.customId.startsWith('editt')) {
				const thread = await interaction.channel;
				const userId = interaction.customId.split(';')[1];
				if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} Você não pode editar essa thread!`, ephemeral: true });
				const modal = new ModalBuilder()
					.setCustomId(`editThread;${userId}`)
					.setTitle('Editar nome da thread');

				const nameInput = new TextInputBuilder()
					.setCustomId('threadName')
					.setLabel('Qual será o novo nome da Thread?')
					.setPlaceholder('Escreva aqui!')
					.setMinLength(1)
					.setMaxLength(100)
					.setRequired(true)
					.setValue(thread.name)
					.setStyle(TextInputStyle.Short);

				const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
				modal.addComponents(firstActionRow);

				await interaction.showModal(modal);
			}
		}
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				console.error(error);
			}
		}

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
			const logChannel = await interaction.client.channels.cache.get(config.devLogs.commands);
			const embed = new EmbedBuilder()
				.setTitle('Comando executado')
				.setDescription(`O comando \`${interaction.commandName}\` foi executado por ${interaction.user} \`(${interaction.user.id})\``)
				.addFields(
					{ name: 'Servidor', value: `${interaction.guild.name} \`(${interaction.guild.id})\``, inline: true },
					{ name: 'Canal', value: `#${interaction.channel.name} \`(${interaction.channel.id})\``, inline: true },
					{ name: 'Opções', value: interaction.options.data.length > 0 ? interaction.options.data.map(option => `\`${option.name}\`: \`${option.value}\``).join('\n') : 'Nenhuma', inline: false },
				)
				.setTimestamp()
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setColor('Blurple');
			await logChannel.send({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};