import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { event, member, organization } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals: { db, session } }) => {
	if (!session) {
		throw redirect(302, '/');
	}

	const events = await db.select().from(event).where(eq(event.organizerId, session.user.id));
	const orgs = await db
		.select()
		.from(member)
		.where(eq(member.userId, session.user.id))
		.innerJoin(organization, eq(member.organizationId, organization.id));

	return { events, orgs };
};
