/* DEPRECATED
 * ____  _____ ____  ____  _____ ____    _  _____ _____ ____
* |  _ \| ____|  _ \|  _ \| ____/ ___|  / \|_   _| ____|  _ \
* | | | |  _| | |_) | |_) |  _|| |     / _ \ | | |  _| | | | |
* | |_| | |___|  __/|  _ <| |__| |___ / ___ \| | | |___| |_| |
* |____/|_____|_|   |_| \_\_____\____/_/   \_\_| |_____|____/
* Earlier this file was used to deploy slash commands
* Now it is being dynamically done in the bot.js file
* This file has lost the use and purpose it has and will soon be removed */

require("dotenv").config();
const { REST, Routes } = require("discord.js");

const botId = process.env.BOT_ID;
const botToken = process.env.TOKEN;

const rest = new REST().setToken(botToken);
const slashRegister = async () => {
    try {
       await rest.put(Routes.applicationCommands(botId), {
            body: [
                {
                    name: "ping",
                    description: "Pings the bot!!"
                }
            ]
        });
        console.log("Registered");
    } catch (err) {
        console.log(err);
    }
};

// slashRegister();
// rest.delete(Routes.applicationCommand(process.env.BOT_ID, '1311895654917865492'))
//     .then(() => console.log('Successfully deleted application command'))
//     .catch(console.error);