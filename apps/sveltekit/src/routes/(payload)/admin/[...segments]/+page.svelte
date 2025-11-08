<script lang="ts">
	import { RootPage } from '@payloadcms/next/views';
	import config from '../../../../payload.config.mts';
	import { importMap } from '../importMap.js';
	import { page } from '$app/stores';

	// Get params and searchParams from SvelteKit's page store
	let params = $derived($page.params);
	let searchParams = $derived($page.url.searchParams);

	// Convert searchParams to the format expected by Payload
	let searchParamsObj = $derived(
		Object.fromEntries(searchParams.entries())
	);
</script>

<!-- Payload admin UI would be rendered here -->
<!-- Note: RootPage is a React component from @payloadcms/next/views -->
<!-- For full compatibility, consider using Payload with Next.js for the admin UI -->
<div id="payload-admin">
	<div class="admin-container">
		<h1>Payload CMS Admin</h1>
		<p>
			The Payload admin UI uses React components from <code>@payloadcms/next/views</code>.
		</p>
		<p>API endpoints are available at:</p>
		<ul>
			<li><a href="/api">REST API: /api/*</a></li>
			<li><a href="/api/graphql">GraphQL: /api/graphql</a></li>
			<li><a href="/api/graphql-playground">GraphQL Playground: /api/graphql-playground</a></li>
		</ul>
		<p class="note">
			<strong>Note:</strong> For a fully functional admin UI, Payload CMS 3.x is designed to work
			with Next.js. The API routes above are fully functional for headless CMS usage.
		</p>
	</div>
</div>

<style>
	.admin-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}
	h1 {
		margin-bottom: 1.5rem;
		color: #1a1a1a;
	}
	p {
		margin-bottom: 1rem;
		line-height: 1.6;
	}
	code {
		background: #f4f4f4;
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.9em;
	}
	ul {
		margin: 1rem 0 1rem 2rem;
		line-height: 1.8;
	}
	a {
		color: #0066cc;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	.note {
		margin-top: 2rem;
		padding: 1rem;
		background: #fff9e6;
		border-left: 4px solid #ffcc00;
		border-radius: 4px;
	}
</style>
