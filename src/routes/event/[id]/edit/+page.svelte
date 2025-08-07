<script lang="ts">
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
</script>

<form method="POST" action="?/save" class="flex flex-col gap-2">
	<h1 class="text-2xl font-bold">Edit Event</h1>
	<label for="title">Title</label>
	<input
		id="title"
		type="text"
		name="title"
		class="rounded-md border border-gray-300 p-2"
		placeholder="Event title"
		value={data.event.title}
	/>
	<label for="description">Description</label>
	<textarea
		id="description"
		name="description"
		class="h-40 rounded-md border border-gray-300 p-2"
		placeholder="Description (supports markdown)">{data.event.description}</textarea
	>
	<div class="flex items-center gap-2">
		<div class="flex grow flex-col">
			<label for="startTime">Start Time</label>
			<input
				name="startTime"
				type="datetime-local"
				class="rounded-md border border-gray-300 p-2"
				placeholder="Start date and time"
				value={data.event.startTime
					? new Date(data.event.startTime).toISOString().slice(0, 16)
					: ''}
			/>
		</div>
		<div class="flex grow flex-col">
			<label for="endTime">End Time</label>
			<input
				name="endTime"
				type="datetime-local"
				class="rounded-md border border-gray-300 p-2"
				placeholder="End date and time"
				value={data.event.endTime ? new Date(data.event.endTime).toISOString().slice(0, 16) : ''}
			/>
		</div>
	</div>
	<label for="location">Location</label>
	<input
		id="location"
		type="text"
		name="location"
		class="rounded-md border border-gray-300 p-2"
		placeholder="Location (address or venue)"
		value={data.event.location}
	/>
	<div class="flex gap-2">
		<a
			class="cursor-pointer rounded-md border border-neutral-300 px-4 py-2 text-neutral-800 transition-colors hover:bg-neutral-100"
			href={`/event/${data.event.id}`}>Cancel</a
		>
		<button
			type="submit"
			class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
		>
			Save
		</button>
	</div>
	<p class="text-sm text-neutral-600">Only the creator can edit.</p>
	<p class="text-sm text-neutral-600">Support for org selection coming later.</p>
</form>
