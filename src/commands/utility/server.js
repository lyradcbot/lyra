const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('icon')
				.setDescription('Show server icon').addStringOption(option =>
					option.setName('id')
					  .setDescription('Id of another server')
					  .setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Show server info').addStringOption(option =>
					option.setName('id')
					  .setDescription('Id of another server')
					  .setRequired(false))),
	async execute (interaction) {
		if (interaction.options.getSubcommand() === 'icon') {
			let guild = interaction.guild;

			let args = [interaction.options.getString('id')];
			try {

				if (args[0]) {
					if (!isNaN(args[0])) {
						guild = interaction.client.guilds.cache.get(args[0]);

					}
				}

			}
			catch {
				interaction.reply(`Sinto muito, mas não consegui localizar o servidor: \`${args[0].replace(/`/g, '')}\` `);
			}

			if (!guild.icon) return interaction.reply('Esse servidor não tem um icone');

			const embed = new EmbedBuilder()
				.setTitle(`Icone de \`${guild.name}\``)
				.setImage(guild.iconURL({ dynamic: true, size: 2048 }))
				// .setTimestamp()
				// .setColor(color)
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });


			const menu = new StringSelectMenuBuilder()
				.setCustomId('GuildIcon')
				.setPlaceholder('Selecione o servidor');


			let array = [];

			interaction.client.guilds.cache.map(async (a) => {
				console.log(a.name);
	 if (a.members.cache.get(interaction.user.id)) {
					console.log('Membro detectado em : ', guild.name);

					let owner = await interaction.client.users.fetch(a.ownerId);

					array.push({
						label: a.name,
						description: `ID: ${a.id} | Dono: ${owner.username}`,
						value: a.id,

					});
				}
			});

			setTimeout(() => {
			 menu.addOptions(array);
				const row = new ActionRowBuilder()
					.addComponents(menu);


				const response = interaction.followUp({ content: 'Achei que talvez você ficaria curioso de ver o ícone desses outros servidores também:', components: [row], ephemeral: true });

				const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

				collector.on('collect', async i => {
					guild = interaction.guilds.cache.get(i.values[0]);
					const embe = new EmbedBuilder()
						.setTitle(`Icone de \`${guild.name}\``)
						.setImage(guild.iconURL({ dynamic: true, size: 2048 }))
					// .setTimestamp()
					// .setColor(color)
						.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });

					await i.reply({ embeds: [embe] });
				});


	   }, 5000);

	   interaction.reply({ content: interaction.user.toString(), embeds: [embed] });
		}
		else {await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);}
	},
};