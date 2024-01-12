const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Mostra informaçõe sobre o usuário.').addStringOption(option =>
			option.setName('id')
			  .setDescription('Id of another user')
			  .setRequired(false)),
	async execute (interaction) {
		const args = [interaction.options.getString('id')];
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

		async function badge (flags) {

			if (user.bot && !flags.includes('VERIFIED_BOT')) {
				flags.push('BOT');
			}
			flags = flags.join('');
			flags = flags.replace(/ActiveDeveloper/g, '<:Badge_Active_Developer:1194378704533602314>').replace(/Staff/g, '<:BadgeStaff:1107309455726616597>').replace(/Hypesquad/g, '<:Badge_HypeSquad_Events:1107323581748228198>').replace(/HypeSquadOnlineHouse2/g, '<:Badge_Brilliance:1107309354048299108>').replace(/HypeSquadOnlineHouse1/g, '<:Badge_Bravery:1107309318874869810>').replace(/HypeSquadOnlineHouse3/g, '<:Badge_Balance:1107309301694988298>').replace(/PremiumEarlySupporter/g, '<:EarlySupporterBadge:1107320102979915826>').replace(/BugHunterLevel2/g, '<:Badge_BugHunter_Lvl2:1107309364928327713>').replace(/VerifiedDeveloper/g, '<:Badge_Early_VerifiedBotDeveloper:1107317741410586675>').replace(/CertifiedModerator/g, '<a:c:1064647935603773461>').replace(/Partner/g, '<:newpartner:1117092467980894248>').replace(/BugHunterLevel1/g, '<:Badge_Bug_Hunter_Level_1:1107309392237432883>').replace(/BOT/g, '<:Badge_BotSlashCommands:1107309283227467807>');
			return flags;
		}


		const embed = new EmbedBuilder()
			.setTitle(`${await badge(user.flags.toArray())} ${user.tag}`)
			.addFields({
				name: 'ID do Usuário',
				value: `\`${user.id}\``,
				inline: false,
			},
			{	name: 'Conta criada em:',
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
			embed.addFields({ name: 'Entrou aqui em:', value: `<t:${Math.round(member.joinedTimestamp / 1000)}> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`, inline: false });
			if (member.nickname) embed.addFields({ name: 'Apelido', value:`\`${member.nickname}\`` });
		}

		interaction.reply({ embeds: [embed] });
	},
};