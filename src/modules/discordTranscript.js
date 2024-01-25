const discordTranscripts = require('discord-html-transcripts');

const generate = async (channel) => discordTranscripts.createTranscript(channel, {
	returnType: 'attachment',
	footerText: 'Exportada{s} {number} mensagens - Lyra',
	poweredBy: false,
	ssr: true
});

module.exports = { generate };
