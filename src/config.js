module.exports = {
	dev: ['742798447253651506', '717766639260532826'],
	transcriptServer: 'https://transcript.lyrabot.online',
	imageServer: 'https://images.lyrabot.online',
	supportServer: 'sJXNQDm5kA',
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
		token: process.env.CLIENT_TOKEN,
	},
	database: {
		uri: process.env.MONGO_URI,
	},
	devLogs: {
		guildJoin: 'https://discord.com/api/webhooks/1204070205488107601/CInIwIU_ePESWbrrHuw52ZiMn47DOqtSE8R74wwmKgXe-IWyUT18tcseNRT8_gjHAH9X',
		guildLeave: 'https://discord.com/api/webhooks/1204070800869556284/p37Wv2w-H2vO2N4jBaUf562wd3HWm5tCt6wz8U9eqciel43UaklMe56G1LwOY1IH6DyE',
		commandLog: 'https://discord.com/api/webhooks/1204071004360413255/meEk-iY4C5MD56rD64CQfE5gst1vEniRr3TB0_PYbzyuEUTFmKipZb3W5ptyNNz5TCV8'
	},
	auditLogModules: [
		{
			name: 'Mensagens Deletadas',
			id: 'messagesDeleted',
		},
		{
			name: 'Mensagens Editadas',
			id: 'messagesEdited',
		},
		{
			name: 'Canais Criados',
			id: 'channelsCreated',
		},
		{
			name: 'Canais Deletados',
			id: 'channelsDeleted',
		},
		{
			name: 'Membros Banidos',
			id: 'membersBanned',
		},
		{
			name: 'Membros Desbanidos',
			id: 'membersUnbanned',
		},
		{
			name: 'Membros Kicados',
			id: 'membersKicked',
		},
		{
			name: 'Membros Atualizados',
			id: 'membersUpdated',
		},
		{
			name: 'Membros Entraram',
			id: 'membersJoined',
		},
		{
			name: 'Membros Saíram',
			id: 'membersLeft',
		},
		{
			name: 'Cargos Criados',
			id: 'rolesCreated',
		},
		{
			name: 'Cargos Deletados',
			id: 'rolesDeleted',
		},
		{
			name: 'Cargos Atualizados',
			id: 'rolesUpdated',
		},
		{
			name: 'Emojis Criados',
			id: 'emojisCreated',
		},
		{
			name: 'Emojis Deletados',
			id: 'emojisDeleted',
		},
		{
			name: 'Emojis Atualizados',
			id: 'emojisUpdated',
		},
		{
			name: 'Webhooks Criados',
			id: 'webhooksCreated',
		},
		{
			name: 'Webhooks Deletados',
			id: 'webhooksDeleted',
		},
		{
			name: 'Webhooks Atualizados',
			id: 'webhooksUpdated',
		},
		{
			name: 'Integrações Criadas',
			id: 'integrationsCreated',
		}
	],
	lavalink: {
		nodes: [
			{
				id: 'Sonora',
				hostname: 'localmachine',
				port: 2333,
				password: 'youshallnotpass',
				// transport: 'rest'
			}
		],
		spotify: {
			id: process.env.SPOTIFY_ID,
			secret: process.env.SPOTIFY_SECRET,
		}
	}
};
