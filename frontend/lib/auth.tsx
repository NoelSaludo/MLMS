import { getUser } from "@/services/login_services";

export async function login(formData: FormData) {
    const email = formData.get("schoolEmail") as string;
    const password = formData.get("password") as string;

    const bcrypt = require("bcrypt");

    const user = await getUser(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    return user;
};