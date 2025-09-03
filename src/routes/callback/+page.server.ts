import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { eq } from 'drizzle-orm';
import { db } from "$lib/server/db";
import { sessionsTable, states, usersTable } from "$lib/server/db/schema";
import { generateRandomString, getToken } from "$lib/server/auth/spotify";
import { getCurrentUserProfile } from "$lib/server/spotify/users";
import { env } from "$env/dynamic/public"

export const load: PageServerLoad = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state')

    if (!state || !code) {
        redirect(307, "/error")
    }

    const s = await db.select().from(states).where(eq(states.id, state)).limit(1);

    if (s.length <= 0 || !s[0].codeVerifier) {
        redirect(307, "/error")
    }
    const token = await getToken(code, s[0].codeVerifier)

    // TODO: Check if deletion was fulfilled
    await db.delete(states).where(eq(states.id, state));

    const userResponse = await getCurrentUserProfile(token.access_token)

    const isUser: boolean = (await db.$count(usersTable, eq(usersTable.email, userResponse.email))) === 1

    if (!isUser) {
        const user: typeof usersTable.$inferInsert = {
            email: userResponse.email,
            username: userResponse.display_name
        }

        await db.insert(usersTable).values(user);
    }

    const session: typeof sessionsTable.$inferInsert = {
        id: generateRandomString(64),
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        userEmail: userResponse.email,
        // TODO: Session Timeouts MUST
    }

    const sessionResponse = await db.insert(sessionsTable).values(session);

    cookies.set("session_id", session.id, { path: "/", secure: /^true$/i.test(env.PUBLIC_SECURE ?? "true") });

    redirect(307, "/")
};