import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get('session_id');

    if (!sessionId) {
        redirect(307, "/error")
    }

    cookies.delete('session_id', { path: "/", secure: false });
    redirect(307, "/")
}
