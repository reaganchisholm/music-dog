import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { validateInteraction } from "../helpers/validateInteraction.js";

@Discord()
class Pause {
    @Slash({ 
        name: "pause",
        description: "Pause music" 
    })
    pause(interaction: CommandInteraction): void {
        const validate = validateInteraction(interaction);

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
}