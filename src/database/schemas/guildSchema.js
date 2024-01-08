const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GuildSchema = new Schema({
	_id: ObjectId,
	guildId: String,
	blocked: Boolean,
	logsChannel: String,
	autoThread: {
		channels: Array,
		enabled: Boolean,
	},
	autorole: {
		users: Array,
		bots: Array,
		stickyRoles: Array,
		enabled: Boolean,
	},
	suggestions: {
		channel: String,
		suggestions: Array,
		enabled: Boolean,
	},
	tickets: {
		transcriptChannel: String,
		ticketCategory: String,
		ticketChannel: String,
		ticketEmbed: {
			title: String,
			description: String,
			color: String,
			footer: String,
			thumbnail: String,
			image: String,
		},
		enabled: Boolean,
	},
	premium: {
		enabled: Boolean,
		expires: Date,
	},
	bannedWords: {
		words: Array,
		enabled: Boolean,
	},
	chatGPT: {
		channel: String,
		enabled: Boolean,
	}
});

module.exports = mongoose.model('Guild', GuildSchema);