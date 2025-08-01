<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/authClient';

	let email = $state('');
	let password = $state('');
	let error = $state('');

	async function handleSubmit() {
		const res = await authClient.signIn.email({
			email,
			password
		});

		if (res.error) {
			error = res.error.message ?? '';
		}
		if (res.data) {
			goto('/');
		}
	}
</script>

<form
	onsubmit={handleSubmit}
	class="absolute top-1/2 left-1/2 flex max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
>
	<h1 class="text-2xl font-bold">Login</h1>
	<input
		type="email"
		bind:value={email}
		placeholder="Email"
		class="rounded-md border border-gray-300 p-2"
	/>
	<input
		type="password"
		bind:value={password}
		placeholder="Password"
		class="rounded-md border border-gray-300 p-2"
	/>
	<button
		type="submit"
		class="cursor-pointer rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
	>
		Login
	</button>
	<span class="text-center text-sm">
		Need an account?
		<a href="/signup" class="text-black underline hover:text-neutral-700">Sign up</a>
	</span>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</form>
