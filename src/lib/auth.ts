import { betterAuth } from 'better-auth';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DATABASE_URL } from '$env/static/private';
import { admin, organization } from 'better-auth/plugins';
import * as schema from './db/schema';
// import { sveltekitCookies } from 'better-auth/svelte-kit';
// import { getRequestEvent } from '$app/server';

// This is used *exclusively* for schema generation, it should never be used at runtime
export const auth = getAuth();

export function getAuth(db?: D1Database) {
	const drizzle = db ? drizzleD1(db) : drizzleLibsql(`file:${DATABASE_URL}`);

	return betterAuth({
		database: drizzleAdapter(drizzle, {
			provider: 'sqlite',
			schema: { ...schema }
		}),
		emailAndPassword: {
			enabled: true
		},
		plugins: [
			admin(),
			organization({
				allowUserToCreateOrganization: async (user) => {
					return user?.role === 'admin';
				}
			})
			// TODO: see if this type error is a version issue
			// sveltekitCookies(getRequestEvent)
		]
	});
}
