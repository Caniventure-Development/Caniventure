import type { Request, Response } from "express";
import { Router } from "express";

const router = Router();

function getGuideTemplateName(fileName: string) {
    return `guides/${fileName}`;
}

function renderGuide(req: Request, res: Response, viewFileName: string) {
    res.status(200).render(getGuideTemplateName(viewFileName), {
        user: req.user,
    });
}

router.get("/", (req, res) => {
    renderGuide(req, res, "index");
});

router.get("/predator", (req, res) => {
    renderGuide(req, res, "predator");
});

router.get("/prey", (req, res) => {
    renderGuide(req, res, "prey");
});

export default router;
