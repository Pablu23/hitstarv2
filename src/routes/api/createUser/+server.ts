import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const user = await request.json();
    const u: typeof usersTable.$inferInsert = {
        email: user.email,
        username: user.username
    };

    const result = await db.insert(usersTable).values(u).onConflictDoNothing().returning();

    if (result.length <= 0) {
        return new Response(null, { status: 409 });
    }

    return json(result, { status: 201 })
} 
