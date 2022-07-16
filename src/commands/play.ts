import { COMMAND_REGEX } from "../../configs.ts";
import { logger } from "../utils/logger.ts";
import { createCommand } from "./mod.ts";
import { handlers } from "../handlers/mod.ts";

const log = logger({ name: "Command: Play" });

createCommand({
  name: "play",
  alias: ["p"],
  usage: ["play <url>"],
  description: "Play a song!",
  execute: async (bot, rawMessage) => {
    const regexGroups = COMMAND_REGEX.exec(rawMessage.content);
    const songRequest = regexGroups ? regexGroups[2] : "";

    if(songRequest){
      console.log(handlers);
      const searchResult = await handlers.youtube.search(songRequest);
      console.log(searchResult);

      await bot.helpers.addReaction(rawMessage.channelId, rawMessage.id, '🎶');
    } else {
      log.info(`Failed to find song request in message`);
    }

    // await bot.helpers.sendInteractionResponse(
    //   interaction.id,
    //   interaction.token,
    //   {
    //     type: InteractionResponseTypes.ChannelMessageWithSource,
    //     data: {
    //       content: `🎵 Playing`,
    //     },
    //   },
    // );
  },
});