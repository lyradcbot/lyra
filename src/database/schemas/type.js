const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
	user: String,
	vezessolo: Number,
	vezesmult: Number,
	recordsolo: Number,
	score: Number,
	recordmult: Number
});

// eslint-disable-next-line
const MessageModel = module.exports = mongoose.model('type', logSchema);