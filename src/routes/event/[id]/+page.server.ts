import { attendee, event } from '$lib/db/schema';
import { and, count, eq } from 'drizzle-orm';
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

	let isAttending = false;
	if (session) {
		const attendeeData = await db
			.select()
			.from(attendee)
			.where(and(eq(attendee.userId, session.user.id), eq(attendee.eventId, parseInt(id))))
			.get();

		isAttending = !!(attendeeData && !attendeeData.cancelled);
	}

	const emailVerified = session?.user.emailVerified ?? false;

	const attendeeAggregate = await db
		.select({ count: count() })
		.from(attendee)
		.where(and(eq(attendee.eventId, parseInt(id)), eq(attendee.cancelled, false)))
		.get();

	const attendeeCount = attendeeAggregate?.count ?? 0;

	return { event: eventData, isAttending, emailVerified, attendeeCount };
};
