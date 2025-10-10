import { type Handle, type HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');
	event.locals.user = null;

	if (sessionId) {
		const request = new Request('http://hitstar.xyz/api/user/me');
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
