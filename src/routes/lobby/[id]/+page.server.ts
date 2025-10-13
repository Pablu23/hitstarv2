import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User, Playlist, Settings } from '../../../app';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ params, fetch, locals: { user } }) => {
	if (!user) {
		redirect(307, '/');
	}

	if (!env.PUBLIC_API_BASE) redirect(307, '/error');

	let u = new URL(`lobby/${params.id}`, env.PUBLIC_API_BASE);
	const response = await fetch(u, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (response.status != 200) {
		redirect(307, '/');
	}

	const {
		id,
		host,
		players,
		gameSettings
	}: { id: string; host: User; players: User[]; gameSettings: Settings } = await response.json();

	let playlists: Playlist[] = [];
	if (user.email === host.email) {
		u = new URL(`user/playlists`, env.PUBLIC_API_BASE);
		const res = await fetch(u);
		if (response.status != 200) {
			console.log('Could not fetch playlists from api');
			redirect(307, '/error');
		}

		playlists = await res.json();
    console.log(JSON.stringify(playlists));
	}

	return {
		user: user,
		lobby: {
			id,
			host,
			players,
			gameSettings
		},
		playlists: playlists
	};
};
