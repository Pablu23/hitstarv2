import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals }) => {
    const allUsers = await db.select().from(usersTable);

    return {
        user: locals.user,
        users: allUsers
    }
};