import { Router } from "express";
import { resolve } from "../controllers/resolve.controller.js";

export const resolveRouter = Router();

resolveRouter.get("/", resolve);