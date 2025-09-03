import { db } from "$lib/server/db"
import { sessionsTable, usersTable } from "$lib/server/db/schema"

export async function POST() {
    await db.delete(sessionsTable);
    await db.delete(usersTable);

    return new Response();
}