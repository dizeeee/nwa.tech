import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { event } from '$lib/db/schema';

export const actions = {
	createEvent: async ({ request, locals: { auth, db } }) => {
		const data = await request.formData();

		const eventData = Object.fromEntries(data);

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		console.log(eventData);

		const res = await db.insert(event).values({
			title: eventData.title as string,
			description: eventData.description as string,
			startTime: new Date(eventData.startTime as string).getTime(),
			endTime: new Date(eventData.endTime as string).getTime(),
			location: eventData.location as string,
			organizerId: session.user.id
		});

		console.log(res);

		return {
			success: true
		};
	}
} satisfies Actions;
