import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    try {
        const session = await getSession();

        console.log("Session:", session);

        if (!session) {
            return null;
        }

        return session.user;
    }
    catch (error) {
        console.error("Failed to get current user:", error);
        return null;
    }
}