import { Router } from "express";
import { ObjectId } from "mongodb";
import user from "../services/user.js";

const router = Router();


router.post("/register", async (req, res) => {
    try {
        let { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            throw new Error("Mandatory fields missing.");
        }

        let result = await user.userRegistration({ email, password, firstName, lastName });
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Mandatory fields missing.");
        }

        let result = await user.userLogin({ email, password });
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

export default router;