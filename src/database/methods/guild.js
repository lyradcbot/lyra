const GuildModel = require('../schemas/guildSchema.js');
const config = require('../../config.js');
const mongoose = require('mongoose');

const createGuild = async (guildId) => {
	const guild = new GuildModel({
		_id: new mongoose.Types.ObjectId(),
		guildId: guildId,
	});
	await guild.save();
};

const checkGuild = async (guildId) => {
	const guild = await GuildModel.findOne({ guildId: guildId });
	if (!guild) {
		await createGuild(guildId);
		const guild2 = await getGuild(guildId);
		return guild2;
	}
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

const getAutoThreadChannels = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autoThread.channels;
};

const getAutoThreadStatus = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autoThread.enabled;
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

const getAutoroleStatus = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autorole.enabled;
};

const getAutoroleUsers = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autorole.users;
};

const getAutoroleBots = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autorole.bots;
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

const getAutoroleSticky = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.autorole.stickyRoles;
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

const setTicketsEmbed = async (guildId, title, description, color, footer, thumbnail, image) => {
	const guild = await getGuild(guildId);
	guild.tickets.ticketEmbed.title = title;
	guild.tickets.ticketEmbed.description = description;
	guild.tickets.ticketEmbed.color = color;
	guild.tickets.ticketEmbed.footer = footer;
	guild.tickets.ticketEmbed.thumbnail = thumbnail;
	guild.tickets.ticketEmbed.image = image;
	await guild.save();
};

const setTicketsLogs = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.tickets.logsChannel = channelId;
	await guild.save();
};

const setTicketsSupportRole = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.tickets.supportRole.push(roleId);
	await guild.save();
};

const removeTicketsSupportRole = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.tickets.supportRole = guild.tickets.supportRole.filter((r) => r !== roleId);
	await guild.save();
};

const getTicketsSupportRole = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.supportRole;
};

const getTickets = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.enabled;
};

const getTicketsEmbed = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.ticketEmbed;
};

const getTicketsLogs = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.logsChannel;
};

const getTicketsChannel = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.ticketChannel;
};

const getTicketsCategory = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.ticketCategory;
};

const getTicketsTranscript = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.tickets.transcriptChannel;
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

const setBannedWords = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.bannedWords.enabled = enabled;
	await guild.save();
};

const addBannedWord = async (guildId, word) => {
	const guild = await getGuild(guildId);
	guild.bannedWords.words.push(word);
	await guild.save();
};

const removeBannedWord = async (guildId, word) => {
	const guild = await getGuild(guildId);
	guild.bannedWords.words = guild.bannedWords.words.filter((w) => w !== word);
	await guild.save();
};

const getBannedWords = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.bannedWords.words;
};

const setVerification = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.verification.enabled = enabled;
	await guild.save();
};

const setVerificationType = async (guildId, type) => {
	const guild = await getGuild(guildId);
	guild.verification.type = type;
	await guild.save();
};

const setVerificationChannel = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.verification.channel = channelId;
	await guild.save();
};

const addVerificationRole = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.verification.roles.push(roleId);
	await guild.save();
};

const removeVerificationRole = async (guildId, roleId) => {
	const guild = await getGuild(guildId);
	guild.verification.roles = guild.verification.roles.filter((r) => r !== roleId);
	await guild.save();
};

const getVerification = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.verification;
};

const setLogs = async (guildId, enabled) => {
	const guild = await getGuild(guildId);
	guild.logs.enabled = enabled;
	await guild.save();
};

const setLogsChannel = async (guildId, channelId) => {
	const guild = await getGuild(guildId);
	guild.logs.channel = channelId;
	await guild.save();
};

const setLogsTypes = async (guildId, types) => {
	const guild = await getGuild(guildId);
	guild.logs.logTypes = types;
	await guild.save();
};

const addLogsType = async (guildId, type) => {
	const guild = await getGuild(guildId);
	guild.logs.logTypes.push(type);
	await guild.save();
};

const removeLogsType = async (guildId, type) => {
	const guild = await getGuild(guildId);
	guild.logs.logTypes = guild.logs.logTypes.filter((t) => t !== type);
	await guild.save();
};

const setLogsAll = async (guildId, logs) => {
	const guild = await getGuild(guildId);
	const logsa = config.auditLogModules.map((log) => log.id);
	guild.logs.allLogs = logs;
	if (logs) {
		guild.logs.logTypes = logsa;
	}
	await guild.save();
};

const addLog = async (guildId, log) => {
	const guild = await getGuild(guildId);
	guild.logs.logs.push(log);
	await guild.save();
};

const removeLog = async (guildId, log) => {
	const guild = await getGuild(guildId);
	guild.logs.logs = guild.logs.logs.filter((l) => l !== log);
	await guild.save();
};

const setLogsIgnoredChannels = async (guildId, channels) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredChannels = channels;
	await guild.save();
};

const addLogsIgnoredChannel = async (guildId, channel) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredChannels.push(channel);
	await guild.save();
};

const removeLogsIgnoredChannel = async (guildId, channel) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredChannels = guild.logs.ignoredChannels.filter((c) => c !== channel);
	await guild.save();
};

const setLogsIgnoredUsers = async (guildId, users) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredUsers = users;
	await guild.save();
};

const addLogsIgnoredUser = async (guildId, user) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredUsers.push(user);
	await guild.save();
};

const removeLogsIgnoredUser = async (guildId, user) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredUsers = guild.logs.ignoredUsers.filter((u) => u !== user);
	await guild.save();
};

const setLogsIgnoredRoles = async (guildId, roles) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredRoles = roles;
	await guild.save();
};

const addLogsIgnoredRole = async (guildId, role) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredRoles.push(role);
	await guild.save();
};

const removeLogsIgnoredRole = async (guildId, role) => {
	const guild = await getGuild(guildId);
	guild.logs.ignoredRoles = guild.logs.ignoredRoles.filter((r) => r !== role);
	await guild.save();
};

const setWebhook = async (guildId, webhook) => {
	const guild = await getGuild(guildId);
	guild.logs.webhook = webhook;
	await guild.save();
};

const getLogs = async (guildId) => {
	const guild = await getGuild(guildId);
	return guild.logs;
};

module.exports = {
	checkGuild,
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
	getAutoThreadChannels,
	getAutoThreadStatus,
	getAutoroleStatus,
	getAutoroleUsers,
	getAutoroleBots,
	getAutoroleSticky,
	setAutorole,
	setSuggestions,
	setSuggestionsChannel,
	addSuggestion,
	removeSuggestion,
	setTickets,
	setTicketsChannel,
	setTicketsCategory,
	setTicketsTranscript,
	setTicketsEmbed,
	setTicketsLogs,
	setTicketsSupportRole,
	removeTicketsSupportRole,
	getTicketsSupportRole,
	getTickets,
	getTicketsEmbed,
	getTicketsLogs,
	getTicketsChannel,
	getTicketsCategory,
	getTicketsTranscript,
	setPremium,
	setPremiumExpires,
	setBannedWords,
	addBannedWord,
	removeBannedWord,
	getBannedWords,
	setVerification,
	setVerificationType,
	setVerificationChannel,
	addVerificationRole,
	removeVerificationRole,
	getVerification,
	setLogs,
	setLogsChannel,
	setLogsTypes,
	addLogsType,
	removeLogsType,
	setLogsAll,
	addLog,
	removeLog,
	setLogsIgnoredChannels,
	addLogsIgnoredChannel,
	removeLogsIgnoredChannel,
	setLogsIgnoredUsers,
	addLogsIgnoredUser,
	removeLogsIgnoredUser,
	setLogsIgnoredRoles,
	addLogsIgnoredRole,
	removeLogsIgnoredRole,
	setWebhook,
	getLogs,
};