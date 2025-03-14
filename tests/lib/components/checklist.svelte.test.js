import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Checklist from '$lib/components/checklist.svelte';

describe('/checklist.svelte', () => {
	it('controleert of de "officiële/simpele beschrijving" knop aanwezig is', () => {
		render(Checklist, {
			props: {
				richtlijnen: [
					{
						index: '1.1',
						titel: 'Tekstalternatieven',
						uitleg: { html: 'Beschrijving van richtlijn 1.1' },
						succescriteria: [
							{
								index: '1.1.1',
								niveau: 'A',
								titel: 'Niet-tekstuele content',
								makkelijkeCriteria: { html: 'Eenvoudige beschrijving' },
								criteria: { html: 'Officiële beschrijving' }
							}
						]
					}
				],
				toolboardData: {
					url: { checks: [{ succescriteria: [] }] },
					principe: { index: 1 }
				},
				selectedNiveau: 'A'
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
