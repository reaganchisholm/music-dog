import "reflect-metadata";
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from 'discord.js';
import { Client } from "discordx";
import 'dotenv/config'

export const bot = new Client({
    botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    // Configuration for @SimpleCommand
    simpleCommand: {
        prefix: "-",
    },
    silent: true,
});

bot.once("ready", async () => {
    await bot.guilds.fetch();
    await bot.initApplicationCommands();
    console.log("Bot is ready!");
});

bot.on("interactionCreate", (interaction) => {
    bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message) => {
    bot.executeCommand(message);
});

async function run() {
    await importx(dirname(import.meta.url) + "/{events,commands,simple-commands}/**/*.{ts,js}");

    if (!process.env.BOT_TOKEN) {
        throw Error("Could not find BOT_TOKEN in your environment");
    }

    await bot.login(process.env.BOT_TOKEN);
}

run();