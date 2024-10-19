import { Router } from "express";
import { ObjectId } from "mongodb";
import taskList from "../services/taskList.js";

const booleanSet = new Set([true, false])

const router = Router();

router.post("/", async (req, res) => {
    try {
        let { title, description, deadline } = req.body;

        if (!title || !description || !deadline) {
            throw new Error("Mandatory fields missing.");
        }

        let result = await taskList.createTask({ title, description, deadline });
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        if (!id) {
            throw new Error("Mandatory field missing.");
        }

        let result = await taskList.get(new ObjectId(id));
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

router.get("/get/all", async (req, res) => {
    try {
        let result = await taskList.getAll();
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let { title, description, deadline, isCompleted } = req.body;

        if (!id || !title || !description || !deadline || !booleanSet.has(isCompleted)) {
            throw new Error("Mandatory fields missing.");
        }

        let result = await taskList.update(new ObjectId(id), { title, description, deadline, isCompleted });

        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;

        if (!id) {
            throw new Error("Mandatory field missing.");
        }

        let result = await taskList.remove(new ObjectId(id));
        res.send(result);
    } catch (e) {
        res.status(500).send({ name: e.name, message: e.message });
    }
})

export default router;