const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const canvafy = require('canvafy');

module.exports = async (interaction) => {
	if (interaction.customId === 'verify') {
		await interaction.deferReply({ ephemeral: true });
		const verificationData = await interaction.client.db.guild.getVerification(interaction.guild.id);
		const member = interaction.member;
		if (verificationData.enabled === false) return interaction.editReply({ content: 'O sistema de verificação está desativado.', ephemeral: true });
		if (member.roles.cache.some(role => verificationData.roles.includes(role.id))) return interaction.editReply({ content: 'Você já está verificado.', ephemeral: true });
		if (verificationData.type === 'letters') {
			const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const randomLetters = letters.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');
			const captcha = await new canvafy.Captcha()
				.setCaptchaKey(randomLetters)
				.setBackground('color', '#cd949d')
				.setBorder('#f0f0f0')
				.setOverlayOpacity(0.7)
				.build();

			const embed = new EmbedBuilder()
				.setTitle('Verificação')
				.setDescription('Clique no botão com as letras corretas.')
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setImage('attachment://captcha.png')
				.setColor('Green')
				.setTimestamp()
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) });

			const fakeLetters1 = letters.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');
			const fakeLetters2 = letters.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');

			const array = [
				{
					label: randomLetters,
					id: 'verify;correct',
					style: 'Secondary'
				},
				{
					label: fakeLetters1,
					id: 'verify;incorrect1',
					style: 'Secondary'
				},
				{
					label: fakeLetters2,
					id: 'verify;incorrect2',
					style: 'Secondary'
				}
			];

			const buttons = array.sort(() => Math.random() - 0.5);
			const actionRow = new ActionRowBuilder();
			for (const button of buttons) {
				actionRow.addComponents(new ButtonBuilder()
					.setStyle(button.style)
					.setLabel(button.label)
					.setCustomId(button.id)
				);
			}
			await interaction.editReply({ content: `${interaction.user}`, embeds: [embed], ephemeral: true, files: [{
				attachment: captcha,
				name: 'captcha.png'
			}], components: [actionRow] });
		}
		if (verificationData.type === 'alphanumeric') {
			const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			const randomAlphanumeric = alphanumeric.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');
			const captcha = await new canvafy.Captcha()
				.setCaptchaKey(randomAlphanumeric)
				.setBackground('color', '#cd949d')
				.setBorder('#f0f0f0')
				.setOverlayOpacity(0.7)
				.build();
			const embed = new EmbedBuilder()
				.setTitle('Verificação')
				.setDescription('Clique no botão com os caracteres corretos.')
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setImage('attachment://captcha.png')
				.setColor('Green')
				.setTimestamp()
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) });
			const fakeAlphanumeric1 = alphanumeric.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');
			const fakeAlphanumeric2 = alphanumeric.split('').sort(() => Math.random() - 0.5).slice(0, 6).join('');
			const array = [
				{
					label: randomAlphanumeric,
					id: 'verify;correct',
					style: 'Secondary'
				},
				{
					label: fakeAlphanumeric1,
					id: 'verify;incorrect1',
					style: 'Secondary'
				},
				{
					label: fakeAlphanumeric2,
					id: 'verify;incorrect2',
					style: 'Secondary'
				}
			];
			const buttons = array.sort(() => Math.random() - 0.5);
			const actionRow = new ActionRowBuilder();
			for (const button of buttons) {
				actionRow.addComponents(new ButtonBuilder()
					.setStyle(button.style)
					.setLabel(button.label)
					.setCustomId(button.id)
				);
			}
			await interaction.editReply({ content: `${interaction.user}`, embeds: [embed], ephemeral: true, files: [{
				attachment: captcha,
				name: 'captcha.png'
			}], components: [actionRow] });
		}
	}
	if (interaction.customId.startsWith('verify')) {
		const verificationData = await interaction.client.db.guild.getVerification(interaction.guild.id);
		const type = interaction.customId.split(';')[1];
		const member = interaction.member;
		if (type === 'correct') {
			await member.roles.add(verificationData.roles);
			const embed = new EmbedBuilder()
				.setTitle('Verificação')
				.setDescription('Você foi verificado com sucesso!')
				.setColor('Green')
				.setTimestamp()
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) });
			await interaction.followUp({ content: `${interaction.user}`, embeds: [embed], ephemeral: true });
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle('Verificação')
				.setDescription('Você errou, tente novamente.')
				.setColor('Red')
				.setTimestamp()
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) });
			await interaction.followUp({ content: `${interaction.user}`, embeds: [embed], ephemeral: true });
		}
	}
};