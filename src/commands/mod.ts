import { ApplicationCommandOption, Bot, Collection, Message } from "../../deps.ts";

export type subCommand = Omit<Command, "subcommands">;
export type subCommandGroup = {
  name: string;
  subCommands: subCommand[];
};
export interface Command {
  name: string;
  description: string;
  alias?: string[];
  usage?: string[];
  options?: ApplicationCommandOption[];
  execute: (bot: Bot, message: Message) => unknown;
  subcommands?: Array<subCommandGroup | subCommand>;
}

export const commands = new Collection<string, Command>();

export function createCommand(command: Command) {
  // Setup command 
  commands.set(command.name, command);
  // Setup alias commands
  command.alias?.forEach((alias) => commands.set(alias, command));
}