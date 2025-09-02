export const getJson = async (accessToken: string, subUri: string) => {
    const baseUrl = new URL("https://api.spotify.com/");
    const requestUrl = new URL(subUri, baseUrl);

    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        console.log(response)
        return null
    }

    return response
}