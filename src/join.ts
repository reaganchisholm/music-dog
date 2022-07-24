import type { CommandInteraction, Message } from "discord.js";
import type { MyQueue, DogPlayer } from "./player.js";
import { GuildMember } from "discord.js";
import { bot } from "./main.js";

export async function processJoin(
    interaction: CommandInteraction,
    player: DogPlayer
): Promise<MyQueue | undefined> {
    if (
        !interaction.guild ||
        !interaction.channel ||
        !(interaction.member instanceof GuildMember)
    ) {
        interaction.reply(
            "> Your request could not be processed, please try again later"
        );

        setTimeout(() => interaction.deleteReply(), 15e3);
        return;
    }

    if (
        !(interaction.member instanceof GuildMember) ||
        !interaction.member.voice.channel
    ) {
        interaction.reply("> You are not in the voice channel");

        setTimeout(() => interaction.deleteReply(), 15e3);
        return;
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guild, interaction.channel);

    if (!queue.isReady) {
        queue.channel = interaction.channel;
        await queue.join(interaction.member.voice.channel);
    }

    return queue;
}

export async function processMessageJoin(
    message: Message,
    player: DogPlayer
): Promise<MyQueue | undefined> {
    if (
        !message.guildId ||
        !message.channelId ||
        !(message.member instanceof GuildMember)
    ) {
        message.reply(
            "> Your request could not be processed, please try again later"
        );
        return;
    }

    if (
        !(message.member instanceof GuildMember) ||
        !message.member.voice.channel
    ) {
        message.reply("> You are not in the voice channel");
        return;
    }

    const guild = await bot.guilds.fetch(message.guildId);
    const queue = player.getQueue(guild, message.channel);

    if (!queue.isReady) {
        queue.channel = message.channel;
        await queue.join(message.member.voice.channel);
    }

    return queue;
}