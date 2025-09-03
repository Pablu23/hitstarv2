// See https://svelte.dev/docs/kit/types#app.d.ts


// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				isLoggedIn: boolean;
				email: string | null;
				username: string | null;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
