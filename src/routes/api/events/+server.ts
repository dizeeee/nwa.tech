import { json, type RequestHandler } from '@sveltejs/kit';
import { event } from '$lib/db/schema';
import { and, desc, gte, isNull, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, url }) => {
	const limit = Number(url.searchParams.get('limit') ?? 10);
	const offset = Number(url.searchParams.get('offset') ?? 0);

	const now = Date.now();

	const events = await locals.db
		.select()
		.from(event)
		.where(
			or(
				and(isNull(event.endTime), or(isNull(event.startTime), gte(event.startTime, now))),
				gte(event.endTime, now)
			)
		)
		.orderBy(desc(event.startTime))
		.limit(limit)
		.offset(offset);

	return json({ events, nextOffset: offset + events.length, hasMore: events.length === limit });
};
