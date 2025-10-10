import { type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');
	event.locals.user = null;

	if (sessionId) {
		if (!env.PUBLIC_API_BASE) throw new Error('PUBLIC_API_BASE is not set');

		console.log(env.PUBLIC_API_BASE);

		const u = new URL('user/me', env.PUBLIC_API_BASE);

		console.log(u);

		const request = new Request(u);
		request.headers.set(
			'cookie',
			event.cookies
				.getAll()
				.filter(({ value }) => value !== '') // account for cookie that got deleted in the current request
				.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
				.join('; ')
		);

		const response = await fetch(request);
		if (response.status >= 200 && response.status < 300) {
			const uBody = await response.json();
			const user = {
				email: uBody.email,
				username: uBody.username || 'Unknown username'
			};
			event.locals.user = user;
		}
	}

	const response = await resolve(event);
	return response;
};

// export const handleFetch = (async ({ event, request, fetch }) => {
//   console.log("fetch request to " + request.url)
//
// 	if (request.url.startsWith('/api/')) {
//     console.log("rerouting");
// 		request = new Request(request.url, request);
//
// 		request.headers.set(
// 			'cookie',
// 			event.cookies
// 				.getAll()
// 				.filter(({ value }) => value !== '') // account for cookie that got deleted in the current request
// 				.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
// 				.join('; ')
// 		);
// 	}
// 	return fetch(request);
// }) satisfies HandleFetch;
