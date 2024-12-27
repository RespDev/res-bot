const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    category: 'general',  // Set the category of the command
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Send a predefined embed to a specified channel.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of embed to send.')
                .setRequired(true)
                .addChoices(
                    { name: 'rules', value: 'rules' },
                    { name: 'schedule', value: 'schedule' },
                    { name: 'giveaways', value: 'giveaways' },
                    { name: 'roles', value: 'roles' },
                    { name: 'polls', value: 'polls' },
                    { name: 'verify', value: 'verify' }
                )),
    async execute(interaction) {
        const type = interaction.options.getString('type');

        // Checks that the user is a Streamer
        if (!interaction.member.roles.cache.has('1219333877009748059')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Define channel IDs
        const channels = {
            rules: '1219471547123634278', // Rules channel
            schedule: '1219470242804400219', // Schedule channel
            giveaways: '1219470322374414436', // Giveaway channel
            roles: '1220029638902943824', // Reaction roles channel
            polls: '1273401324431740928', // Polls channel
            verify: '1219777269610840105' // Verify channel
        };

        // Define embed messages
        const embeds = {
            rules: new EmbedBuilder()
                .setTitle('Community Rules')
                .setColor(0x00FF00)  // Green color
                .setDescription(`
**1.** Do not swear.
**2.** Inappropriate content of any kind is not allowed.
**3.** No links are allowed. (Gifs allowed in <#1219470917583769650>)
**4.** All slash commands must be used in bot-commands.
**5.** Do not spam.
**6.** Do not advertise unless you are doing it in a channel where it is allowed or you have permission.
**7.** You must be 13 or older to be in this server otherwise you will be banned.
**8.** Follow Discord TOS.
                `)
                .setFooter({ text: 'Rules subject to change.' })
                .setTimestamp(),
            schedule: new EmbedBuilder()
                .setTitle('Stream Schedule')
                .setColor(0x00FF00)  // Green color
                .addFields(
                    { name: 'Monday', value: 'No scheduled streams', inline: false },
                    { name: 'Tuesday', value: 'No scheduled streams', inline: false },
                    { name: 'Wednesday', value: 'No scheduled streams', inline: false },
                    { name: 'Thursday', value: 'No scheduled streams', inline: false },
                    { name: 'Friday', value: 'No scheduled streams', inline: false },
                    { name: 'Saturday', value: 'No scheduled streams', inline: false },
                    { name: 'Sunday', value: 'No scheduled streams', inline: false }
                )
                .setFooter({ text: 'Schedule subject to change.' })
                .setTimestamp(),
            giveaways: new EmbedBuilder()
                .setTitle('About Giveaways')
                .setColor(0x00FF00)  // Green color
                .setDescription(`
**Giveaways will be posted below.** 
Stay tuned for exciting opportunities to win great prizes!
                `)
                .setFooter({ text: 'Good luck to everyone!' })
                .setTimestamp(),
            roles: new EmbedBuilder()
                .setTitle('Reaction Roles')
                .setColor(0x00FF00)  // Green color
                .setDescription(`
Hit the buttons below to get notified for when I go live, make new videos, and host giveaways!
                `)
                .setFooter({ text: 'Reaction roles subject to change.' })
                .setTimestamp(),
            polls: new EmbedBuilder()
                .setTitle('About Polls')
                .setColor(0x00FF00)  // Green color
                .setDescription(`
Streamers are able to host polls in this channel when they want to let their followers vote on topics.
                `)
                .setFooter({ text: 'Polls are hosted randomly by Streamers.' })
                .setTimestamp(),
            verify: new EmbedBuilder()
                .setTitle('Verification Instructions')
                .setColor(0x00FF00)  // Green color
                .setDescription(`
Type **!verify** to verify that you are a human and gain access to the rest of the communications server.
                `)
                .setFooter({ text: 'Method of verification subject to change.' })
                .setTimestamp()
        };

        // Get the channel ID and embed based on the type
        const channelId = channels[type];
        const embed = embeds[type];

        if (!channelId || !embed) {
            return interaction.reply({ content: 'Invalid embed type.', ephemeral: true });
        }

        // Send the embed to the specified channel
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            return interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        // Delete the most recent message in the channel if it exists
        const messages = await channel.messages.fetch({ limit: 1 });
        if (messages.size > 0) {
            const lastMessage = messages.first();
            try {
                await lastMessage.delete();
            } catch (error) {
                console.error('Error deleting old message:', error);
            }
        }

        if (type == 'roles') {
            // Create role buttons
            const live = new ButtonBuilder()
                .setCustomId('live')
                .setLabel('Live Ping')
                .setStyle(ButtonStyle.Success);

            const video = new ButtonBuilder()
                .setCustomId('video')
                .setLabel('Video Ping')
                .setStyle(ButtonStyle.Success);
        
            const giveaway = new ButtonBuilder()
                .setCustomId('giveaway')
                .setLabel('Giveaway Ping')
                .setStyle(ButtonStyle.Success);

            // Create an action row
            const row = new ActionRowBuilder()
                .addComponents(live, video, giveaway);

            // Send embed
            await channel.send({ embeds: [embed], components: [row] });
        } else {
            await channel.send({ embeds: [embed] });
        }

        await interaction.reply({ content: `Embed sent to the ${type} channel.`, ephemeral: true });
    },
};