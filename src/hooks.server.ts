import { db } from '$lib/server/db';
import { sessionsTable, usersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session_id');
    let user = {
        isLoggedIn: false,
        email: "",
        username: ""
    };

    if (sessionId) {
        const session = await db.query.sessionsTable.findFirst({
            with: {
                user: true
            },
            where: eq(sessionsTable.id, sessionId)
        });

        if (session && session.user && session.user.email) {
            user = {
                isLoggedIn: true,
                email: session.user.email,
                username: session.user.username || "Unknown username"
            };
        }
    } 

    event.locals.user = user;
    const response = await resolve(event);
    return response;
}