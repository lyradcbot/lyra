const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute (member) {
		const client = member.guild.client;
		const enabled = await client.db.guild.getAutoroleStatus(member.guild.id);
		if (!enabled) return;

		const users = await client.db.guild.getAutoroleUsers(member.guild.id);
		const bots = await client.db.guild.getAutoroleBots(member.guild.id);

		const addRoles = async (roleIds, roleType) => {
			if (roleIds.length > 0) {
				const rolesToAdd = roleIds.length < 25 ? roleIds : roleIds.slice(0, 25);
				await member.roles.add(rolesToAdd, `Autorole - ${roleType}`);
			}
		};

		if (!member.user.bot) {
			await addRoles(users, 'Membros');
		}
		else {
			await addRoles(bots, 'Bots');
		}
	}
};
