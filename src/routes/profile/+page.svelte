<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<h1 class="text-3xl font-bold">Profile</h1>

<h2 class="text-2xl font-bold">Your events</h2>

{#each data.events as event}
	<a href={`/event/${event.id}`}>
		<div class="rounded-md border border-neutral-300 p-2 hover:bg-neutral-100">
			<h3>{event.title}</h3>
			<p>{event.startTime ? new Date(event.startTime).toLocaleString() : 'TBD'}</p>
		</div>
	</a>
{/each}

<h2 class="text-2xl font-bold">Your organizations</h2>

{#if data.orgs}
	{#each data.orgs as org}
		<div>
			<h3>{org.organization.name} - {org.member.role}</h3>
		</div>
	{/each}
{:else}
	<p>No organizations</p>
{/if}
