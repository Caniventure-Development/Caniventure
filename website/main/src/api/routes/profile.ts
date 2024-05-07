// Types
import type { Response } from "express";

// External Packages
import { Router } from "express";

// Middleware and external file imports
import { ensureAuthorized } from "../middleware/ensureAuthorized";
import { ensureNotBlacklisted } from "../middleware/ensureNotBlacklisted";
import Users, { type UserObject } from "../../models/users";
import { getUserFromDiscord } from "../utils";

const router = Router();

function dataIsValid(data: any): data is UserObject {
    return typeof data.colors === "object";
}

function renderProfileView(
    user: any,
    userDbData: any,
    discordUser: any,
    res: Response,
) {
    res.status(200).render("profile/view", {
        user: user,
        userDbData: userDbData,
        discordUser: discordUser,
    });
}

router.get("/", ensureAuthorized, (_, res) => {
    res.redirect("/profile/me");
});

router.get("/me", ensureAuthorized, (req, res) => {
    const user = req.user as any;
    console.log(user);
    renderProfileView(user, user!.dataFromDB, user, res);
});

router.get("/:id", async (req, res) => {
    const targetUserId = req.params.id;

    if (isNaN(parseInt(targetUserId))) {
        return;
    }

    const discordReq = await getUserFromDiscord(targetUserId);

    if (discordReq.status !== 200) {
        return res.status(404).send("User not found on Discord");
    }

    const discordUser = discordReq.data;
    const userFromDB = await Users.findOne({ id: targetUserId });

    if (!userFromDB) {
        return res.status(404).send("User not found in Caniventure database");
    }

    renderProfileView(req.user, userFromDB, discordUser, res);
});

router.get("/edit", ensureAuthorized, ensureNotBlacklisted, (req, res) => {
    return res
        .status(200)
        .send("This part of the site is not ready yet! Stay tuned for Alpha!");

    const user = req.user as any;
    res.status(200).render("profile/edit", {
        user: req.user,
        userDbData: user!.dataFromDB,
        discordUser: user,
    });
});

router.post("/edit", (req, res) => {
    return res.status(200).json({
        message:
            "This part of the site is not ready yet! Stay tuned for Alpha!",
    });

    const accessToken = req.headers.authorization;
    const user = req.user as any;

    if (!accessToken) {
        return res.status(400).json({
            status: 400,
            error: "No Access Token provided.",
        });
    }

    if (accessToken !== user.accessToken) {
        return res.status(403).json({
            status: 403,
            error: "Invalid Access Token provided.",
        });
    }

    const data = JSON.parse(req.body);
    if (!data) {
        return res.status(400).json({
            status: 400,
            error: "No data provided.",
        });
    }

    if (!dataIsValid(data)) {
        return res.status(400).json({
            status: 400,
            error: "Invalid data provided.",
        });
    }

    // TODO: Update user.

    return res.status(200).json({ status: 200, message: "OK" });
});

export default router;
