import "reflect-metadata";
import type { Interaction, Message } from "discord.js";
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
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    // Configuration for @SimpleCommand
    simpleCommand: {
        prefix: "?",
    },
});

bot.once("ready", async () => {
    await bot.guilds.fetch();
    await bot.initApplicationCommands();

    console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
    bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
    bot.executeCommand(message);
});

async function run() {
    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

    if (!process.env.BOT_TOKEN) {
        throw Error("Could not find BOT_TOKEN in your environment");
    }

    await bot.login(process.env.BOT_TOKEN);
}

run();