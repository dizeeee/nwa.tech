<script lang="ts">
	import { Clock, MapPin } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Markdown from '$lib/Markdown.svelte';

	const { data }: PageProps = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="text-3xl font-bold">{data.event.title}</h1>
	<button
		class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		onclick={async () => {
			const response = await fetch(`/event/${data.event.id}/attend`, {
				method: 'POST'
			});
			console.log(await response.text());
		}}
	>
		Attend
	</button>
</div>

<div class="flex items-center gap-4">
	<div class="flex items-center gap-2">
		<Clock class="size-4 text-neutral-700" />
		<p class="text-sm text-neutral-700">
			{#if data.event.startTime}
				{new Date(data.event.startTime).toLocaleDateString('en-US', {
					year:
						new Date().getFullYear() === new Date(data.event.startTime).getFullYear()
							? undefined
							: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
			{:else}
				TBD
			{/if}
		</p>
	</div>

	<div class="flex items-center gap-2">
		<MapPin class="size-4 text-neutral-700" />
		<p class="text-sm text-neutral-700">
			{#if data.event.location}
				{data.event.location}
			{:else}
				TBD
			{/if}
		</p>
	</div>
</div>

<div class="mb-16 flex flex-col gap-2">
	<h2 class="text-2xl font-semibold">Details</h2>
	<Markdown content={data.event.description} />
</div>
