import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { getAuth } from '$lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env.DB) throw new Error('DB is not set');

	const auth = getAuth(event.platform.env.DB, event.url.origin);
	const db = drizzle(event.platform.env.DB, { schema });
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	console.log(event.platform);

	event.locals = { auth, db, session };

	return await svelteKitHandler({ event, resolve, auth, building });
};
