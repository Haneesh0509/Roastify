require("dotenv").config();
const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST().setToken(process.env.TOKEN);

const commands = [];
const commandBuilders = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command);
        commandBuilders.push(command.data);
    }
}

const slashRegister = async () => {
    try {
        commandBuilders.forEach(commandBuilder => {
            console.log(commandBuilder.name)
        })
        await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
            body: commandBuilders
        });
        console.log("Registered");
    } catch (err) {
        console.log(err);
    }
};

slashRegister();

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isCommand()) return;
    console.log(interaction.commandId)
    commands.forEach(command => {
        if(interaction.commandName === command.data.name)
            command.execute(interaction)
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const { customId, channel, member } = interaction;

    const [action, sessionId] = customId.split('-');

    const sessionData = channel.sessionData || {};
    const { challenger, opponent } = sessionData;

    console.log(challenger)

    // const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);

    switch (action) {
        case 'end':
            if (interaction.user.id !== challenger) {
                await interaction.reply({ content: 'Only the challenger or an admin can end the session!', ephemeral: true });
                return;
            }

            await interaction.reply({ content: 'Session ended. Hope you had fun roasting!', ephemeral: true });
            if (channel.deletable) await channel.delete();
            break;

        case 'pause':
            try {
                // Disable messaging for challenger and opponent
                await channel.permissionOverwrites.edit(challenger, { SendMessages: false });
                await channel.permissionOverwrites.edit(opponent, { SendMessages: false });

                await interaction.reply({ content: 'The session has been paused. Nobody can send messages now.', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Something went wrong while pausing the session.', ephemeral: true });
            }
            break;

        case 'resume':
            try {
                // Enable messaging for challenger and opponent
                await channel.permissionOverwrites.edit(challenger, { SendMessages: true });
                await channel.permissionOverwrites.edit(opponent, { SendMessages: true });

                await interaction.reply({ content: 'The session has been resumed. Let the roasting continue!', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Something went wrong while resuming the session.', ephemeral: true });
            }
            break;

        default:
            await interaction.reply({ content: 'Unknown action!', ephemeral: true });
            break;
    }
});


client.login(process.env.TOKEN);
