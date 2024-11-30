const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-session')
        .setDescription('Creates a Roast Battle Session!')
        .addStringOption(option => {
            return option
                .setName("type")
                .setDescription("Set the type of Roast Session")
                .setChoices([
                    { name: "vs. AI", value: "bot" },
                    { name: "vs. User", value: "user" }
                ]);
        })
        .addUserOption(option => {
            return option
                .setName("user")
                .setDescription("The user you wish to fight against!");
        }),
    async execute(interaction) {
        const sessionType = interaction.options.getString("type");
        const challengedUser = interaction.options.getUser("user");
        const guild = interaction.guild;

        if (sessionType === "bot" || sessionType === null) {
            await interaction.reply(`Psst... I was having a nice sleep! HOW DARE YOU INTERRUPT ME!? CHALLENGE ACCEPTED <@${interaction.user.id}>`);
            const sessionId = Math.floor(1000 + Math.random() * 9000); // Generate a unique session ID

            try {
                // Create a private channel for "vs. AI"
                const channel = await guild.channels.create({
                    name: `ai-roast-session-${sessionId}`,
                    type: 0, // 0 for text channels
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id, // Deny everyone access
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id, // Allow the challenger
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: guild.members.me.id, // Allow the bot
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.Administrator))?.id, // Allow admins
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });

                // Create an embed for the AI session
                const embed = new EmbedBuilder()
                    .setTitle(`🤖 Roast Battle: You vs. AI 🤖`)
                    .setDescription(`Session ID: \`${sessionId}\`\nChallenger: <@${interaction.user.id}>\n\nLet the roasting begin! The bot is ready to clap back.`)
                    .setColor(0x00BFFF) // A cool blue color
                    .setTimestamp()
                    .setFooter({text: "Be careful! The bot learns from your roasts."});

                // Add buttons for the session
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`end-session-${sessionId}`)
                            .setLabel('End Session')
                            .setStyle(ButtonStyle.Danger), // Red for end session
                        new ButtonBuilder()
                            .setCustomId(`pause-session-${sessionId}`)
                            .setLabel('Pause Session')
                            .setStyle(ButtonStyle.Secondary), // Gray for pause session
                        new ButtonBuilder()
                            .setCustomId(`resume-session-${sessionId}`)
                            .setLabel('Resume Session')
                            .setStyle(ButtonStyle.Success) // Green for resume session
                    );

                channel.sessionData = {
                    challenger: interaction.user.id,
                };

                // Send the embed with buttons
                await channel.send({embeds: [embed], components: [row]});
            } catch (err) {
                console.log(err);
            }
        } else if (sessionType === "user") {
            if (!challengedUser) {
                await interaction.reply(`<@${interaction.user.id}>, are you so dumb that you can't specify the name of the person you wish to battle against??`);
                return;
            }

            await interaction.reply(`Oh! So you lowly humans want to fight against each other? Well sure ig.`);

            // Generate a unique numeric ID for the session
            const sessionId = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit ID

            try {
                // Create a private channel
                const channel = await guild.channels.create({
                    name: `roast-session-${sessionId}`,
                    type: 0, // 0 for text channels
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id, // Deny everyone access
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id, // Allow the challenger
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: challengedUser.id, // Allow the person challenged
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: guild.members.me.id, // Allow the bot
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.Administrator))?.id, // Allow admins
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });

                // Create an embed for the first message
                const embed = new EmbedBuilder()
                    .setTitle(`🔥 Roast Battle Session 🔥`)
                    .setDescription(`Session ID: \`${sessionId}\`\nChallenger: <@${interaction.user.id}>\nOpponent: <@${challengedUser.id}>\n\nLet the roasting begin!`)
                    .setColor(0xFF4500) // A fiery orange color
                    .setTimestamp()
                    .setFooter({ text: "Roast responsibly!" });

                // Create buttons for session utilities
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`end-session-${sessionId}`)
                            .setLabel('End Session')
                            .setStyle(ButtonStyle.Danger), // Red for end session
                        new ButtonBuilder()
                            .setCustomId(`pause-session-${sessionId}`)
                            .setLabel('Pause Session')
                            .setStyle(ButtonStyle.Secondary), // Gray for pause session
                        new ButtonBuilder()
                            .setCustomId(`resume-session-${sessionId}`)
                            .setLabel('Resume Session')
                            .setStyle(ButtonStyle.Success) // Green for resume session
                    );

                // Send the embed with buttons to the channel
                await channel.send({ embeds: [embed], components: [row] });

                // Store session data for button interactions
                channel.sessionData = {
                    challenger: interaction.user.id,
                    opponent: challengedUser.id,
                };
            } catch (error) {
                console.error(error);
                await interaction.reply(`Uh-oh, something went wrong while creating the session. Tell the devs to check their code!`);
            }
        }
    },
};
