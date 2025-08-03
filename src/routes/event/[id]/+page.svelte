<script lang="ts">
	import { Clock, MapPin } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Markdown from '$lib/Markdown.svelte';

	const { data }: PageProps = $props();
	let isAttending = $state(data.isAttending);
	let attendButtonText = $derived(isAttending ? 'Attending' : 'Attend');
</script>

<div class="flex items-center justify-between">
	<h1 class="text-3xl font-bold">{data.event.title}</h1>
	<button
		class={`cursor-pointer rounded-md px-4 py-2 text-white transition-colors
			${
				// janky but it works!
				attendButtonText === 'Attending'
					? 'bg-green-500 hover:bg-green-600'
					: attendButtonText === 'Cancel'
						? 'bg-red-500 hover:bg-red-600'
						: 'bg-blue-500 hover:bg-blue-600'
			}`}
		onmouseenter={() =>
			isAttending ? (attendButtonText = 'Cancel') : (attendButtonText = 'Attend')}
		onmouseleave={() =>
			isAttending ? (attendButtonText = 'Attending') : (attendButtonText = 'Attend')}
		onclick={async () => {
			const response = await fetch(`/event/${data.event.id}/attend`, {
				method: 'POST'
			});
			const text = await response.text();
			console.log(text);
			isAttending = !isAttending;
		}}
	>
		{attendButtonText}
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
