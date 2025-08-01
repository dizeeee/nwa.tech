import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { getAuth } from '$lib/auth';
export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env.DB) throw new Error('DB is not set');
	const auth = getAuth(event.platform.env.DB);

	event.locals.auth = auth;

	return await svelteKitHandler({ event, resolve, auth, building });
};
