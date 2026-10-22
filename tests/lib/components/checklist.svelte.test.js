import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Checklist from '$lib/components/templates/checklist.svelte';

describe('/checklist.svelte', () => {
	it('toont de juiste beschrijving', () => {
		render(Checklist, {
			props: {
				guidelines: [
					{
						index: '1.1',
						title: 'Tekstalternatieven',
						explanation: { html: 'Beschrijving' },
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
				selectedLevel: 'A',
				description: 'simpel'
			}
		});

		expect(screen.getByText('Eenvoudige beschrijving')).toBeTruthy();
	});
});
