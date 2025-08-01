<script lang="ts">
	import '../app.css';
	import { authClient } from '$lib/authClient';
	import { goto, invalidateAll } from '$app/navigation';
	import { ChevronDown, ChevronUp, LogOut, Plus, Shield, User } from '@lucide/svelte';

	let { children, data } = $props();

	let showPopover = $state(false);

	function togglePopover() {
		showPopover = !showPopover;
	}

	function closePopover() {
		showPopover = false;
	}

	async function handleLogout() {
		await authClient.signOut();
		closePopover();
		await invalidateAll();
		goto('/');
	}
</script>

<div class="mx-auto flex max-w-screen-lg flex-col gap-4 py-4">
	<nav class="flex items-center justify-between gap-4">
		<div class="flex items-baseline gap-4">
			<a href="/" class="text-2xl font-bold">nwa.tech</a>
		</div>
		<div class="flex items-center gap-4">
			{#if data.session}
				<div class="relative">
					<button
						onclick={togglePopover}
						class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 transition-colors hover:bg-gray-100"
						aria-expanded={showPopover}
						aria-haspopup="true"
						aria-label="User menu"
					>
						<span>{data.session.user.email}</span>
						{#if showPopover}
							<ChevronUp class="size-4" />
						{:else}
							<ChevronDown class="size-4" />
						{/if}
					</button>

					{#if showPopover}
						<!-- Backdrop to close popover when clicking outside -->
						<div
							class="fixed inset-0 z-10"
							onclick={closePopover}
							onkeydown={(e) => e.key === 'Escape' && closePopover()}
							role="button"
							tabindex="-1"
							aria-label="Close user menu"
						></div>

						<!-- Popover content -->
						<div
							class="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg"
						>
							<div class="flex flex-col p-1">
								<a
									href="/profile"
									class="flex items-center gap-2 rounded-md p-2 hover:bg-neutral-100"
									onclick={closePopover}
								>
									<User class="size-6 text-neutral-700" />
									<span>Profile</span>
								</a>
								{#if data.session.user.role?.split(',').includes('creator')}
									<a
										href="/event"
										class="flex items-center gap-2 rounded-md p-2 hover:bg-neutral-100"
										onclick={closePopover}
									>
										<Plus class="size-6 text-neutral-700" />
										Create event
									</a>
								{/if}
								{#if data.session.user.role?.split(',').includes('admin')}
									<a
										href="/admin"
										class="flex items-center gap-2 rounded-md p-2 hover:bg-neutral-100"
										onclick={closePopover}
									>
										<Shield class="size-6 text-neutral-700" />
										Admin
									</a>
								{/if}
								<button
									onclick={handleLogout}
									class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-left hover:bg-neutral-100"
								>
									<LogOut class="size-6 text-neutral-700" />
									Log out
								</button>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/signup">Sign up</a>
				<a href="/login">Login</a>
			{/if}
		</div>
	</nav>

	{@render children()}
</div>
