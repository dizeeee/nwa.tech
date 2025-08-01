import { event } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { db } }) => {
	const { id } = params;

	if (isNaN(parseInt(id))) throw redirect(302, '/');

	const eventData = await db
		.select()
		.from(event)
		.where(eq(event.id, parseInt(id)))
		.get();

	if (!eventData) throw redirect(302, '/');

	return { event: eventData };
};
