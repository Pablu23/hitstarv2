import { db } from '$lib/server/db';
import { sessionsTable, usersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, type Handle } from '@sveltejs/kit';

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

    if (event.url.pathname.startsWith("/private") && !user.isLoggedIn) {
        redirect(307, "/error");
    } else if (event.url.pathname.startsWith("/api") && !user.isLoggedIn) {
        return new Response(null, { status: 401 });
    }

    event.locals.user = user;
    const response = await resolve(event);
    return response;
}