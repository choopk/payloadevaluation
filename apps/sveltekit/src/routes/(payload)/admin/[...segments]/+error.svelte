<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-container">
	<h1>404 - Page Not Found</h1>
	<p>The requested admin page could not be found.</p>
	<p class="error-details">
		{$page.error?.message || 'Unknown error'}
	</p>
	<a href="/admin">Return to Admin Home</a>
</div>

<style>
	.error-container {
		max-width: 600px;
		margin: 4rem auto;
		padding: 2rem;
		text-align: center;
		font-family: system-ui, -apple-system, sans-serif;
	}
	h1 {
		color: #dc2626;
		margin-bottom: 1rem;
	}
	p {
		margin-bottom: 1rem;
		line-height: 1.6;
	}
	.error-details {
		color: #666;
		font-size: 0.9em;
	}
	a {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
	}
	a:hover {
		background: #0052a3;
	}
</style>
