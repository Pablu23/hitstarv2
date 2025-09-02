export const getJson = async (accessToken: string, subUri: string) => {
    const baseUrl = new URL("https://api.spotify.com/");
    const requestUrl = new URL(subUri, baseUrl);

    return await fetch(requestUrl, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
}