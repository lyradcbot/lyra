const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const type = require('../database/schemas/type');

module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {

		const pontos = new ButtonBuilder()
			.setCustomId(`pontos-${interaction.user.id}`)
			.setLabel('Pontuação')
			.setDisabled(true)
			.setStyle(ButtonStyle.Secondary);

		const tempo = new ButtonBuilder()
			.setCustomId(`tempo-${interaction.user.id}`)
			.setLabel('Tempo')
			.setDisabled(true)
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(tempo, pontos);

		if (interaction.customId === `tempo-${interaction.user.id}`) {
			type.find({}).then(async function(resultado) {

				const final = [];
				const ranking = resultado.sort((a, b) => b.recordsolo - a.recordsolo);
				ranking.reverse();
				const users = ranking.slice(0, 14);

				let z = [];
				users.forEach((a) => {
					if(!a.recordsolo) return;

					z.push(a);

				});
				let int = 0;

				for await(const usuario of z) {
					let user;
					if (!user) {
						user = await interaction.client.users.fetch(usuario.user, { cache: true });
						console.log(`[TYPE-RANK] O usuário ${user.tag} (${user.id}) foi adicionado ao cache`);
					}

					let emoji = ':star:';

					const owner = ['742798447253651506', '717766639260532826' ];
					const dev = ['1114578824181592156', '687867247116812378'];
					const staff = ['942125907877986384', '980156816061255690', '380808927568330754'];

					if (owner.includes(user.id)) {
						emoji = '<:coroa:1028754907509039234>';
					}

					if (dev.includes(user.id)) {
						emoji = '<:Badge_Active_Developer:1107309261878468619>';
					}

					if (staff.includes(user.id)) {
						emoji = '<:Badge_Staff:1107309455726616597>';
					}

					final.push(`\`[\`${int++ + 1}\`]\` » \`${user.tag}\` - WPS: **${usuario.recordsolo / 20}**  (${usuario.recordsolo} segundos) ${emoji}`);
				}
				interaction.update({ content: `${final.slice(0, 13).join('\n')}\n\n- WPS: Words per second (Palavras por segundo)`, components: [row] });

			});
		}
		else if (interaction.customId === `pontos-${interaction.user.id}`) {
			type.find({}).then(async function(resultado) {

				const final = [];
				const ranking = resultado.sort((a, b) => b.score - a.score);
				const users = ranking.slice(0, 14);

				let z = [];
				users.forEach((a) => {
					if(!a.score) return;

					z.push(a);

				});
				let int = 0;

				for await(const usuario of z) {
					let user;
					if (!user) {
						user = await interaction.client.users.fetch(usuario.user, { cache: true });
						console.log(`[TYPE-RANK] O usuário ${user.tag} (${user.id}) foi adicionado ao cache`);
					}

					let emoji = ':star:';

					const owner = ['742798447253651506', '717766639260532826' ];
					const dev = ['1114578824181592156', '687867247116812378'];
					const staff = ['942125907877986384', '980156816061255690', '380808927568330754'];

					if (owner.includes(user.id)) {
						emoji = '<:coroa:1028754907509039234>';
					}

					if (dev.includes(user.id)) {
						emoji = '<:Badge_Active_Developer:1107309261878468619>';
					}

					if (staff.includes(user.id)) {
						emoji = '<:Badge_Staff:1107309455726616597>';
					}


					final.push(`\`[\`${int++ + 1}\`]\` » \`${user.tag}\` - Pontuação: **${usuario.score}** ${emoji}`);
				}
				interaction.update({ content: final.slice(0, 10).join('\n'), components: [row] });

			});
		}

		if (interaction.isUserContextMenuCommand()) return;

		if(interaction.customId == 'GuildIcon') {
			const guild = interaction.client.guilds.cache.get(interaction.values.join(''));

			if(!guild.icon) return interaction.reply('Esse servidor não tem um icone');

			const embed = new EmbedBuilder()
				.setTitle(`Ícone de \`${guild.name}\``)
				.setImage(guild.iconURL({ dynamic: true, size: 2048 }))
				.setTimestamp()
				.setColor('#f283cc')
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });


			interaction.reply({ content: interaction.user.toString(), embeds: [embed], ephemeral: true });
		}
	}
};