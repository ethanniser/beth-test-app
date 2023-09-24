import Elysia from "elysia";
import { ticket } from "./ticket/*";

export const organization = new Elysia().use(ticket);
