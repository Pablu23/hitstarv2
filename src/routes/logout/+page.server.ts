import { db } from "$lib/server/db";
import { sessionsTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "../$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get('session_id');

    if (!sessionId) {
        redirect(307, "/error")
    }

    db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))

    cookies.delete('session_id', { path: "/" });
    redirect(307, "/")
}
