import { Discord, On } from "discordx";
import { player } from "../player.js";

@Discord()
class VoiceStateUpdate {
    @On("voiceStateUpdate")
    voiceUpdate([oldState, newState]: any): void {
        const queue = player.getQueue(oldState.guild);

        if (
            !queue.isReady ||
            !queue.voiceChannelId ||
            (oldState.channelId != queue.voiceChannelId &&
                newState.channelId != queue.voiceChannelId) ||
            !queue.channel
        ) {
            return;
        }

        const channel =
            oldState.channelId === queue.voiceChannelId
                ? oldState.channel
                : newState.channel;

        if (!channel) {
            return;
        }

        const totalMembers = channel.members.filter((m) => !m.user.bot);

        if (queue.isPlaying && !totalMembers.size) {
            queue.pause();
            queue.channel.send(
                "> Dogs can't DJ alone. Please join the voice channel to continue."
            );

            if (queue.timeoutTimer) {
                clearTimeout(queue.timeoutTimer);
            }

            queue.timeoutTimer = setTimeout(() => {
                queue.channel?.send("> I've been DJ'ing alone for 5 minutes. I'm leaving.");
                queue.leave();
            }, 5 * 60 * 1000);

        } else if (queue.isPause && totalMembers.size) {

            if (queue.timeoutTimer) {
                clearTimeout(queue.timeoutTimer);
                queue.timeoutTimer = undefined;
            }

            queue.resume();
            queue.channel.send(
                "> Welcome to the doggie DJ zone, enjoy."
            );
        }
    }
}