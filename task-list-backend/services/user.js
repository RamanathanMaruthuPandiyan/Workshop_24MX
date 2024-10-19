import user from "../daos/user.js";
import bcrypt from "bcrypt";

async function userRegistration(userData) {
    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error("Invalid e-mail.");
        }
        let emailExist = Boolean(await user.countDocuments({ email: userData.email }));
        if (emailExist) {
            throw new Error("The email already exist.");
        }
        userData.password = await bcrypt.hash(userData.password, 10);
        let result = await user.create(userData);
        if (!result) {
            throw new Error("Error while registering user.");
        }
        return Promise.resolve("Successfully registered user.", result);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function userLogin(userData) {
    try {
        let userRec = await user.findOne({ email: userData.email });
        if (!userRec || !Object.keys(userRec).length) {
            throw new Error("The user is not found.");
        }

        let isEmailMatch = userRec.email == userData.email ? true : false;
        let isPasswordMatch = await bcrypt.compare(userData.password, userRec.password);

        if (!isEmailMatch || !isPasswordMatch) {
            throw new Error("Invalid credentials.");
        }

        return Promise.resolve("Logged In Successfully.");
    } catch (e) {
        return Promise.reject(e);
    }
}

export default {
    userRegistration,
    userLogin
};