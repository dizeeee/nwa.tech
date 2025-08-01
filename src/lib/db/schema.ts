import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import * as authSchema from './authSchema';
import { relations } from 'drizzle-orm';

export const event = sqliteTable('event', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	startTime: integer('start_time'), // TBD if null
	endTime: integer('end_time'), // TBD if null
	location: text('location'),
	organizerId: text('organizer_id')
		.notNull()
		.references(() => authSchema.user.id),
	organizationId: text('organization_id').references(() => authSchema.organization.id)
});

export const eventRelations = relations(event, ({ one }) => ({
	organizer: one(authSchema.user, {
		fields: [event.organizerId],
		references: [authSchema.user.id]
	}),
	organization: one(authSchema.organization, {
		fields: [event.organizationId],
		references: [authSchema.organization.id]
	})
}));

export * from './authSchema';
