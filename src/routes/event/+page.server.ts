import { fail } from '@sveltejs/kit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { Actions } from './$types';
import { event } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const actions = {
	createEvent: async ({ request, locals: { auth, db }, platform }) => {
		if (!platform) throw new Error('Missing platform');
		const { env } = platform;

		const data = await request.formData();
		const eventData = Object.fromEntries(data);

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		console.log(eventData);

		const imageField = data.get('image');
		const img = imageField instanceof File ? imageField : null;
		let objectKey = null;
		if (img) {
			// Parse endpoint and bucket from env.R2_BUCKET_URL
			const r2Url = new URL(env.R2_BUCKET_URL);
			const bucket = r2Url.pathname.replace(/^\//, '');
			const endpoint = `${r2Url.protocol}//${r2Url.host}`;

			// Determine file extension from MIME type (fallback to name extension)
			const mimeToExt: Record<string, string> = {
				'image/jpeg': 'jpg',
				'image/png': 'png',
				'image/webp': 'webp',
				'image/gif': 'gif'
			};
			const guessedExt = mimeToExt[img.type] ?? img.name.split('.').pop() ?? 'bin';
			objectKey = `${crypto.randomUUID()}.${guessedExt}`;

			// Initialize S3 client for R2
			const s3 = new S3Client({
				region: 'auto',
				endpoint,
				forcePathStyle: true,
				credentials: {
					accessKeyId: env.R2_ACCESS_KEY_ID,
					secretAccessKey: env.R2_SECRET_ACCESS_KEY
				}
			});

			const body = new Uint8Array(await img.arrayBuffer());
			await s3.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: objectKey,
					Body: body,
					ContentType: img.type || 'application/octet-stream'
				})
			);
		}

		const res = await db.insert(event).values({
			title: eventData.title as string,
			description: eventData.description as string,
			startTime: new Date(eventData.startTime as string).getTime(),
			endTime: new Date(eventData.endTime as string).getTime(),
			location: eventData.location as string,
			organizerId: session.user.id,
			organizationId: (eventData.organizationId as string) || null,
			imageUrl: objectKey ? `${env.R2_PUBLIC_BUCKET_URL}/${objectKey}` : null
		});

		console.log(res);

		return {
			success: true
		};
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals: { auth }, request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	const orgs = session ? await auth.api.listOrganizations({ headers: request.headers }) : null;
	return { orgs };
};
