import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { processJoin } from "../join";

import { player } from "../player";

@Discord()
export class play {
    @Slash("play", {
        description: "Play a song"
    })

    async play(
        @SlashOption("song", {
            description: "song name"
        })
        songName: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const queue = await processJoin(interaction, player);

        // No queue, do nothing
        if (!queue) { return }

        const song = await queue.play(songName, { user: interaction.user });

        if (!song) {
            interaction.followUp("Couldn't find a song, sorry I'm a dumb dog.");
        } else {
            const embed = new EmbedBuilder();
            embed.setTitle("Banger Queued");
            embed.setDescription(`Banger queued: **${song.title}**`);
            interaction.followUp({ embeds: [embed] });
        }
    }
}