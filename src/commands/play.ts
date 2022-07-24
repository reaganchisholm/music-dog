import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { player } from "./../player.js";
import { processJoin } from "./../join.js";
import { IncludeControls } from "../helpers/controls.js";

@Discord()
abstract class Play extends IncludeControls {
    @Slash("play", {
        description: "Play a song"
    })
    private async play(
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