import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder, GuildMember } from "discord.js";
import { ButtonComponent, Discord, On, Slash, SlashGroup, SlashOption, } from "discordx";
import { DogPlayer } from "./music.js";
let music = class music {
    player;
    constructor() {
        this.player = new DogPlayer();
    }
    voiceUpdate([oldState, newState]) {
        const queue = this.player.getQueue(oldState.guild);
        if (!queue.isReady ||
            !queue.voiceChannelId ||
            (oldState.channelId != queue.voiceChannelId &&
                newState.channelId != queue.voiceChannelId) ||
            !queue.channel) {
            return;
        }
        const channel = oldState.channelId === queue.voiceChannelId
            ? oldState.channel
            : newState.channel;
        if (!channel) {
            return;
        }
        const totalMembers = channel.members.filter((m) => !m.user.bot);
        if (queue.isPlaying && !totalMembers.size) {
            queue.pause();
            queue.channel.send("> Dogs can't DJ alone. Please join the voice channel to continue.");
            if (queue.timeoutTimer) {
                clearTimeout(queue.timeoutTimer);
            }
            queue.timeoutTimer = setTimeout(() => {
                queue.channel?.send("> I've been DJ'ing alone for 5 minutes. I'm leaving.");
                queue.leave();
            }, 5 * 60 * 1000);
        }
        else if (queue.isPause && totalMembers.size) {
            if (queue.timeoutTimer) {
                clearTimeout(queue.timeoutTimer);
                queue.timeoutTimer = undefined;
            }
            queue.resume();
            queue.channel.send("> Welcome to the doggie DJ zone, enjoy.");
        }
    }
    validateControlInteraction(interaction) {
        if (!interaction.guild ||
            !interaction.channel ||
            !(interaction.member instanceof GuildMember)) {
            interaction.reply("> Your request could not be processed, please try again later");
            return;
        }
        const queue = this.player.getQueue(interaction.guild, interaction.channel);
        if (interaction.member.voice.channelId !== queue.voiceChannelId) {
            interaction.reply("> To use the controls, you need to join the bot voice channel");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        return queue;
    }
    async nextControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.skip();
        await interaction.deferReply();
        interaction.deleteReply();
    }
    async pauseControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.isPause ? queue.resume() : queue.pause();
        await interaction.deferReply();
        interaction.deleteReply();
    }
    async leaveControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.leave();
        await interaction.deferReply();
        interaction.deleteReply();
    }
    async repeatControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.setRepeat(!queue.repeat);
        await interaction.deferReply();
        interaction.deleteReply();
    }
    queueControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.view(interaction);
    }
    async mixControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.mix();
        await interaction.deferReply();
        interaction.deleteReply();
    }
    async controlsControl(interaction) {
        const queue = this.validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.updateControlMessage({ force: true });
        await interaction.deferReply();
        interaction.deleteReply();
    }
    async processJoin(interaction) {
        if (!interaction.guild ||
            !interaction.channel ||
            !(interaction.member instanceof GuildMember)) {
            interaction.reply("> Your request could not be processed, please try again later");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        if (!(interaction.member instanceof GuildMember) ||
            !interaction.member.voice.channel) {
            interaction.reply("> You are not in the voice channel");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        await interaction.deferReply();
        const queue = this.player.getQueue(interaction.guild, interaction.channel);
        if (!queue.isReady) {
            queue.channel = interaction.channel;
            await queue.join(interaction.member.voice.channel);
        }
        return queue;
    }
    async play(songName, interaction) {
        const queue = await this.processJoin(interaction);
        if (!queue) {
            return;
        }
        const song = await queue.play(songName, { user: interaction.user });
        if (!song) {
            interaction.followUp("The song could not be found");
        }
        else {
            const embed = new EmbedBuilder();
            embed.setTitle("Queued up that banger!");
            embed.setDescription(`Banger queued: **${song.title}****`);
            interaction.followUp({ embeds: [embed] });
        }
    }
    async playlist(playlistName, interaction) {
        const queue = await this.processJoin(interaction);
        if (!queue) {
            return;
        }
        const songs = await queue.playlist(playlistName, {
            user: interaction.user,
        });
        if (!songs) {
            interaction.followUp("The playlist could not be found");
        }
        else {
            const embed = new EmbedBuilder();
            embed.setTitle("Enqueued");
            embed.setDescription(`Enqueued **${songs.length}** songs from playlist`);
            interaction.followUp({ embeds: [embed] });
        }
    }
    validateInteraction(interaction) {
        if (!interaction.guild ||
            !(interaction.member instanceof GuildMember) ||
            !interaction.channel) {
            interaction.reply("> Your request could not be processed, please try again later");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        if (!interaction.member.voice.channel) {
            interaction.reply("> To use the music commands, you need to join voice channel");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        const queue = this.player.getQueue(interaction.guild, interaction.channel);
        if (!queue.isReady ||
            interaction.member.voice.channel.id !== queue.voiceChannelId) {
            interaction.reply("> To use the music commands, you need to join the bot voice channel");
            setTimeout(() => interaction.deleteReply(), 15e3);
            return;
        }
        return { guild: interaction.guild, member: interaction.member, queue };
    }
    shuffle(interaction) {
        const validate = this.validateInteraction(interaction);
        if (!validate) {
            return;
        }
        const { queue } = validate;
        queue.mix();
        interaction.reply("> Shuffled current music queue");
    }
    pause(interaction) {
        const validate = this.validateInteraction(interaction);
        if (!validate) {
            return;
        }
        const { queue } = validate;
        if (queue.isPause) {
            interaction.reply("> Music is already paused");
            return;
        }
        queue.pause();
        interaction.reply("> Paused music");
    }
    unpause(interaction) {
        const validate = this.validateInteraction(interaction);
        if (!validate) {
            return;
        }
        const { queue } = validate;
        if (queue.isPlaying) {
            interaction.reply("> already playing");
            return;
        }
        queue.resume();
        interaction.reply("> Unpaused music");
    }
    stop(interaction) {
        const validate = this.validateInteraction(interaction);
        if (!validate) {
            return;
        }
        const { queue } = validate;
        queue.leave();
        interaction.reply("> Stopped playing music");
    }
};
__decorate([
    On("voiceStateUpdate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], music.prototype, "voiceUpdate", null);
__decorate([
    ButtonComponent("btn-next"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "nextControl", null);
__decorate([
    ButtonComponent("btn-pause"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "pauseControl", null);
__decorate([
    ButtonComponent("btn-leave"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "leaveControl", null);
__decorate([
    ButtonComponent("btn-repeat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "repeatControl", null);
__decorate([
    ButtonComponent("btn-queue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], music.prototype, "queueControl", null);
__decorate([
    ButtonComponent("btn-mix"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "mixControl", null);
__decorate([
    ButtonComponent("btn-controls"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "controlsControl", null);
__decorate([
    Slash("play", { description: "Play a song" }),
    __param(0, SlashOption("song", { description: "song name" })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "play", null);
__decorate([
    Slash("playlist", { description: "Play a playlist" }),
    __param(0, SlashOption("playlist", { description: "playlist name" })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], music.prototype, "playlist", null);
__decorate([
    Slash("shuffle", { description: "Shuffle up tracks" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], music.prototype, "shuffle", null);
__decorate([
    Slash("pause", { description: "Pause music" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], music.prototype, "pause", null);
__decorate([
    Slash("unpause", { description: "Unpause music" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], music.prototype, "unpause", null);
__decorate([
    Slash("stop", { description: "Stop playing music" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], music.prototype, "stop", null);
music = __decorate([
    Discord()
    // Create music group
    ,
    SlashGroup({ name: "music" })
    // Assign all slashes to music group
    ,
    SlashGroup("music"),
    __metadata("design:paramtypes", [])
], music);
export { music };
//# sourceMappingURL=music.cmd.js.map