import { user } from '$lib/db/authSchema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	grantCreator: async ({ request, locals: { auth, db } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email) {
			return fail(400);
		}

		const userData = await db
			.select({
				id: user.id,
				role: user.role
			})
			.from(user)
			.where(eq(user.email, email))
			.get();

		if (!userData) {
			return fail(400);
		}

		if (userData.role?.split(',').includes('creator')) {
			return {
				success: true,
				modified: false
			};
		}

		await auth.api.setRole({
			headers: request.headers,
			body: {
				userId: userData.id,
				role: [
					'creator',
					...((userData.role?.split(',') || []) as ('user' | 'admin' | 'creator')[])
				]
			}
		});

		return { success: true, modified: true };
	}
};
