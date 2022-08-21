import 'dotenv/config'
import { Discord, SimpleCommand, SimpleCommandOption } from "discordx";
import { EmbedBuilder } from "discord.js";

import { player } from "./../player.js";
import { processMessageJoin } from "./../join.js";
import { IncludeControls } from "../helpers/controls.js";

@Discord()
abstract class Play extends IncludeControls {
    @SimpleCommand({ aliases: ["p"], name: "play" })
    private async play(
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