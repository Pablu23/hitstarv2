import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { lobbysTable } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
    const id = Number(params.id);

    const lobby = await db.query.lobbysTable.findFirst({
        with: {
            usersInLobby: {
                with: {
                    user: true
                }
            }
        },
        where: eq(lobbysTable.id, id)
    })

    if (!lobby) {
        redirect(307, "/error");
    }

    return {
        lobby: lobby,
        username: locals.user.username
    }
};