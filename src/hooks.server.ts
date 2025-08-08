import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { getAuth } from '$lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform) throw new Error('Missing platform');

	const auth = getAuth(
		event.platform.env.DB,
		event.url.origin,
		event.platform.env.RESEND_API_KEY,
		event.platform.env.BETTER_AUTH_SECRET
	);
	const db = drizzle(event.platform.env.DB, { schema });

	// Avoid expensive session lookup on Better Auth internal routes
	const isBetterAuthRoute = event.url.pathname.startsWith('/api/auth');
	const session = isBetterAuthRoute
		? null
		: await auth.api.getSession({
				headers: event.request.headers
			});

	event.locals = { auth, db, session };

	return await svelteKitHandler({ event, resolve, auth, building });
};
