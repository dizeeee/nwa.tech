import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const session = await locals.auth.api.getSession({
		headers: request.headers
	});

	const orgs = session
		? await locals.auth.api.listOrganizations({
				headers: request.headers
			})
		: null;

	return {
		session,
		orgs
	};
};
