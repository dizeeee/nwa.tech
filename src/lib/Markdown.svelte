<script lang="ts">
	import { marked } from 'marked';

	let { content }: { content: string } = $props();
</script>

<div class="prose">
	{@html marked.parse(content)}
</div>
