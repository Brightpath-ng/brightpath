import express, { Router } from "express";
import { handleClerkWebhook } from "./controller.js";

export const authRouter: Router = Router();

// express.raw() here, not the app-wide express.json() -- svix signature
// verification needs the exact raw bytes Clerk signed.
authRouter.post("/webhooks/clerk", express.raw({ type: "application/json" }), handleClerkWebhook);
