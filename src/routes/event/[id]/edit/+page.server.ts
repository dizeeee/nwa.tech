import type { Actions, PageServerLoad } from './$types';
import { event } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { db, session } }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) throw redirect(302, '/');
	if (!session) throw redirect(302, '/');

	const eventData = await db.select().from(event).where(eq(event.id, id)).get();
	if (!eventData) throw redirect(302, '/');
	if (eventData.organizerId !== session.user.id) throw redirect(302, `/event/${id}`);

	return { event: eventData };
};

export const actions: Actions = {
	save: async ({ request, params, locals: { db, session } }) => {
		const id = Number(params.id);
		if (!session) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const values = Object.fromEntries(data);

		await db
			.update(event)
			.set({
				title: values.title as string,
				description: values.description as string,
				startTime: values.startTime ? new Date(values.startTime as string).getTime() : null,
				endTime: values.endTime ? new Date(values.endTime as string).getTime() : null,
				location: values.location as string
			})
			.where(eq(event.id, id));

		return { success: true };
	}
};
