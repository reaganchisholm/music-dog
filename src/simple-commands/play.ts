import type { CommandInteraction, Message } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, SimpleCommandOption } from "discordx";

import { player } from "./../player.js";
import { processJoin, processMessageJoin } from "./../join.js";
import { IncludeControls } from "../helpers/controls.js";
import { bot } from "../main.js";

@Discord()
abstract class Play extends IncludeControls {
    @SimpleCommand("play", {
        description: "Play a song",
        aliases: ["p"]
    })
    private async play(
        @SimpleCommandOption("name", { type: 0 })
        command: string,
        rawMessage: any 
    ): Promise<void> {

        const queue = await processMessageJoin(rawMessage.message, player);

        // No queue, do nothing
        if (!queue) { return }

        const commandRegex = new RegExp(`(${process.env.BOT_PREFIX}.) (.+)`);
        const regexGroups = commandRegex.exec(rawMessage.message.content);
        let songRequest = regexGroups ? regexGroups[2] : "";

        // We add lyrics to try and avoid music videos
        if(songRequest.includes("lyric") === false){
            songRequest = `${songRequest} lyrics`;
        }

        const song = await queue.play(songRequest, { user: rawMessage.member });

        if (!song) {
            rawMessage.reply("Couldn't find a song, sorry I'm a dumb dog.");
        } else {
            const embed = new EmbedBuilder();
            embed.setTitle("Banger Queued");
            embed.setDescription(`Banger queued: **${song.title}**`);
            rawMessage.message.channel.send({ embeds: [embed] });
        }
    }
}