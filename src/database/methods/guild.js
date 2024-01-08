const GuildModel = require('../schemas/guildSchema.js');
const mongoose = require('mongoose');

const createGuild = async (guildId) => {
	const guild = new GuildModel({
		_id: new mongoose.Types.ObjectId(),
		guildId: guildId,
		blocked: false,
		logsChannel: null,
		autoThread: {
			channels: [],
			enabled: false,
		},
		autorole: {
			users: [],
			bots: [],
			stickyRoles: [],
			enabled: false,
		},
		suggestions: {
			channel: null,
			suggestions: [],
			enabled: false,
		},
		tickets: {
			transcriptChannel: null,
			ticketCategory: null,
			ticketChannel: null,
			ticketEmbed: {
				title: null,
				description: null,
				color: null,
				footer: null,
				thumbnail: null,
				image: null,
			},
			enabled: false,
		},
		premium: {
			enabled: false,
			expires: null,
		},
		bannedWords: {
			words: [],
			enabled: false,
		},
	});
	await guild.save();
};

const getGuild = async (guildId) => {
	const guild = await GuildModel.findOne({ guildId: guildId });
	if (!guild) {
		await createGuild(guildId);
		const guild2 = await getGuild(guildId);
		return guild2;
	}
	return guild;
};

const addAutoThread = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.autoThread.channels.push(channelId);
	await guild.save();
};

const removeAutoThread = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.autoThread.channels = guild.autoThread.channels.filter((c) => c !== channelId);
	await guild.save();
};

const setAutoThread = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.autoThread.enabled = enabled;
	await guild.save();
};

const addAutoroleUser = async (guildId, userId) => {
	const guild = await getGuild(guildId);
	guild.autorole.users.push(userId);
	await guild.save();
};

const removeAutoroleUser = async (guildId, userId) => {
	const guild = await getGuild(guildId);
	guild.autorole.users = guild.autorole.users.filter((u) => u !== userId);
	await guild.save();
};

const addAutoroleBot = async (guildId, userId) => {
	const guild = await getGuild(guildId);
	guild.autorole.bots.push(userId);
	await guild.save();
};

const removeAutoroleBot = async (guildId, userId) => {
	const guild = await getGuild(guildId);
	guild.autorole.bots = guild.autorole.bots.filter((u) => u !== userId);
	await guild.save();
};

const addAutoroleSticky = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.autorole.stickyRoles.push(roleId);
	await guild.save();
};

const removeAutoroleSticky = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.autorole.stickyRoles = guild.autorole.stickyRoles.filter((r) => r !== roleId);
	await guild.save();
};

const setAutorole = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.autorole.enabled = enabled;
	await guild.save();
};

const setSuggestions = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.suggestions.enabled = enabled;
	await guild.save();
};

const setSuggestionsChannel = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.suggestions.channel = channelId;
	await guild.save();
};

const addSuggestion = async (guildId, suggestionId) => {
	const guild = await getGuild(guildId);
	guild.suggestions.suggestions.push(suggestionId);
	await guild.save();
};

const removeSuggestion = async (guildId, suggestionId) => {
	const guild = await getGuild(guildId);
	guild.suggestions.suggestions = guild.suggestions.suggestions.filter((s) => s !== suggestionId);
	await guild.save();
};

const setLogsChannel = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.logsChannel = channelId;
	await guild.save();
};

const setTickets = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.tickets.enabled = enabled;
	await guild.save();
};

const setTicketsChannel = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.tickets.ticketChannel = channelId;
	await guild.save();
};

const setTicketsCategory = async (guildId, categoryId) => {
	const guild = await getGuild(guildId);
	guild.tickets.ticketCategory = categoryId;
	await guild.save();
};

const setTicketsTranscript = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.tickets.transcriptChannel = channelId;
	await guild.save();
};

const setTicketsEmbed = async (guildId, embed) => {
	const guild = await getGuild(guildId);
	guild.tickets.ticketEmbed = embed;
	await guild.save();
};

const setPremium = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.premium.enabled = enabled;
	await guild.save();
};

const setPremiumExpires = async (guildId, date) => {
	const guild = await getGuild(guildId);
	guild.premium.expires = date;
	await guild.save();
};

module.exports = {
	createGuild,
	getGuild,
	addAutoThread,
	removeAutoThread,
	setAutoThread,
	addAutoroleUser,
	removeAutoroleUser,
	addAutoroleBot,
	removeAutoroleBot,
	addAutoroleSticky,
	removeAutoroleSticky,
	setAutorole,
	setSuggestions,
	setSuggestionsChannel,
	addSuggestion,
	removeSuggestion,
	setLogsChannel,
	setTickets,
	setTicketsChannel,
	setTicketsCategory,
	setTicketsTranscript,
	setTicketsEmbed,
	setPremium,
	setPremiumExpires,
};