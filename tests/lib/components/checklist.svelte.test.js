import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Checklist from '$lib/components/templates/checklist.svelte';

describe('/checklist.svelte', () => {
	it('controleert of de "officiële/simpele beschrijving" knop aanwezig is', () => {
		render(Checklist, {
			props: {
				guidelines: [
					{
						index: '1.1',
						title: 'Tekstalternatieven',
						explanation: { html: 'Beschrijving van richtlijn 1.1' },
						successCriteria: [
							{
								id: 'sc-1',
								index: '1.1.1',
								level: 'A',
								title: 'Niet-tekstuele content',
								easyCriteria: { html: 'Eenvoudige beschrijving' },
								criteria: { html: 'Officiële beschrijving' }
							}
						]
					}
				],
				toolboardData: {
					url: { checks: [{ successCriteria: [{ id: 'sc-1', level: 'A' }] }] },
					principle: { index: 1 }
				},
				levels: [{ level: 'A' }],
				selectedLevel: 'A'
			}
		});

		const vertalingKnop = screen.getByRole('button', {
			name: (content, element) => {
				const hasText = (text) => element.textContent.includes(text);
				return hasText('Officiële beschrijving') || hasText('Simpele beschrijving');
			}
		});
		expect(vertalingKnop.textContent).toMatch(/Officiële beschrijving|Simpele beschrijving/);
	});
});
