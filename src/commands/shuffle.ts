import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { validateInteraction } from "./../helpers/validateInteraction.js";

@Discord()
class Shuffle {
    @Slash({ 
        name: "shuffle",
        description: "Shuffle the current music queue" 
    })
    shuffle(interaction: CommandInteraction): void {
        const validate = validateInteraction(interaction);

        if (!validate) {
            return;
        }

        const { queue } = validate;

        queue.mix();
        interaction.reply("> Shuffled the current music queue");
    }
}

