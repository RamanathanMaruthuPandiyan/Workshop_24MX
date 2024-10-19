import mongoose from "mongoose";
const taskListSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date, required: true },
        isCompleted: { type: Boolean }
    },
    { timestamps: true, versionKey: false }
);

const taskList = mongoose.model("taskList", taskListSchema);

export default taskList;