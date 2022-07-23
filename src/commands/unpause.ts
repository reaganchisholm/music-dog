import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { validateInteraction } from "../helpers/validateInteraction.js";

@Discord()
class Unpause {
    @Slash("unpause", { description: "Unpause music" })
    unpause(interaction: CommandInteraction): void {
        const validate = validateInteraction(interaction);

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
}