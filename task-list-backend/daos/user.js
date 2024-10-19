import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    { timestamps: true,versionKey: false }
);

const user = mongoose.model("user", userSchema);

export default user;