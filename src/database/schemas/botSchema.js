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
	type: {
		user:  { type: String, default: 0 },
		vezessolo:  { type: Number, default: 0 },
		vezesmult:  { type: Number, default:0 },
		recordsolo:  { type: Number, default: 0 },
		score:  { type: Number, default: 0 },
		recordmult:  { type: Number, default: 0 }
	}
});

module.exports = mongoose.model('Bot', botSchema);
