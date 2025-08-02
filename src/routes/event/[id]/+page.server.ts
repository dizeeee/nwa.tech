import { attendee, event } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { db, session } }) => {
	const { id } = params;

	if (isNaN(parseInt(id))) throw redirect(302, '/');

	const eventData = await db
		.select()
		.from(event)
		.where(eq(event.id, parseInt(id)))
		.get();

	if (!eventData) throw redirect(302, '/');

	const isAttending =
		session &&
		!!(await db
			.select()
			.from(attendee)
			.where(and(eq(attendee.userId, session.user.id), eq(attendee.eventId, parseInt(id))))
			.get());

	return { event: eventData, isAttending };
};
