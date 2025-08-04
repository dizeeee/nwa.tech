<script lang="ts">
	import { goto } from '$app/navigation';
	import { Check, LoaderCircle } from '@lucide/svelte';

	interface Props {
		eventId: number;
		isAttending: boolean;
		session: { user: { email: string } } | null;
		onAttendanceChange?: (isAttending: boolean) => void;
	}

	let { eventId, isAttending = $bindable(), session, onAttendanceChange }: Props = $props();

	let isLoading = $state(false);
	let isHovered = $state(false);

	// Simplified button text logic
	const buttonText = $derived.by(() => {
		if (isLoading) return '';
		if (!isAttending) return 'Attend';
		return isHovered ? 'Cancel' : 'Attending';
	});

	async function handleClick() {
		if (isLoading) return;

		// Redirect to signup if not logged in
		if (!session) {
			goto(`/signup?redirect=${encodeURIComponent(`/event/${eventId}`)}`);
			return;
		}

		isLoading = true;

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await fetch(`/event/${eventId}/attend`, {
				method: 'POST'
			});

			if (response.ok) {
				// Toggle attendance state
				isAttending = !isAttending;
				// Call optional callback
				onAttendanceChange?.(isAttending);
			} else {
				console.error('Failed to update attendance:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating attendance:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<button
	class="flex h-10 w-32 cursor-pointer items-center justify-center rounded-md text-white transition-colors"
	class:bg-gray-400={isLoading}
	class:bg-blue-500={!isLoading && !isAttending}
	class:hover:bg-blue-600={!isLoading && !isAttending}
	class:bg-green-600={!isLoading && isAttending}
	class:hover:bg-red-600={!isLoading && isAttending}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onclick={handleClick}
	disabled={isLoading}
>
	{#if isLoading}
		<LoaderCircle class="size-5 animate-spin" />
	{:else}
		{buttonText}
	{/if}
</button>
