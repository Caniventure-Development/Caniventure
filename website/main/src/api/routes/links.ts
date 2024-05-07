import { Router } from "express";
import passport, { type AuthenticateOptions } from "passport";

const router = Router();

router.get(
    "/invite",
    passport.authenticate("discordBotAuth", {
        permissions: 563467497360464,
    } as AuthenticateOptions & { permissions: number }),
);

router.get("/discord", (_, res) => {
    res.redirect("https://discord.gg/HQn5cyrG3a");
});

export default router;
