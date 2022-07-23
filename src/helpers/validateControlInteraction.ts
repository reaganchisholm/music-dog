import { CommandInteraction, GuildMember } from "discord.js";
import { player, MyQueue } from "../player.js";

export function validateControlInteraction(
    interaction: CommandInteraction
  ): MyQueue | undefined {
    if (
      !interaction.guild ||
      !interaction.channel ||
      !(interaction.member instanceof GuildMember)
    ) {
      interaction.reply(
        "> Your request could not be processed, please try again later"
      );
      return;
    }

    const queue = player.getQueue(interaction.guild, interaction.channel);

    if (interaction.member.voice.channelId !== queue.voiceChannelId) {
      interaction.reply(
        "> To use the controls, you need to join the bot voice channel"
      );

      setTimeout(() => interaction.deleteReply(), 15e3);
      return;
    }

    return queue;
  }