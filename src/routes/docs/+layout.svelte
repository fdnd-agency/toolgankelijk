<script>
	import { Documentation, Nav } from '@fdnd/components';

	const data = {
		Principe: {
			GET: '/docs/principe#get',
			// POST: '/docs/method#post',
			// PUT: '/docs/method#put',
			// PATCH: '/docs/method#patch',
			// DELETE: '/docs/method#delete',
		},
		Principes: {
			GET: '/docs/principes#get'
		},
		
	};
</script>

<Documentation {data}>
	<slot />
</Documentation>
