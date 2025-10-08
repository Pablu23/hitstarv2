import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, fetch}) => {
    const response = await fetch("/api/createLobby", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(locals.user)
    });

    if (!response.ok) redirect(307, "/error");

    const lobby = await response.json();

    redirect(307, `/lobby/${lobby.id}`);
};
