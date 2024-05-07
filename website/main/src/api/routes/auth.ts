import { Router } from "express";
import passport from "passport";
import { ensureAuthorized } from "../middleware/ensureAuthorized";

const router = Router();

router.get("/", (_, res) => {
    res.redirect("/auth/discord");
});

router.get(
    "/discord",
    passport.authenticate("discord", {
        failureRedirect: "/",
    }),
);

router.get(
    "/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/",
        successRedirect: "/",
    }),
);

router.get("/logout", ensureAuthorized, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).render("error", { error: err });
        }

        res.redirect("/");
    });
});

router.get("/discordBot/callback", (req, res) => {
    const guildId = req.query.guild_id;

    if (!guildId) {
        // Failed to authorize bot, render error page.
        return res.status(500).render("error", {
            error: "Bot authorization failed, this could be due to you cancelling the authorization or something went wrong on Discord's end while adding the bot.",
        });
    }

    // Successfully authorized the bot, let's redirect to the getting starting page.
    res.redirect("/getting-started?guild_id=" + guildId.toString());
});

// Export our router so that it can be used in our main app
export default router;
