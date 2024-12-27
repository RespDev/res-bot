const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        // List of role IDs that cannot be banned
        const protectedRoleIds = ['1219333877009748059', '1219333975303000255', '1219334026398269452', '1219774148516118652'];

        // Checks the users role
        const allowedRoles = ['1219333877009748059', '1219333975303000255'];
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Self or bot check
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
        }
        if (user.id === interaction.client.user.id) {
            return interaction.reply({ content: 'You cannot ban the bot.', ephemeral: true });
        }

        // Protected role check
        if (member.roles.cache.some(role => protectedRoleIds.includes(role.id))) {
            return interaction.reply({ content: 'This user cannot be banned because they have a protected role.', ephemeral: true });
        }

        // Ban the user
        try {
            try {
                // Proceed with the ban
                await member.ban({ reason });                
            } catch (error) {
                console.error(`Failed to ban user: ${error}`);
                return interaction.reply({ content: `${user.tag} was unable to be banned.`, ephemeral: true });
            }

            // DM the user about the ban
            const banEmbed = new EmbedBuilder()
                .setTitle('⚠️ You Have Been Banned')
                .setColor(0xFF0000) // Red Color
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Banned by', value: interaction.user.tag }
                )
                .setFooter({ text: 'This ban will never expire.' })
                .setTimestamp();

            await user.send({ embeds: [banEmbed] }).catch(error => {
                console.error(`Could not send DM to ${user.tag}: ${error}`);
            });
            
            // Confirmation embed
            const embed = new EmbedBuilder()
                .setTitle('User Banned')
                .setColor(0xFF0000) // Red color for the ban action
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})` },
                    { name: 'Reason', value: reason },
                    { name: 'Banned by', value: interaction.user.tag }
                )
                .setTimestamp();

            const logsChannel = interaction.guild.channels.cache.get('1273411417927581746');
            if (logsChannel) {
                logsChannel.send({ embeds: [embed] });
            } else {
                console.error(`Logs channel not found: ${logsChannelId}`);
            }

            // Acknowledge the command in the interaction
            return interaction.reply({ content: `${user.tag} has been banned for the reason: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error(`Failed to ban user: ${error}`);
            return interaction.reply({ content: `There was an error trying to ban ${user.tag}.`, ephemeral: true });
        }
    },
};