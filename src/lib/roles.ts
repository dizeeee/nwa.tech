import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const ac = createAccessControl({
	...defaultStatements,
	project: ['creator'] as const
});

export const user = ac.newRole({
	project: []
});

export const creator = ac.newRole({
	project: ['creator']
});

export const admin = ac.newRole({
	project: ['creator'],
	...adminAc.statements
});
