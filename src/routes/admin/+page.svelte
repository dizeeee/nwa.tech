<script lang="ts">
	import { authClient } from '$lib/authClient';

	let orgForm: {
		name: string;
		slug: string;
		res: Awaited<ReturnType<typeof authClient.organization.create>> | null;
	} = $state({
		name: '',
		slug: '',
		res: null
	});

	async function handleOrgCreation() {
		orgForm.res = await authClient.organization.create({
			name: orgForm.name,
			slug: orgForm.slug
		});
	}
</script>

<form class="flex flex-col gap-2" onsubmit={handleOrgCreation}>
	<h1>Create Organization</h1>
	<input
		type="text"
		bind:value={orgForm.name}
		placeholder="Name"
		class="rounded-md border border-gray-300 p-2"
	/>
	<input
		type="text"
		bind:value={orgForm.slug}
		placeholder="Slug"
		class="rounded-md border border-gray-300 p-2"
	/>
	<button
		type="submit"
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">Create</button
	>
	{#if orgForm.res?.error}
		<p>{orgForm.res.error.message}</p>
	{:else if orgForm.res?.data}
		<p>Organization created</p>
	{/if}
</form>

<form class="flex flex-col gap-2" action="?/grantCreator" method="POST">
	<h1>Grant creator role</h1>
	<input
		type="text"
		placeholder="Email"
		name="email"
		class="rounded-md border border-gray-300 p-2"
	/>
	<button
		type="submit"
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
	>
		Grant
	</button>
</form>
