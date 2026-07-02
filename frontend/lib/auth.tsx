'use server'
import { getUser } from "@/services/login_services";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(initialState: any,formData: FormData) {
    const email = formData.get("schoolEmail") as string;
    const password = formData.get("password") as string;

    const bcrypt = require("bcrypt");

    const user = await getUser(email);

    if (!user || !bcrypt.compare(password, user.Password)) {
        return {
            message: "Invalid email or password",
        }
    }

    await createSession(email, user.Role);
    
    redirect("/");
};