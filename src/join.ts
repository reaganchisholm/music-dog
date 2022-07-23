
import type { CommandInteraction } from "discord.js";
import type { MyQueue, DogPlayer } from "./commands/music.js";
import { GuildMember } from "discord.js";

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