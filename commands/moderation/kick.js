const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        // Logs channel ID
        const logsChannelId = '1273411417927581746';

        // List of role IDs that cannot be kicked
        const protectedRoleIds = ['1219333877009748059', '1219333975303000255', '1219334026398269452', '1219774148516118652'];

        // Checks the users role
        const allowedRoles = ['1219333877009748059', '1219333975303000255'];
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Self or bot check
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
        }
        if (user.id === interaction.client.user.id) {
            return interaction.reply({ content: 'You cannot kick the bot.', ephemeral: true });
        }

        // Protected role check
        if (member.roles.cache.some(role => protectedRoleIds.includes(role.id))) {
            return interaction.reply({ content: 'This user cannot be kicked because they have a protected role.', ephemeral: true });
        }

        // Kick the user
        try {
            try {
                // Proceed with the kick
                await member.kick(reason);
            } catch (error) {
                console.error(`Failed to kick user: ${error}`);
                return interaction.reply({ content: `${user.tag} was unable to be kicked.`, ephemeral: true });
            }

            // DM the user about the kick
            const kickEmbed = new EmbedBuilder()
                .setTitle('⚠️ You Have Been Kicked')
                .setColor(0xFFA500) // Red Color
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Kicked by', value: interaction.user.tag }
                )
                .setFooter({ text: 'The next punishment will result in a ban.' })
                .setTimestamp();

            await user.send({ embeds: [kickEmbed] }).catch(error => {
                console.error(`Could not send DM to ${user.tag}: ${error}`);
            });

            // Log embed for the logs channel
            const logEmbed = new EmbedBuilder()
                .setTitle('User Kicked')
                .setColor(0xFF0000)
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})` },
                    { name: 'Reason', value: reason },
                    { name: 'Kicked by', value: interaction.user.tag }
                )
                .setTimestamp();

            const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
            if (logsChannel) {
                logsChannel.send({ embeds: [logEmbed] });
            } else {
                console.error(`Logs channel not found: ${logsChannelId}`);
            }

            // Acknowledge the command in the interaction
            return interaction.reply({ content: `${user.tag} has been kicked for the reason: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error(`Failed to kick user: ${error}`);
            return interaction.reply({ content: `There was an error trying to kick ${user.tag}.`, ephemeral: true });
        }
    },
};