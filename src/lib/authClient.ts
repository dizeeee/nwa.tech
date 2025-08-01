import { createAuthClient } from 'better-auth/svelte';
import { adminClient, organizationClient } from 'better-auth/client/plugins';
import { admin as adminRole, creator, user } from './roles';

export const authClient = createAuthClient({
	plugins: [
		adminClient({
			roles: {
				user,
				creator,
				admin: adminRole
			}
		}),
		organizationClient()
	]
});
