import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { attendee, event, member, organization } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals: { db, session } }) => {
	if (!session) {
		throw redirect(302, '/');
	}

	const canManage =
		session.user.role?.split(',').some((r) => r === 'admin' || r === 'creator') ?? false;

	const events = canManage
		? await db.select().from(event).where(eq(event.organizerId, session.user.id))
		: [];
	const attendingEvents = await db
		.select({
			id: event.id,
			title: event.title,
			description: event.description,
			startTime: event.startTime,
			endTime: event.endTime,
			location: event.location,
			organizerId: event.organizerId,
			organizationId: event.organizationId
		})
		.from(attendee)
		.innerJoin(event, eq(attendee.eventId, event.id))
		.where(and(eq(attendee.userId, session.user.id), eq(attendee.cancelled, false)));
	const orgs = canManage
		? await db
				.select()
				.from(member)
				.where(eq(member.userId, session.user.id))
				.innerJoin(organization, eq(member.organizationId, organization.id))
		: null;

	return { events, attendingEvents, orgs, canManage };
};
