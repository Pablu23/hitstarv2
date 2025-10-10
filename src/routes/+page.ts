import type { User } from '../app';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('http://hitstar.xyz/api/user/me', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status >= 200 && response.status < 300) {
    const user: User = await response.json();
    return {
      user
    };
  } else {
    console.log(await response.text());
    return {
      user: null
    }
  }
};
