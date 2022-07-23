import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { processJoin } from "../join";
import { player } from "../player";
let play = class play {
    async play(songName, interaction) {
        const queue = await processJoin(interaction, player);
        // No queue, do nothing
        if (!queue) {
            return;
        }
        const song = await queue.play(songName, { user: interaction.user });
        if (!song) {
            interaction.followUp("Couldn't find a song, sorry I'm a dumb dog.");
        }
        else {
            const embed = new EmbedBuilder();
            embed.setTitle("Banger Queued");
            embed.setDescription(`Banger queued: **${song.title}**`);
            interaction.followUp({ embeds: [embed] });
        }
    }
};
__decorate([
    Slash("play", {
        description: "Play a song"
    }),
    __param(0, SlashOption("song", {
        description: "song name"
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], play.prototype, "play", null);
play = __decorate([
    Discord()
], play);
export { play };
//# sourceMappingURL=play.js.map