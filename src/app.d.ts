// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { getAuth } from './lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './lib/db/schema';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			auth: ReturnType<typeof getAuth>;
			db: ReturnType<typeof drizzle<typeof schema>>;
			session: Awaited<ReturnType<ReturnType<typeof getAuth>['api']['getSession']>>;
		}
	}
}

export {};
