'use server'
import { getUser } from "@/services/login_services";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(initialState: any,formData: FormData) {
    const email = formData.get("school_email") as string;
    const password = formData.get("password") as string;

    const bcrypt = require("bcrypt");

    const user = await getUser(email);

    if (!user || !bcrypt.compare(password, user.password)) {
        return {
            message: "Invalid email or password",
        }
    }

    await createSession(user.user_id, email, user.role);
    
    redirect("/");
};

export async function logout() {
    await deleteSession();
    redirect("/login");
}