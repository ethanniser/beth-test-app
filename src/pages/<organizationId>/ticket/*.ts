import Elysia from "elysia";
import { id } from "./<id>";
import { slashNew } from "./new";

export const ticket = new Elysia().use(id).use(slashNew);
