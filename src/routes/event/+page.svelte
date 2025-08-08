<script lang="ts">
	const { data } = $props();

	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

	let fileError = $state('');

	function onFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			fileError = '';
			return;
		}
		if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
			fileError = 'Only JPG, PNG, WEBP, and GIF files are allowed.';
			input.value = '';
			return;
		}

		fileError = '';
	}
</script>

<form
	action="?/createEvent"
	method="POST"
	enctype="multipart/form-data"
	class="flex flex-col gap-2"
>
	<h1 class="text-2xl font-bold">Create Event</h1>
	<label for="title">Title</label>
	<input
		id="title"
		type="text"
		name="title"
		placeholder="Title"
		class="rounded-md border border-gray-300 p-2"
	/>
	<div class="flex flex-col">
		<label for="organizationId">Organization (optional)</label>
		<select id="organizationId" name="organizationId" class="rounded-md border border-gray-300 p-2">
			<option value="">-- None --</option>
			{#if data.orgs}
				{#each data.orgs as org}
					<option value={org.id}>{org.name}</option>
				{/each}
			{/if}
		</select>
	</div>
	<label for="description">Description</label>
	<textarea
		id="description"
		name="description"
		placeholder="Description (supports markdown)"
		class="h-40 rounded-md border border-gray-300 p-2"
	></textarea>
	<div class="flex items-center gap-2">
		<div class="flex grow flex-col">
			<label for="startTime">Start Time</label>
			<input
				id="startTime"
				type="datetime-local"
				name="startTime"
				class="rounded-md border border-gray-300 p-2"
			/>
		</div>
		<div class="flex grow flex-col">
			<label for="endTime">End Time</label>
			<input
				id="endTime"
				type="datetime-local"
				name="endTime"
				class="rounded-md border border-gray-300 p-2"
			/>
		</div>
	</div>
	<label for="location">Location</label>
	<input
		id="location"
		type="text"
		name="location"
		placeholder="Location"
		class="rounded-md border border-gray-300 p-2"
	/>
	<label for="image">Banner Image (16:9 recommended)</label>
	<input
		id="image"
		type="file"
		name="image"
		accept="image/jpeg,image/png,image/webp,image/gif"
		title="Accepted types: JPG, PNG, WEBP, GIF"
		class="rounded-md border border-gray-300 p-2 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
		onchange={onFileChange}
	/>
	{#if fileError}
		<p class="text-sm text-red-600">{fileError}</p>
	{:else}
		<p class="text-sm text-gray-500">Accepted types: JPG, PNG, WEBP, GIF</p>
	{/if}
	<button
		type="submit"
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
	>
		Create
	</button>
</form>
