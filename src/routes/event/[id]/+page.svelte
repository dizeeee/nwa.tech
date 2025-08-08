<script lang="ts">
	import { Clock, MapPin, User } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Markdown from '$lib/components/Markdown.svelte';
	import { authClient } from '$lib/authClient';
	import AttendButton from '$lib/components/AttendButton.svelte';

	const { data }: PageProps = $props();
	let isAttending = $state(data.isAttending);
	let isResendClicked = $state(false);
</script>

<div class="flex items-center justify-between">
	<h1 class="text-3xl font-bold">{data.event.title}</h1>
	<div class="flex flex-col items-end gap-2">
		{#if data.session && !data.emailVerified}
			{#if !isResendClicked}
				<p class="text-sm text-neutral-700">Please verify your email to attend this event.</p>
				<button
					class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					onclick={() => {
						authClient.sendVerificationEmail({
							email: data.session?.user.email ?? '',
							callbackURL: `/event/${data.event.id}`
						});
						isResendClicked = true;
					}}
				>
					Resend verification email
				</button>
			{:else}
				<p class="text-sm text-neutral-700">
					Verification email sent. Please check your email for a link to verify your account.
				</p>
			{/if}
		{:else}
			<div class="flex items-center gap-2">
				<AttendButton eventId={data.event.id} bind:isAttending session={data.session} />
				{#if data.session?.user.id === data.event.organizerId}
					<a
						class="flex h-10 cursor-pointer items-center justify-center rounded-md border border-neutral-300 px-4 text-sm text-neutral-800 transition-colors hover:bg-neutral-100"
						href={`/event/${data.event.id}/edit`}>Edit</a
					>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if data.event.imageUrl}
	<div class="my-4 aspect-[16/9] overflow-hidden rounded-md border border-neutral-200">
		<img
			src={data.event.imageUrl}
			alt={data.event.title}
			class="h-full w-full object-cover"
			loading="eager"
			decoding="async"
		/>
	</div>
{/if}

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

	<div class="flex items-center gap-2">
		<User class="size-4 text-neutral-700" />
		<p class="text-sm text-neutral-700">
			{data.attendeeCount} attendee{data.attendeeCount === 1 ? '' : 's'}
		</p>
	</div>
</div>

<div class="mb-16 flex flex-col gap-2">
	<h2 class="text-2xl font-semibold">Details</h2>
	<Markdown content={data.event.description} />
</div>
