import { getJson } from "./base"

export const getCurrentUserProfile = async (accessToken: string) => {
    return await (await getJson(accessToken, "/v1/me")).json()
}