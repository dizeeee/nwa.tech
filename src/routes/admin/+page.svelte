<script lang="ts">
	import { authClient } from "$lib/authClient";


	async function handleSubmit() {
		authClient.organization.create({
			name: 'My Organization', // required
			slug: 'my-org' // required
		});
	}
</script>

<form></form>
