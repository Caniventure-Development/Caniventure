import { NextFunction, Request, Response } from "express";

export function ensureAuthorized(
    req: Request,
    res: Response,
    next: NextFunction,
    throwIfUnauthorized: boolean = false,
) {
    if (req.user) {
        next();
        return true;
    } else {
        if (throwIfUnauthorized) {
            // We gotta render this.
            res.status(401).render("unauthorized");
            return false;
        } else {
            // Don't throw, just ask the user to log in.
            res.redirect("/auth/discord");
            return false;
        }
    }
}
