const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const bot = require("../../bot");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fun-mode')
        .setDescription('Enables a secret option!'),
    async execute(interaction) {
        if(interaction.user.id === "923099858972323860" || interaction.user.id === "771766837662318602") {
            interaction.reply("Ohio, Onii-chan!");
            if(!bot.funChannels.has(interaction.channel.id)) {
                bot.funChannels.add(interaction.channel.id);
                interaction.channel.sessionData = {
                    messages: []
                };
                interaction.channel.send("Enabled onii-chan!");
            } else {
                bot.funChannels.delete(interaction.channel.id);
                interaction.channel.send("Disabled onii-chan!!");
            }
        } else {
            interaction.reply("Only my onii-chan is allowed to use this!");
        }
        console.log(bot.funChannels);
    },
};
