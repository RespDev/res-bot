const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const logChannelId = '1273411417927581746';

        // Checks the users role
        const allowedRoles = ['1219333877009748059', '1219333975303000255', '1219334026398269452'];
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Create the embed for the warning message
        const warnEmbed = new EmbedBuilder()
            .setTitle('⚠️ You Have Been Warned')
            .setColor(0xFFA500) // Orange color
            .addFields(
                { name: 'Reason', value: reason },
                { name: 'Warned by', value: interaction.user.tag }
            )
            .setFooter({ text: 'Please follow the server rules or further action may be taken.' })
            .setTimestamp();

        // Send DM to the user
        try {
            await user.send({ embeds: [warnEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${user.tag}.`);
        }

        // Create the embed for the log channel
        const logEmbed = new EmbedBuilder()
            .setTitle('User Warned')
            .setColor(0xFF0000) // Red color
            .addFields(
                { name: 'User', value: `${user.tag} (${user.id})` },
                { name: 'Reason', value: reason },
                { name: 'Warned by', value: interaction.user.tag }
            )
            .setTimestamp();

        // Log the warning in the specified channel
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Log channel not found: ${logChannelId}`);
        }

        // Acknowledge the command in the interaction
        return interaction.reply({ content: `${user.tag} has been warned.`, ephemeral: true });
    },
};
