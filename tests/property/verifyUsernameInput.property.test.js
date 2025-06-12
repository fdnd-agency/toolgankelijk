import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { verifyUsernameInput } from '../../src/lib/server/user.js';

describe('Property test: verifyUsernameInput', () => {
	it('accepts only usernames between 4 and 31 chars with no leading/trailing whitespace', () => {
		fc.assert(
			fc.property(
				fc.string(), // generate arbitrary strings
				(username) => {
					const result = verifyUsernameInput(username);
					const trimmed = username.trim();
					if (
						typeof username !== 'string' ||
						username.length < 4 ||
						username.length > 31 ||
						username !== trimmed
					) {
						expect(result).toBe(false);
					} else {
						expect(result).toBe(true);
					}
				}
			),
			{ numRuns: 200 } // fast-check default runs is 100
		);
	});
});
