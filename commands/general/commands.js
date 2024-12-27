const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Displays a list of all available community commands.'),

    async execute(interaction) {
        // List of commands
        const commands = [
            { name: '!lurk', description: 'Tell people you are in chat.' },
            { name: '!unlurk', description: 'Tell people you left chat.' },
            { name: '!donate', description: 'Donate to the stream.' },
            { name: '!tip', description: 'Donate to the stream.' },
            { name: '!shoutout', description: 'Shoutout a streamer. (Streamer Only)' },
        ];

        // Create the embed for the list of commands
        const helpEmbed = new EmbedBuilder()
            .setTitle('Community Commands')
            .setColor(0x00AE86)
            .setDescription('Here is a list of all available community commands:')
            .setTimestamp();

		// Add all the commands to the embed
        commands.forEach(command => {
            helpEmbed.addFields({ name: command.name, value: command.description });
        });

        // Send the embed as an ephemeral message
        return interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};