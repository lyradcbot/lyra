const { Events, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, cleanContent } = require('discord.js');
const emoji = require('../modules/emojis.json');
const Diff = require('diff');

module.exports = {
	name: Events.MessageUpdate,
	async execute (oldMessage, newMessage) {
		const message = oldMessage;
		if (message.author.bot) return;
		const diff = Diff.diffChars(cleanContent(oldMessage.content, newMessage.channel).replaceAll('```', '``ˋ'), cleanContent(newMessage.content, newMessage.channel).replaceAll('```', '``ˋ'));
		let oldContentDiff = diff.map(part => {
			if(part.added) return '';
			if(part.removed) return `\u001b[41m${part.value}`;
			return `\u001b[0m${part.value}`;
		}).join('');
		let newContentDiff = diff.map(part => {
			if(part.added) return `\u001b[45m${part.value}`;
			if(part.removed) return '';
			return `\u001b[0m${part.value}`;
		}).join('');
		if(oldContentDiff.length > 2000 && newContentDiff.length > 2000) {
			if(oldContentDiff.slice(0, 2000) === newContentDiff.slice(0, 2000)) {
				oldContentDiff = `[...]\`\`\`ansi\n${oldContentDiff.slice(-2000)}\n\`\`\``;
				newContentDiff = `[...]\`\`\`ansi\n${newContentDiff.slice(-2000)}\n\`\`\``;
			}
			else{
				oldContentDiff = `\`\`\`ansi\n${oldContentDiff.slice(0, 2000)}\n\`\`\`[...]\n`;
				newContentDiff = `\`\`\`ansi\n${newContentDiff.slice(0, 2000)}\n\`\`\`[...]\n`;
			}
		}
		else{
			if(oldContentDiff.length > 2000) {
				oldContentDiff = `\`\`\`ansi\n${oldContentDiff.slice(0, 2000)}\n\`\`\`[...]\n`;
			}
			else{
				oldContentDiff = oldContentDiff && `\`\`\`ansi\n${oldContentDiff}\n\`\`\``;
			}
			if(newContentDiff.length > 2000) {
				newContentDiff = `\`\`\`ansi\n${newContentDiff.slice(0, 2000)}\n\`\`\`[...]\n`;
			}
			else{
				newContentDiff = newContentDiff && `\`\`\`ansi\n${newContentDiff}\n\`\`\``;
			}
		}
		const logData = await message.client.db.guild.getLogs(message.guild.id);
		if (!logData.logTypes.includes('messagesEdited')) return;
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
				.setTitle(`${emoji.messageUpdate} Mensagem deletada`)
				.setDescription(`Uma mensagem foi deletada em ${message.channel}`)
				.addFields(
					{
						name: 'Conteúdo Antigo:',
						value: oldContentDiff || '```Sem conteúdo```',
						inline: false
					},
					{
						name: 'Conteúdo Novo:',
						value: newContentDiff || '```Sem conteúdo```',
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
				.setColor('Yellow')
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `ID do Usuário: ${message.author.id}`,
					iconURL: message.guild.iconURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp();
			const linkButton = new ButtonBuilder()
				.setStyle('Link')
				.setLabel('Ir para a mensagem')
				.setURL(newMessage.url);
			const actionRow = new ActionRowBuilder()
				.addComponents(linkButton);
			await webhook.send({ embeds: [embed], components: [actionRow], username: message.guild.name, avatarURL: message.guild.iconURL({ dynamic: true, size: 4096 }) }).then(async (m) => {
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
			await message.client.db.guild.addLog(message.guild.id, `[MENSAGEM ATUALIZADA] @${message.author.tag} (${message.author.id}) atualizou uma mensagem em #${message.channel.name}\nConteúdo antig: ${message.content || 'Sem conteúdo'}\nConteúdo novo: ${newMessage.content || 'Sem conteúdo'}`);
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle(`${emoji.messageUpdate} Mensagem deletada`)
				.setDescription(`Uma mensagem foi deletada em ${message.channel}`)
				.addFields(
					{
						name: 'Conteúdo Antigo:',
						value: oldContentDiff || '```Sem conteúdo```',
						inline: false
					},
					{
						name: 'Conteúdo Novo:',
						value: newContentDiff || '```Sem conteúdo```',
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
				.setColor('Yellow')
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `ID do Usuário: ${message.author.id}`,
					iconURL: message.guild.iconURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp();
			const linkButton = new ButtonBuilder()
				.setStyle('Link')
				.setLabel('Ir para a mensagem')
				.setURL(newMessage.url);
			const actionRow = new ActionRowBuilder()
				.addComponents(linkButton);
			channel.send({ embeds: [embed], components: [actionRow] }).then(async (m) => {
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
			await message.client.db.guild.addLog(message.guild.id, `[MENSAGEM ATUALIZADA] @${message.author.tag} (${message.author.id}) atualizou uma mensagem em #${message.channel.name}\nConteúdo antig: ${message.content || 'Sem conteúdo'}\nConteúdo novo: ${newMessage.content || 'Sem conteúdo'}`);
		}
	}
};