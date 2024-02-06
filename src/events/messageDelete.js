const { Events, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const emoji = require('../modules/emojis.json');

module.exports = {
	name: Events.MessageDelete,
	async execute (message) {
		if (message.author.bot) return;
		const logData = await message.client.db.guild.getLogs(message.guild.id);
		if (!logData.logTypes.includes('messagesDeleted')) return;
		if (logData.channel === null) return;
		if (!logData.enabled) return;
		const channel = message.guild.channels.cache.get(logData.channel);
		if (!channel) return;
		if (channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ManageWebhooks)) {
			if (logData.webhook === null) {
				const webhook = await channel.createWebhook({
					name: 'Logs',
					avatar: message.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
				}).catch(async () => {
					const webhook = await channel.createWebhook({
						name: 'Logs',
						avatar: message.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
					}).catch(async (e) => console.log(e));
					await message.client.db.guild.setWebhook(message.guild.id, webhook.id);
					return webhook;
				});
				await message.client.db.guild.setWebhook(message.guild.id, webhook.id);
			}
			const webhook = await channel.fetchWebhooks().then(webhooks => webhooks.get(logData.webhook)).catch(async () => {
				const webhook = await channel.createWebhook('Logs', {
					avatar: message.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
				}).catch(async (e) => console.log(e));
				return webhook;
			});
			await message.client.db.guild.setWebhook(message.guild.id, webhook.id);
			const embed = new EmbedBuilder()
				.setTitle(`${emoji.messageDelete} Mensagem deletada`)
				.addFields(
					{
						name: 'Conteúdo:',
						value: '```' + message.content + '```' || '```Sem conteúdo```',
						inline: false
					},
					{
						name: 'Autor',
						value: `${message.author}`,
						inline: true
					},
					{
						name: 'Canal:',
						value: `${message.channel}`,
						inline: true
					},
					{
						name: 'Enviada em:',
						value: `<t:${Math.floor(message.createdTimestamp / 1000)}>`,
						inline: true
					}
				)
				.setColor('Red')
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `ID do Usuário: ${message.author.id}`,
					iconURL: message.guild.iconURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp();
			await webhook.send({ embeds: [embed], username: message.guild.name, avatarURL: message.guild.iconURL({ dynamic: true, size: 4096 }) }).then(async (m) => {
				if (message.attachments.size > 0) {
					const attachments = message.attachments.map((a) => new AttachmentBuilder(a.url.split('?')[0], {
						name: a.name
					}));
					const thread = await m.startThread({
						name: 'Anexos: ' + message.author.tag,
						autoArchiveDuration: 1440,
						reason: 'Logs'
					});
					await webhook.send({ files: attachments, threadId: thread.id, username: message.guild.name, avatarURL: message.guild.iconURL({ dynamic: true, size: 4096 }) });
				}
			});
			await message.client.db.guild.addLog(message.guild.id, `[MENSAGEM DELETADA] @${message.author.tag} (${message.author.id}) deletou uma mensagem em #${message.channel.name}\nConteúdo: ${message.content || 'Sem conteúdo'}`);
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle(`${emoji.messageDelete} Mensagem deletada`)
				.addFields(
					{
						name: 'Conteúdo:',
						value: '```' + message.content + '```' || '```Sem conteúdo```',
						inline: false
					},
					{
						name: 'Autor',
						value: `${message.author}`,
						inline: true
					},
					{
						name: 'Canal:',
						value: `${message.channel}`,
						inline: true
					},
					{
						name: 'Enviada em:',
						value: `<t:${Math.floor(message.createdTimestamp / 1000)}>`,
						inline: true
					}
				)
				.setColor('Red')
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `ID do Usuário: ${message.author.id}`,
					iconURL: message.guild.iconURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp();
			channel.send({ embeds: [embed] }).then(async (m) => {
				if (message.attachments.size > 0) {
					const attachments = message.attachments.map((a) => new AttachmentBuilder(a.url.split('?')[0], {
						name: a.name
					}));
					const thread = await m.startThread({
						name: 'Anexos: ' + message.author.tag,
						autoArchiveDuration: 1440,
						reason: 'Logs'
					});
					await thread.send({ files: attachments, threadId: thread.id });
				}
			});
			await message.client.db.guild.addLog(message.guild.id, `[MENSAGEM DELETADA] @${message.author.tag} (${message.author.id}) deletou uma mensagem em #${message.channel.name}\nConteúdo: ${message.content || 'Sem conteúdo'}`);
		}
	}
};