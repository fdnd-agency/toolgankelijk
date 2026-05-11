import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from '$lib/components/templates/card.svelte';

import '../../../../../static/global.css';

describe('Card (browser)', () => {
	test('partner card title and background match global.css card token', async () => {
		const { container } = await render(Card, {
			props: {
				params: {},
				isUrl: false,
				principles: [{ guidelines: [{ successCriteria: [{ id: '1' }] }] }],
				website: {
					id: '1',
					slug: 'test-website',
					title: 'test website',
					homepage: 'https://testwebsite.example',
					urls: [{ checks: [{ successCriteria: [{ id: '1' }] }] }]
				}
			}
		});

		const article = container.querySelector('#card-partner');
		expect(article).not.toBeNull();
		expect(article.querySelector('h2')?.textContent).toBe('test website');
		const probe = document.createElement('div');
		probe.style.backgroundColor = 'var(--color-background-card)';
		document.body.appendChild(probe);
		const fromGlobalCss = getComputedStyle(probe).backgroundColor;
		probe.remove();

		expect(getComputedStyle(article).backgroundColor).toBe(fromGlobalCss);
	});
});
