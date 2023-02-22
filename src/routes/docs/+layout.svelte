<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Principle: {
			GET: '/docs/principle#get',
			'[slug]': '/docs/principle#slug'
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Principles: {
			GET: '/docs/principles#get'
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
