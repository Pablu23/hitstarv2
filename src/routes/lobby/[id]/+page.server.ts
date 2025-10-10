import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User } from '../../../app';
import type { Settings } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch, locals: { user } }) => {
  if (!user) {
    redirect(307, '/');
  }

  const response = await fetch(`http://hitstar.xyz/api/lobby/${params.id}`, {
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
  console.log('Successful request for lobby');
  console.log(id);

  return {
    user: user,
    lobby: {
      id,
      host,
      players,
      gameSettings
    }
  };
};
