<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<h1 class="text-3xl font-bold">Profile</h1>

{#if data.canManage}
	<h2 class="mt-6 text-2xl font-bold">Your events</h2>

	{#each data.events as event}
		<a href={`/event/${event.id}`}>
			<div class="rounded-md border border-neutral-300 p-2 hover:bg-neutral-100">
				<h3>{event.title}</h3>
				<p>{event.startTime ? new Date(event.startTime).toLocaleString() : 'TBD'}</p>
			</div>
		</a>
	{:else}
		<p class="text-neutral-600">No events created</p>
	{/each}

	<h2 class="mt-8 text-2xl font-bold">Your organizations</h2>

	{#if data.orgs}
		{#each data.orgs as org}
			<div>
				<h3>{org.organization.name} - {org.member.role}</h3>
			</div>
		{/each}
	{:else}
		<p class="text-neutral-600">No organizations</p>
	{/if}
{/if}

<h2 class="mt-8 text-2xl font-bold">Attending</h2>

{#each data.attendingEvents as event}
	<a href={`/event/${event.id}`}>
		<div class="rounded-md border border-neutral-300 p-2 hover:bg-neutral-100">
			<h3>{event.title}</h3>
			<p>{event.startTime ? new Date(event.startTime).toLocaleString() : 'TBD'}</p>
		</div>
	</a>
{:else}
	<p class="text-neutral-600">No upcoming attendance</p>
{/each}
