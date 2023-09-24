import Elysia from "elysia";
import { protectedRoutes } from "./(protected)/*";
import { index } from "./index";
import { login } from "./login";

export const pages = new Elysia().use(protectedRoutes).use(index).use(login);
