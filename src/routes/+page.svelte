<script lang="ts">
	import { Clock, MapPin } from '@lucide/svelte';

	const { data } = $props();
</script>

{#each data.events as event}
	<a href="/event/{event.id}">
		<div class="flex flex-col gap-2 rounded-md border border-neutral-300 px-4 py-2">
			<h2 class="text-2xl font-bold">{event.title}</h2>
			<div class="flex items-center gap-2">
				<Clock size={18} />
				{#if event.startTime}
					<p>{new Date(event.startTime).toLocaleString()}</p>
				{:else}
					<p>TBD</p>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<MapPin size={18} />
				<p>{event.location}</p>
			</div>
		</div>
	</a>
{:else}
	<div>No events</div>
{/each}
