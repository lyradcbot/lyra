const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		const args = [];
		let user = {};
		if (!args[0]) {
			user = interaction.user;
		}
		else {
			if (isNaN(args[0])) return interaction.reply(`** <:way_errado:900128700908060755> » ${interaction.user} Usuário não encontrado.**`);
			user = await interaction.client.users.fetch(args[0]).catch(() => {
				return interaction.reply(`** <:way_errado:900128700908060755> » ${interaction.user} Usuário não encontrado.**`);
			});
		}

		const member = await interaction.guild.members.fetch(user.id, { cache: true }).catch((e) => console.log(e));

		async function badge(flags) {

			if (user.bot && !flags.includes('VERIFIED_BOT')) {
				flags.push('BOT');
			}
			flags = flags.join('');
			flags = flags.replace(/DISCORD_EMPLOYEE/g, '<:staff_dc:927229606124191754>').replace(/HYPESQUAD_EVENTS/g, '<:hypersquad:927229968176525382>').replace(/HOUSE_BRILLIANCE/g, '<:hps_brillinance:927230429805834260>').replace(/HOUSE_BRAVERY/g, '<:bravery:927236752643600404>').replace(/HOUSE_BALANCE/g, '<:balance:927236471017058365>').replace(/EARLY_SUPPORTER/g, '<:porcokkkkk:927230734391967754>').replace(/BUGHUNTER_LEVEL_2/g, '<:bug_lvl2:927230992593334292>').replace(/EARLY_VERIFIED_BOT_DEVELOPER/g, '<:bot_developer:927231423063150622>').replace(/DISCORD_CERTIFIED_MODERATOR/g, '<:moderator:927232655836184626>').replace(/PARTNERED_SERVER_OWNER/g, '<:partner:927243125741719573>').replace(/BUGHUNTER_LEVEL_1/g, '<:bug:927244179128602625>').replace(/VERIFIED_BOT/g, '<:botv:927248783576817674>').replace(/BOT/g, '<:bot:927249890503950336>');
			return flags;
		}


		const embed = new EmbedBuilder()
			.setTitle(`${await badge(user.flags.toArray())} ${user.tag}`)
			.addFields({
				text: 'ID do Usuário',
				value: `\`${user.id}\``,
				inline: false,
			},
			{	text: 'Conta criada em:',
				inline: false,
				value: `<t:${Math.round(user.createdTimestamp / 1000)}> (<t:${Math.round(user.createdTimestamp / 1000)}:R>)`,
			});

		console.log(user.flags.toArray());
		console.log(member);

		if (user.banner) {
			const banner = await user.bannerURL({ dynamic: true, size: 512 });
			embed.setImage({ url: banner });
		}

		if (member) {
			embed.addField('Entrou aqui em:', `<t:${Math.round(member.joinedTimestamp / 1000)}> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`);
			if (member.nickname) embed.addField('Apelido', `\`${member.nickname}\``);
		}

		interaction.reply({ embeds: [embed] });
	},
};