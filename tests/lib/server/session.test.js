import { describe, it, expect, vi, beforeEach, assert, mockImplementation } from 'vitest';
import * as sessionModule from '$lib/server/session';
import { hygraph } from '$lib/utils/hygraph';

describe('session.js', () => {
	let event, resolve;
	beforeEach(() => {
		event = {
			cookies: {
				get: vi.fn()
			}
		};
		resolve = vi.fn((e) => e);
		vi.resetAllMocks();
	});

	const now = Date.now();
	const fakeSession = {
		id: '1',
		sessieId: 'abc123',
		houdbaarTot: new Date(now + 10 * 24 * 60 * 60 * 1000), //10 days of lifetime left.
		gebruikerId: {
			id: 'u1',
			email: 'test@example.com',
			gebruikersnaam: 'tester',
			isEmailGeverifieerd: true
		}
	};

	it('Should refresh a old session', async () => {
		// Arrange
		//Mocking hygraph for isolation
		vi.spyOn(hygraph, 'request').mockImplementation(async (query, vars) => {
			if (query.includes('DeleteSessie')) return {};
			if (query.includes('UpdateSessie')) return {};
			return { sessie: fakeSession };
		});
		vi.setSystemTime(now); //Freezes time for better predictability
		const expectedDate = new Date(now + 1000 * 60 * 60 * 24 * 30);

		// Act
		const { session, user } = await sessionModule.validateSessionToken('notimportant');
		// Assert
		expect(session.houdbaarTot).toStrictEqual(expectedDate);
	});
});
