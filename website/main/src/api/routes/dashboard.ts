import { Router } from "express";
import { ensureAuthorized } from "../middleware/ensureAuthorized";
/*
import axios from "axios";
import { PermissionsBitField } from "discord.js";
*/

const router = Router();
const notReadyMessage = "This is not yet implemented. Stay tuned for Pre-Beta!";

router.get("/", ensureAuthorized, (req, res) => {
    res.redirect("/dashboard/guilds");
});

router.get("/guilds", ensureAuthorized, async (req, res) => {
    return res.status(200).send(notReadyMessage);
    /*
    const user = req.user as any;
    const guildsReq = await axios.get(
        "https://discord.com/api/users/@me/guilds",
        {
            headers: {
                Authorization: `Bearer ${user!.accessToken}`,
            },
        },
    );
    const guilds = guildsReq.data;
    const permissions: PermissionsBitField[] = [];

    try {
        for (const guild of guilds) {
            permissions.push(
                new PermissionsBitField(BigInt(guild.permissions)),
            );
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Failed to parse permissions, check the console!");
    }

    res.status(200).render("dashboard/guilds", {
        user: req.user,
        guilds,
        permissions,
        PermissionsBitField: PermissionsBitField,
    });
    */
});

router.get("/guilds/:id", ensureAuthorized, (req, res) => {
    res.status(200).send(notReadyMessage);
});

export default router;
