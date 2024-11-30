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