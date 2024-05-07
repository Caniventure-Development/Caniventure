import type { NextFunction, Request, Response } from "express";
import { ensureAuthorized } from "./ensureAuthorized";

export function ensureNotBlacklisted(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (!ensureAuthorized(req, res, next)) {
        return;
    }

    const user = req.user as any;
    if (user.dataFromDB.blacklisted) {
        res.status(403).render("unauthorized");
    } else {
        next();
    }
}
