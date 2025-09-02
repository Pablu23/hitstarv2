import { redirect } from "@sveltejs/kit";
import { getJson } from "./base"

export const getCurrentUserProfile = async (accessToken: string) => {
    const response = await getJson(accessToken, "/v1/me");
    if (!response) {
        redirect(307, "/error")
    }

    return await response.json()
}