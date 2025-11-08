<script lang="ts">
	import '@payloadcms/next/css';
	import './custom.scss';

	let { children } = $props();
</script>

{@render children()}
