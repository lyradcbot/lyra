const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const playerSchema = new Schema({
	_id: ObjectId,
	guildId: String,
	voiceChannelId: { type: String, default: null },
	textChannelId: { type: String, default: null },
	selfDeaf: { type: Boolean, default: false },
	tracks: { type: Array, default: [] },
});

module.exports = mongoose.model('Player', playerSchema);
