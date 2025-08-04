<script lang="ts">
	import { Clock, MapPin } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Markdown from '$lib/Markdown.svelte';
	import { authClient } from '$lib/authClient';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();
	let isAttending = $state(data.isAttending);
	let attendButtonText = $derived(isAttending ? 'Attending' : 'Attend');
	let isResendClicked = $state(false);
</script>

<div class="flex items-center justify-between">
	<h1 class="text-3xl font-bold">{data.event.title}</h1>
	{#if data.session && !data.emailVerified}
		{#if !isResendClicked}
			<div class="flex flex-col gap-2">
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
			</div>
		{:else}
			<p class="text-sm text-neutral-700">
				Verification email sent. Please check your email for a link to verify your account.
			</p>
		{/if}
	{:else}
		<button
			class={`w-32 cursor-pointer rounded-md px-4 py-2 text-white transition-colors
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
				if (!data.session) {
					goto(`/signup?redirect=${encodeURIComponent(`/event/${data.event.id}`)}`);
					return;
				}

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
	{/if}
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
