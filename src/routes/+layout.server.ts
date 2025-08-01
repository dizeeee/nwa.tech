import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const session = await locals.auth.api.getSession({
		headers: request.headers
	});

	return {
		session
	};
};
