import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { verifyUsernameInput } from '../../src/lib/server/user.js';

describe('verifyUsernameInput', () => {
	it('rejects usernames shorter than 4 characters', () => {
		fc.assert(
			fc.property(fc.string({ maxLength: 3 }), (username) => {
				expect(verifyUsernameInput(username)).toBe(false);
			}),
			{ numRuns: 200 } // fast-check default runs is 100
		);
	});

	it('rejects usernames longer than 31 characters', () => {
		fc.assert(
			fc.property(fc.string({ minLength: 32 }), (username) => {
				expect(verifyUsernameInput(username)).toBe(false);
			}),
			{ numRuns: 200 }
		);
	});

	it('rejects usernames with leading or trailing whitespace', () => {
		fc.assert(
			fc.property(
				fc
					.string({ minLength: 4, maxLength: 31 })
					.filter((usernameInput) => usernameInput.trim() !== usernameInput),
				(username) => {
					expect(verifyUsernameInput(username)).toBe(false);
				}
			),
			{ numRuns: 200 }
		);
	});

	it('accepts valid usernames (4–31 chars, no leading/trailing whitespace)', () => {
		fc.assert(
			fc.property(
				fc.string({ minLength: 4, maxLength: 31 }).filter((s) => s.trim() === s && s.length > 0),
				(username) => {
					expect(verifyUsernameInput(username)).toBe(true);
				}
			),
			{ numRuns: 200 }
		);
	});
});
