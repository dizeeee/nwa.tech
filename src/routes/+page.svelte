<script lang="ts">
	import { Clock, MapPin } from '@lucide/svelte';

	const { data } = $props();
	let events = $state(data.events);
	let isLoading = $state(false);
	let hasMore = $state(data.hasMore);
	let nextOffset = $state(data.nextOffset);

	async function loadMore() {
		if (isLoading || !hasMore) return;
		isLoading = true;
		const res = await fetch(`/api/events?limit=10&offset=${nextOffset}`);
		const jsonRes = (await res.json()) as {
			events: typeof events;
			hasMore: boolean;
			nextOffset: number;
		};
		events = [...events, ...jsonRes.events];
		hasMore = jsonRes.hasMore;
		nextOffset = jsonRes.nextOffset;
		isLoading = false;
	}

	function onScroll() {
		const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
		if (nearBottom) loadMore();
	}
</script>

{#each events as event}
	<a href="/event/{event.id}">
		<div
			class="flex flex-col gap-2 rounded-md border border-neutral-300 px-4 py-2 transition-colors hover:bg-neutral-100"
		>
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

{#if hasMore}
	<div class="my-8 flex justify-center">
		<button class="rounded-md border px-4 py-2" disabled={isLoading} onclick={loadMore}>
			{#if isLoading}Loading...{:else}Load more{/if}
		</button>
	</div>
{/if}

<svelte:window on:scroll={onScroll} />
