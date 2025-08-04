<script lang="ts">
</script>

<form action="?/createEvent" method="POST" class="flex flex-col gap-2">
	<h1 class="text-2xl font-bold">Create Event</h1>
	<input
		type="text"
		name="title"
		placeholder="Title"
		class="rounded-md border border-gray-300 p-2"
	/>
	<textarea
		name="description"
		placeholder="Description (supports markdown)"
		class="h-40 rounded-md border border-gray-300 p-2"
	></textarea>
	<div class="flex items-center gap-2">
		<div class="flex grow flex-col">
			<label for="startTime">Start Time</label>
			<input type="datetime-local" name="startTime" class="rounded-md border border-gray-300 p-2" />
		</div>
		<div class="flex grow flex-col">
			<label for="endTime">End Time</label>
			<input type="datetime-local" name="endTime" class="rounded-md border border-gray-300 p-2" />
		</div>
	</div>
	<input
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
