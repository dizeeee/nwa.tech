<script lang="ts">
	import '../app.css';

	let { children, data } = $props();
	$inspect(data);
</script>

<div class="mx-auto flex max-w-screen-lg flex-col gap-4 py-4">
	<nav class="flex items-center justify-between gap-4">
		<div class="flex items-baseline gap-4">
			<a href="/" class="text-2xl font-bold">nwa.tech</a>
			<a href="/orgs">Organizations</a>
		</div>
		<div class="flex items-center gap-4">
			{#if data.session}
				{#if data.session.user.role === 'admin'}
					<a href="/admin">admin</a>
				{/if}
				<div>{data.session.user.email}</div>
			{:else}
				<a href="/signup">Sign up</a>
				<a href="/login">Login</a>
			{/if}
		</div>
	</nav>

	{@render children()}
</div>
