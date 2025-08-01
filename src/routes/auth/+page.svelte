<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/authClient';

	let isSignUp = $state(false);
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit() {
		if (!email || !password || (isSignUp && !name)) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			if (isSignUp) {
				await authClient.signUp.email({
					email,
					password,
					name
				});
				// After successful signup, redirect to home
				goto('/');
			} else {
				await authClient.signIn.email({
					email,
					password
				});
				// After successful signin, redirect to home
				goto('/');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	function toggleMode() {
		isSignUp = !isSignUp;
		error = '';
		name = '';
		email = '';
		password = '';
	}
</script>

<div class="mx-auto mt-8 max-w-sm p-4">
	<h1 class="mb-6 text-center text-2xl font-bold">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

	<form
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		{#if isSignUp}
			<div>
				<label for="name" class="mb-1 block text-sm font-medium">Name:</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					required
					disabled={loading}
					class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
				/>
			</div>
		{/if}

		<div>
			<label for="email" class="mb-1 block text-sm font-medium">Email:</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				disabled={loading}
				class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
			/>
		</div>

		<div>
			<label for="password" class="mb-1 block text-sm font-medium">Password:</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				disabled={loading}
				class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
			/>
		</div>

		{#if error}
			<div class="text-sm text-red-500">{error}</div>
		{/if}

		<button
			type="submit"
			disabled={loading}
			class="cursor-pointer rounded border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
		</button>
	</form>

	<p class="mt-4 text-center text-sm">
		{isSignUp ? 'Already have an account?' : "Don't have an account?"}
		<button
			type="button"
			onclick={toggleMode}
			class="ml-1 cursor-pointer border-none bg-transparent text-blue-500 underline hover:text-blue-700"
		>
			{isSignUp ? 'Sign In' : 'Sign Up'}
		</button>
	</p>
</div>
