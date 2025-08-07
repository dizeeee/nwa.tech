<script lang="ts">
	const { data } = $props();
</script>

<form action="?/createEvent" method="POST" class="flex flex-col gap-2">
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
	<button
		type="submit"
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
	>
		Create
	</button>
</form>
