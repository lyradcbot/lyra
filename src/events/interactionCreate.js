const { Events, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const emoji = require('../modules/emojis.json');
const config = require('../config');

module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {
		if (interaction.isModalSubmit()) {
			if (interaction.customId.startsWith('editThread')) {
				const thread = await interaction.channel;
				const userId = interaction.customId.split(';')[1];
				if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} Você não pode editar essa thread!`, ephemeral: true });
				console.log(interaction.fields.fields.get('threadName').value);
				const newName = interaction.fields.fields.get('threadName').value;
				await interaction.reply({ content: `${emoji.success} Nome da thread editado com sucesso!`, ephemeral: true }).then(async () => {
					await thread.setName(newName);
				});
			}
		}
		if (interaction.isButton()) {
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