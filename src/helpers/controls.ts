import { CommandInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { validateControlInteraction } from "./validateControlInteraction.js";

@Discord()
export class IncludeControls {
    @ButtonComponent("btn-next")
    async nextControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.skip();
        await interaction.deferReply();
        interaction.deleteReply();
    }

    @ButtonComponent("btn-pause")
    async pauseControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.isPause ? queue.resume() : queue.pause();
        await interaction.deferReply();
        interaction.deleteReply();
    }

    @ButtonComponent("btn-leave")
    async leaveControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.leave();
        await interaction.deferReply();
        interaction.deleteReply();
    }

    @ButtonComponent("btn-repeat")
    async repeatControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.setRepeat(!queue.repeat);
        await interaction.deferReply();
        interaction.deleteReply();
    }

    @ButtonComponent("btn-queue")
    queueControl(interaction: CommandInteraction): void {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.view(interaction);
    }

    @ButtonComponent("btn-mix")
    async mixControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.mix();
        await interaction.deferReply();
        interaction.deleteReply();
    }

    @ButtonComponent("btn-controls")
    async controlsControl(interaction: CommandInteraction): Promise<void> {
        const queue = validateControlInteraction(interaction);
        if (!queue) {
            return;
        }
        queue.updateControlMessage({ force: true });
        await interaction.deferReply();
        interaction.deleteReply();
    }
}