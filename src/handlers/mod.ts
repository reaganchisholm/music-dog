import { Collection } from "../../deps.ts";

type Handler<T> = T & { [key: string]: unknown };
export const handlers : Handler = new Collection<string, Handler>();

export function createHandler(handler: Handler) {
  handlers.set(handler.name, handler);
}