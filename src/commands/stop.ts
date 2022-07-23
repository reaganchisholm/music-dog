import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { validateInteraction } from "../helpers/validateInteraction.js";

@Discord()
class Stop {
    @Slash("stop", {
        description: "Stop playing music"
    })
    stop(interaction: CommandInteraction): void {
        const validate = validateInteraction(interaction);

        if (!validate) {
            return;
        }

        const { queue } = validate;

        queue.leave();
        interaction.reply("> Stopped playing music");
    }
}