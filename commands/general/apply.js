const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'general',
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Sends you a link to the moderation applications forum.'),
	async execute(interaction) {
		await interaction.reply({ content: 'Apply to become a moderator at: Comming soon!', ephemeral: true });
	},
};