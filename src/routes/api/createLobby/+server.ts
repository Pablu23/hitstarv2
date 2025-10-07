import { db } from '$lib/server/db';
import { lobbysTable, usersInLobby } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';


export const POST: RequestHandler = async ({ request }) => {
    const userReq = await request.json();

    const userInLobby = (await db.$count(usersInLobby, eq(usersInLobby.userEmail, userReq.email))) > 0
    if (userInLobby) {
        const lobbys = await db.query.lobbysTable.findMany({
            with: {
                usersInLobby: true
            },
        });

        // This should be done with database queries
        const lobby = lobbys.find((l) => l.usersInLobby.find((u) => u.userEmail == userReq.email))

        return json(lobby, { status: 200 })
    }

    // const lobby = await db.transaction(async (tx) => {
    const l: typeof lobbysTable.$inferInsert = {
        hostEmail: userReq.email
    };
    const [lobby] = await db.insert(lobbysTable).values(l).onConflictDoNothing().returning();
    const uLobby: typeof usersInLobby.$inferInsert = {
        userEmail: userReq.email,
        lobbyId: lobby.id
    };
    await db.insert(usersInLobby).values(uLobby);
    // })

    if (!lobby) {
        return new Response(null, { status: 500 })
    }

    return json(lobby, { status: 201 })
} 
