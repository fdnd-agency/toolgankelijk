import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userModule from '$lib/server/user';
import * as sessionModule from '$lib/server/session';
import { actions } from '../../src/routes/account/+page.server.js';

// Only mock the required functions
vi.mock('$lib/server/user', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        createUser: vi.fn()
    };
});
vi.mock('$lib/server/session', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        generateSessionToken: vi.fn(),
        createSession: vi.fn(),
        setSessionTokenCookie: vi.fn()
    };
});

describe('src/routes/account/+page.server.js integration', () => {
    let event;

    beforeEach(() => {
        event = {
            request: {
                formData: vi.fn()
            },
            locals: { sessie: null, gebruiker: null }
        };
        vi.clearAllMocks();
    });

    it('creates user and session on valid input', async () => {
        // Arrange
        event.request.formData.mockResolvedValue({
            get: (key) =>
                ({
                    email: 'test@vervoerregio.nl',
                	username: 'John',
                    password: 'T3$tT3$t',
                    'confirm-password': 'T3$tT3$t'
                }[key])
        });
        userModule.createUser.mockResolvedValue({ id: 'user-id' });
        sessionModule.generateSessionToken.mockReturnValue('token');
        sessionModule.createSession.mockResolvedValue({ houdbaarTot: 'future-date' });

        // Act
        await actions.default(event);

        // Assert
        expect(userModule.createUser).toHaveBeenCalledWith('test@vervoerregio.nl', 'John', 'T3$tT3$t');
        expect(sessionModule.generateSessionToken).toHaveBeenCalled();
        expect(sessionModule.createSession).toHaveBeenCalledWith('token', 'user-id');
        expect(sessionModule.setSessionTokenCookie).toHaveBeenCalledWith(event, 'token', 'future-date');
    });
});