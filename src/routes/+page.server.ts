import { db } from "$lib/server/db";
import { sessionsTable, usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals }) => {
    let allUsers = null;
    if (locals.user.isLoggedIn) {
        allUsers = await db.select().from(usersTable);
    }

    return {
        user: locals.user,
        users: allUsers ?? []
    }
};

export const actions = {
    logout: async ({ locals, cookies }) => {
        const sessionId = cookies.get('session_id');

        if (!sessionId) {
            redirect(307, "/error")
        }

        await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))

        cookies.delete('session_id', { path: "/" });
        locals.user.isLoggedIn = false;
        locals.user.email = null;
        locals.user.username = null;

        return { success: true };
    },
    deleteUsers: async ({ locals, fetch }) => {
        await fetch("/api/deleteUsers");

        locals.user.isLoggedIn = false;
        locals.user.email = null;
        locals.user.username = null;

        return { success: true }
    }
} satisfies Actions;