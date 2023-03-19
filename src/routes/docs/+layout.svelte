<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Principes: {
			GET: '/docs/principes#get'
		},
		Principe: {
			GET: '/docs/principe#get',
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Websites: {
			GET: '/docs/websites#get'
		},
		URLs: {
			GET: '/docs/urls#get',
			POST: '/docs/urls#post'
		},
		URL: {
			GET: '/docs/url#get'
		},
		Checks: {
			GET: '/docs/checks#get'
		}
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
