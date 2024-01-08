const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Run codes')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('Code')
				.setRequired(true)),
	async execute  (interaction) {
		let args = [interaction.options.getString('code')];
		const dev = ['742798447253651506', '717766639260532826'];

		if (!dev.includes(interaction.user.id)) return interaction.reply({ content: 'Esse comando só pode ser executado por Desenvolvedores.**' });
		let code;
		try {
			code = await eval(args.join(' '));
		}
		catch (e) {
			code = e.toString();
		}
		const tipo = typeof code;
		try {
			if (typeof code !== 'string') code = await require('util').inspect(code, { depth: 0 });
		}
		catch (e) {
			code = e.toString();
		}
		const embed = new EmbedBuilder()
			.setDescription(` \`\`\`js\n${code.slice(0, 1010)}\`\`\``)
			.setColor('#baecf9')
			.setFooter({ text: `Tipo: ${tipo}` })
			.setAuthor({ name: `Executado por ${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		interaction.reply({ embeds: [embed], ephemeral: true });

	}
};