import { betterAuth } from 'better-auth';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, organization } from 'better-auth/plugins';
import * as schema from './db/schema';
import { admin as adminRole, creator, user } from './roles';
import { getResend } from './resend';
// import { sveltekitCookies } from 'better-auth/svelte-kit';
// import { getRequestEvent } from '$app/server';

// This is used *exclusively* for schema generation, it should never be used at runtime
export const auth = getAuth();

export function getAuth(db?: D1Database, baseUrl?: string, resendToken?: string, secret?: string) {
	const drizzle = db ? drizzleD1(db) : drizzleLibsql('libsql://db.sqlite');
	const resend = resendToken ? getResend(resendToken) : null;

	return betterAuth({
		baseUrl,
		database: drizzleAdapter(drizzle, {
			provider: 'sqlite',
			schema: { ...schema }
		}),
		emailAndPassword: {
			enabled: true
		},
		...(resend && {
			emailVerification: {
				sendVerificationEmail: async ({ user, url }) => {
					await resend.emails.send({
						from: 'nwa.tech <noreply@nwa.tech>',
						to: [user.email],
						subject: 'nwa.tech - verify your email',
						html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
					});
				},
				sendOnSignUp: true,
				autoSignInAfterVerification: true,
				expiresIn: 3600 // 1 hour
			}
		}),
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
		rateLimit: {
			enabled: true,
			storage: 'database'
		},
		secret: secret ?? '' // TODO: Find a way to make this less hacky
	});
}
