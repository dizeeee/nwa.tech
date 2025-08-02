<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/authClient';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');

	async function handleSubmit() {
		const res = await authClient.signUp.email({
			email,
			password,
			name
		});

		if (res.error) {
			error = res.error.message ?? '';
		}
		if (res.data) {
			await invalidateAll();
			goto('/');
		}
	}
</script>

<form
	onsubmit={handleSubmit}
	class="absolute top-1/2 left-1/2 flex max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
>
	<h1 class="text-2xl font-bold">Sign up</h1>
	<input
		type="text"
		bind:value={name}
		placeholder="Name"
		class="rounded-md border border-gray-300 p-2"
	/>
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
		Sign up
	</button>
	<span class="space-y-2 text-center text-sm">
		By signing up, you agree to our <a
			href="/tos"
			class="text-black underline hover:text-neutral-700">Terms of Service</a
		>
		and <a href="/privacy" class="text-black underline hover:text-neutral-700">Privacy Policy</a>.
	</span>
	<span class="text-center text-sm">
		Already have an account?
		<a href="/login" class="text-black underline hover:text-neutral-700">Login</a>
	</span>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</form>
