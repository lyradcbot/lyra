const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('icon')
				.setDescription('Show server icon')),
	async execute(interaction) {

		if (interaction.options.getSubcommand() === 'info') {
			let guild = interaction.guild;

			const args = [interaction.options.getString('id')];
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


			interaction.reply({ content: interaction.user.toString(), embeds: [embed] });

			const menu = new SelectMenu()
				.setCustomId('GuildIcon')
				.setPlaceholder('Qual servidor você deseja ver o ícone?');


			const array = [];

			interaction.client.guilds.cache.map(a => {
	 if (a.members.cache.get(interaction.user.id) && a.id !== guild.id) {

					array.push({
						label: a.name,
						value: a.id,
					});

			 }
			});

			menu.addOptions(array);
			const row = new ActionRowBuilder()
				.addComponents(menu);

			setTimeout(() => {
				if (array[0]) interaction.followUp({ content: 'Achei que talvez você ficaria curioso de ver o ícone desses outros servidores também:', components: [row], ephemeral: true });
	   }, 2000);
		}
		else {await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);}
	},
};