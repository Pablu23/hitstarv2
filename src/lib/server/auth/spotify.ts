import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from "$env/static/public";

export const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

export const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export const getToken = async (code: string, codeVerifier: string) => {
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: PUBLIC_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: PUBLIC_REDIRECT_URI,
      code_verifier: codeVerifier
    })
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  return response;
}

