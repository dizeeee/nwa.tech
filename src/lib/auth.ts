import { betterAuth } from 'better-auth';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { BETTER_AUTH_SECRET, DATABASE_URL } from '$env/static/private';
import { admin, organization } from 'better-auth/plugins';
import * as schema from './db/schema';
import { admin as adminRole, creator, user } from './roles';
import { resend } from './resend';
// import { sveltekitCookies } from 'better-auth/svelte-kit';
// import { getRequestEvent } from '$app/server';

// This is used *exclusively* for schema generation, it should never be used at runtime
export const auth = getAuth();

export function getAuth(db?: D1Database, baseUrl?: string) {
	const drizzle = db ? drizzleD1(db) : drizzleLibsql(`file:${DATABASE_URL}`);

	return betterAuth({
		baseUrl,
		database: drizzleAdapter(drizzle, {
			provider: 'sqlite',
			schema: { ...schema }
		}),
		emailAndPassword: {
			enabled: true
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await resend.emails.send({
					from: 'nwa.tech <noreply@resend.dev>',
					to: [user.email],
					subject: 'nwa.tech - verify your email',
					html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
				});
			},
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			expiresIn: 3600 // 1 hour
		},
		plugins: [
			admin({
				roles: {
					user,
					creator,
					admin: adminRole
				}
			}),
			organization({
				allowUserToCreateOrganization: async (user) => {
					return (user as unknown as { role: string }).role === 'admin';
				}
			})
			// TODO: see if this type error is a version issue
			// sveltekitCookies(getRequestEvent)
		],
		secret: BETTER_AUTH_SECRET
	});
}
