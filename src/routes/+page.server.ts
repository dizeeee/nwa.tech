import { event } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const events = await locals.db.select().from(event).orderBy(desc(event.startTime));
	return { events };
};
