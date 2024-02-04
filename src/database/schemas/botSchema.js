const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const botSchema = new Schema({
	_id: ObjectId,
	manutation: {
		enabled: { type: Boolean, default: false },
		reason: { type: String, default: null },
		user: { type: String, default: null },
	},
	versionLogs: {
		version: { type: String, default: null },
		logs: { type: String, default: null },
		enabled: { type: Boolean, default: false },
	},
	blacklist: {
		users: { type: Array, default: [] },
		guilds: { type: Array, default: [] },
		enabled: { type: Boolean, default: false },
	},
	commands: {
		enabled: { type: Boolean, default: false },
		commands: { type: Array, default: [] },
	},
});

module.exports = mongoose.model('Bot', botSchema);
