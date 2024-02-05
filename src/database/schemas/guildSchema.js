const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GuildSchema = new Schema({
	_id: ObjectId,
	guildId: String,
	blocked: { type: Boolean, default: false },
	logs: {
		enabled: { type: Boolean, default: false },
		channel: { type: String, default: null },
		ignoredChannels: { type: Array, default: [] },
		ignoredUsers: { type: Array, default: [] },
		ignoredRoles: { type: Array, default: [] },
		ignoredEvents: { type: Array, default: [] },
		ignoredCommands: { type: Array, default: [] },
	},
	autoThread: {
		channels: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	},
	autorole: {
		users: { type: Array, default: [] },
		bots: { type: Array, default: [] },
		stickyRoles: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	},
	suggestions: {
		channel: { type: String, default: null },
		suggestions: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	},
	tickets: {
		transcriptChannel: { type: String, default: null },
		autotrancsript: { type: Boolean, default: false },
		logsChannel: { type: String, default: null },
		ticketCategory: { type: String, default: null },
		ticketChannel: { type: String, default: null },
		ticketEmbed: {
			title: { type: String, default: null },
			description: { type: String, default: null },
			color: { type: String, default: null },
			footer: { type: String, default: null },
			thumbnail: { type: String, default: null },
			image: { type: String, default: null },
		},
		enabled: { type: Boolean, default: false },
		supportRole: { type: Array, default: [] },
	},
	premium: {
		enabled: { type: Boolean, default: false },
		expires: { type: Date, default: null },
	},
	bannedWords: {
		words: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	},
	verification: {
		type: { type: String, default: null },
		channel: { type: String, default: null },
		roles: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	}
});

module.exports = mongoose.model('Guild', GuildSchema);
