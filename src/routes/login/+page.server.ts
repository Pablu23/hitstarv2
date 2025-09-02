import { env } from "$env/dynamic/public";
import { redirect } from "@sveltejs/kit";
import { generateRandomString, sha256, base64encode } from '$lib/server/auth/spotify';
import type { PageServerLoad } from "../$types";
import { db } from "$lib/server/db";
import { states } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const verifier = generateRandomString(64);
    const state = generateRandomString(64);

    const s: typeof states.$inferInsert = {
        id: state,
        codeVerifier: verifier
    };

    await db.insert(states).values(s);

    const hashed = await sha256(verifier);
    const codeChallenge = base64encode(hashed);

    const params = {
        response_type: 'code',
        client_id: env.PUBLIC_CLIENT_ID,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: env.PUBLIC_REDIRECT_URI,
        state
    }

    authUrl.search = new URLSearchParams(params).toString();
    redirect(307, authUrl);
};