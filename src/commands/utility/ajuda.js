const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('Mostra os comandos do bot!')
		.addStringOption(option =>
			option.setName('comando')
				.setDescription('O comando que deseja ver a ajuda')
				.setAutocomplete(true)
				.setRequired(false)),
	async autocomplete (interaction) {
		const focusedValue = interaction.options.getFocused();
		const data = await interaction.client.db.bot.getCommands();
		const commands = data.commands;
		if (focusedValue === '') {
			const obj = commands.map(command => ({ name: command.name, value: command.description }));
			return interaction.respond(
			    obj.map(choice => ({ name: `/${choice.name} - ${choice.value}`, value: choice.name })),
			);
		}
		const command = commands.find(command => command.name.includes(focusedValue));
		if (!command) {
			const obj = commands.map(command => ({ name: command.name, value: command.description }));
			return interaction.respond(
			    obj.map(choice => ({ name: `/${choice.name} - ${choice.value}`, value: choice.name })),
			);
		}
		const obj = [{ name: command.name, value: command.description }];
		return interaction.respond(
		    obj.map(choice => ({ name: `/${choice.name} - ${choice.value}`, value: choice.name })),
		);
	},
	async execute  (interaction) {
		await interaction.deferReply();
		const data = await interaction.client.db.bot.getCommands();
		const commands = data.commands;
		if (interaction.options.getString('comando')) {
			const command = commands.find(command => command.name === interaction.options.getString('comando'));
			if (!command) {
				return interaction.editReply({
					content: `${emoji.error} **|** Não encontrei o comando "${interaction.options.getString('comando').replace(/@/g, '')}".`,
					allowedMentions: { repliedUser: false, parse: [] }
				});
			}
			const embed = new EmbedBuilder()
				.setTitle(`Ajuda - ${command.name}`)
				.setDescription(command.description)
				.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `${interaction.user.tag} (${interaction.user.id})`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp()
				.setColor('#cd949d');
			if (command.options) {
				command.options.map(option => {
					embed.addFields(
						{
							name: option.name,
							value: option.description,
							inline: true
						}
					);
				}
				);
			}
			await interaction.editReply({ embeds: [embed] });
			return;
		}
		const embed = new EmbedBuilder()
			.setTitle('Ajuda - Lyra')
			.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: `${interaction.user.tag} (${interaction.user.id})`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setTimestamp()
			.setColor('#cd949d');
		const commandsArray = [];
		commands.map(command => {
			commandsArray.push({
				name: `/${command.name}`,
				value: command.description,
			});
		});
		if (commandsArray.length > 25) {
			const embeds = [];
			let embedArray = [];
			const sendEmbed = [];
			commandsArray.map(command => {
				embedArray.push(command);
				if (embedArray.length === 25) {
					embeds.push(embedArray);
					embedArray = [];
				}
			});
			if (embedArray.length > 0) {
				embeds.push(embedArray);
			}
			embeds.map(async (embedArray) => {
				const embed = new EmbedBuilder()
					.setColor('#cd949d');
				embedArray.map(command => {
					embed.addFields(
						{
							name: command.name,
							value: command.value,
							inline: true
						}
					);
				});
				if (sendEmbed.length === 0) {
					embed.setTitle('Ajuda - Lyra');
					embed.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 }));
				}
				if (embeds.indexOf(embedArray) === embeds.length - 1) {
					embed.setTimestamp();
					embed.setFooter({
						text: `${interaction.user.tag} (${interaction.user.id})`,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
					});
				}
				sendEmbed.push(embed);
			});
			await interaction.editReply({ embeds: sendEmbed });
		}
		else {
			commandsArray.map(command => {
				embed.addFields(
					{
						name: command.name,
						value: command.value,
						inline: true
					}
				);
			});
			await interaction.editReply({ embeds: [embed] });
		}
	},
};