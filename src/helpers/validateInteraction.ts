import type { CommandInteraction, Guild } from "discord.js";
import type { MyQueue } from "./../commands/music.js";
import { GuildMember } from "discord.js";
import { player } from "./../player.js";

export function validateInteraction(
    interaction: CommandInteraction
): undefined | { guild: Guild; member: GuildMember; queue: MyQueue } {
    if (
        !interaction.guild ||
        !(interaction.member instanceof GuildMember) ||
        !interaction.channel
    ) {
        interaction.reply(
            "> Your request could not be processed, please try again later"
        );

        setTimeout(() => interaction.deleteReply(), 15e3);
        return;
    }

    if (!interaction.member.voice.channel) {
        interaction.reply(
            "> To use the music commands, you need to join voice channel"
        );

        setTimeout(() => interaction.deleteReply(), 15e3);
        return;
    }

    const queue = player.getQueue(interaction.guild, interaction.channel);

    if (
        !queue.isReady ||
        interaction.member.voice.channel.id !== queue.voiceChannelId
    ) {
        interaction.reply(
            "> To use the music commands, you need to join the bot voice channel"
        );

        setTimeout(() => interaction.deleteReply(), 15e3);
        return;
    }

    return { guild: interaction.guild, member: interaction.member, queue };
}
