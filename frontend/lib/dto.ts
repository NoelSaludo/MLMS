// NOTE: I still have no idea what DTO is
// TODO: Better check what DTO is and if this file is even necessary.
// I think it is, but I don't know what it does.
import 'server-only'
import { getUser } from "@/lib/dal";

export async function getUserData() {
    const user = await getUser();
    if (!user) {
        return null;
    }
    return user;
}