const { Events, EmbedBuilder } = require('discord.js');
const emoji = require('../modules/emojis.json');
const config = require('../config');

module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {
		if (interaction.isButton()) {
			console.log(interaction);
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
				// TODO: Fazer modal para editar o nome
				await interaction.reply({ content: 'Nome da thread alterado com sucesso!', ephemeral: true }).then(async () => {
					await thread.setName(interaction.channel.name);
				});
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