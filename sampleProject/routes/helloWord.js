import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.send("Hello World");
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;