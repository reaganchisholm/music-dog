import { events } from "./mod.ts";
import { logger } from "../utils/logger.ts";
import { BOT_PREFIX } from "../../configs.ts";
import { Command, commands } from "../commands/mod.ts";
import { bgYellow, black, white } from "../../deps.ts";

const log = logger({ name: "Event: MessageCreate" });

events.messageCreate = (rawBot, message) => {
    // If the message doesn't start with our prefix, or is a message from our bot, ignore it
    if (!message.content.startsWith(BOT_PREFIX) || message.isBot) return;

    // Clean up our message to get command with args
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
	const rawCommand : undefined | string = args ? args.shift()?.toLowerCase() : undefined;
    const command : Command | undefined = rawCommand ? commands.get(rawCommand) : undefined;

    if (command !== undefined) {
        // Found command, execute it
        command.execute(rawBot, message);
    } else {
        // No command found with bot, do nothing
        log.info(`[Command: ${bgYellow(black(String(rawCommand)))} - ${black(white(`Not Found`))}`);
    }
};