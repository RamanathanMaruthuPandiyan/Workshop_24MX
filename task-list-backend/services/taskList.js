import taskList from "../daos/taskList.js";

async function createTask(taskData) {
    try {
        taskData.isCompleted = false;
        let result = await taskList.create(taskData);
        if (!result) {
            throw new Error("Failed to create the task.");
        }
        return Promise.resolve("The task created successfully.");
    } catch (e) {
        return Promise.reject(e);
    }
}

async function get(id) {
    try {
        let result = await taskList.findOne({ _id: id });
        if (!result || !Object.keys(result).length) {
            throw new Error("Invalid id received.");
        }

        return Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function getAll() {
    try {
        let result = await taskList.find().lean();
        return Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function update(id, data) {
    try {
        let isTaskExist = Boolean(await taskList.countDocuments({ _id: id }));
        if (!isTaskExist) {
            throw new Error("Invalid id received.");
        }
        let result = await taskList.updateOne({ _id: id }, { $set: data });
        if (!result || !result.modifiedCount) {
            throw new Error("No modifications found.");
        }

        return Promise.resolve(`The task '${data.title}' updated successfully.`);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function remove(id) {
    try {
        let existingTask = await taskList.findOne({ _id: id });
        if (!existingTask || !Object.keys(existingTask).length) {
            throw new Error("Invalid id received.");
        }

        let result = await taskList.deleteOne({ _id: id });

        if (!result || !result.deletedCount) {
            throw new Error("Failed to delete the task.");
        }

        return Promise.resolve(`The task '${existingTask.title}' successfully deleted.`);
    } catch (e) {
        return Promise.reject(e);
    }
}

export default {
    createTask,
    get,
    getAll,
    update,
    remove
}