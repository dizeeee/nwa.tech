import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { attendee, event } from '$lib/db/schema';
import { getResend } from '$lib/resend';
import { generateIcsCalendar, type IcsCalendar, type IcsEvent } from 'ts-ics';

export const POST: RequestHandler = async ({ locals: { db, session }, params, platform }) => {
	const { id } = params;

	if (!platform) throw new Error('Missing platform');
	if (isNaN(parseInt(id))) return new Response('Invalid event ID', { status: 400 });

	const eventData = await db
		.select()
		.from(event)
		.where(eq(event.id, parseInt(id)))
		.get();

	if (!eventData) return new Response('Event not found', { status: 404 });
	if (!session) return new Response('Unauthorized', { status: 401 });

	const attendeeData = await db
		.select()
		.from(attendee)
		.where(and(eq(attendee.userId, session.user.id), eq(attendee.eventId, parseInt(id))))
		.get();

	if (attendeeData && !attendeeData.cancelled) {
		// cancel attendance
		await db
			.update(attendee)
			.set({ cancelled: true })
			.where(and(eq(attendee.userId, session.user.id), eq(attendee.eventId, parseInt(id))))
			.execute();
	} else if (attendeeData && attendeeData.cancelled) {
		// uncancel, prevent double invite emails
		await db
			.update(attendee)
			.set({ cancelled: false })
			.where(and(eq(attendee.userId, session.user.id), eq(attendee.eventId, parseInt(id))))
			.execute();
	} else {
		// attend, only do on initial insert to guarantee a single invite email
		await db.insert(attendee).values({ userId: session.user.id, eventId: parseInt(id) });

		const startDate = eventData.startTime ? new Date(eventData.startTime) : new Date();
		const endDate = eventData.endTime
			? new Date(eventData.endTime)
			: new Date(Date.now() + 60 * 60); // Default to 1 hour later

		const icsEventData: IcsEvent = {
			uid: `event-${id}-${Date.now()}@nwa.tech`,
			stamp: { date: new Date() },
			summary: eventData.title,
			description: eventData.description,
			start: { date: startDate },
			end: { date: endDate },
			location: eventData.location || undefined,
			url: `https://nwa.tech/event/${id}`,
			organizer: {
				name: 'NWA Tech',
				email: 'noreply@nwa.tech'
			}
		};

		const icsCalendarData: IcsCalendar = {
			events: [icsEventData],
			prodId: 'NWA Tech Events',
			version: '2.0'
		};

		const icsContent = generateIcsCalendar(icsCalendarData);
		const resend = getResend(platform.env.RESEND_API_KEY);

		await resend.emails.send({
			from: 'nwa.tech <noreply@nwa.tech>',
			to: [session.user.email],
			subject: `You're attending ${eventData.title}!`,
			html: `<p>You're all set! You're attending ${eventData.title}.</p>
            <p>You can view the details <a href="https://nwa.tech/event/${id}">here</a>.</p>
            <p>A calendar invite has been attached to help you keep track of the event.</p>`,
			attachments: [
				{
					filename: `${eventData.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`,
					content: btoa(icsContent),
					contentType: 'text/calendar'
				}
			]
		});
	}

	return new Response(attendeeData && !attendeeData.cancelled ? 'Unattend' : 'Attend', {
		status: 200
	});
};
