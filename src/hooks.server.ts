// import { redirect, type Handle } from '@sveltejs/kit';
//
// export const handle: Handle = async ({ event, resolve }) => {
//   const sessionId = event.cookies.get('session_id');
//   let user = {
//     isLoggedIn: false,
//     email: '',
//     username: ''
//   };
//
//   if (sessionId) {
//     const response = await fetch('http://hitstar.xyz/api/user/me', {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });
//     console.log(response.status);
//     console.log(await response.text());
//
//     if (response.status >= 200 && response.status < 300) {
//       const uBody = await response.json();
//       user = {
//         isLoggedIn: true,
//         email: uBody.email,
//         username: uBody.display_name || 'Unknown username'
//       };
//     }
//   }
//
//   if (event.url.pathname.startsWith('/private') && !user.isLoggedIn) {
//     redirect(307, '/error');
//   } else if (event.url.pathname.startsWith('/api') && !user.isLoggedIn) {
//     return new Response(null, { status: 401 });
//   }
//
//   event.locals.user = user;
//   const response = await resolve(event);
//   return response;
// };

// export const handleFetch: HandleFetch = async({request, fetch}) => {
//   if (request.url
// }
