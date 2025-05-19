import { describe, it, expect, beforeEach } from 'vitest';
import { actions } from '../../src/routes/account/+page.server.js';
import { hygraph } from '../../src/lib/utils/hygraph.js';

describe('src/routes/account/+page.server.js integration', () => {
    let event;
    let uniqueEmail;
    let uniqueUsername;
    let createdUserId;
    let createdSessionId;

    beforeEach(() => {
        const unique = Date.now() + Math.floor(Math.random() * 10000);
        uniqueEmail = `test${unique}@vervoerregio.nl`;
        uniqueUsername = `John${unique}`;
        event = {
            request: {
                formData: async () => ({
                    get: (key) =>
                        ({
                            email: uniqueEmail,
                            username: uniqueUsername,
							password: 'T3$tT3$t',
                            'confirm-password': 'T3$tT3$t'
                        }[key])
                })
            },
            locals: { sessie: null, gebruiker: null },
            cookies: {
                set: () => {}
            }
        };
    });

    it('creates user and session on valid input', async () => {
        const result = await actions.default(event);
        expect(result).toMatchObject({ username: uniqueUsername });

        // Clean up: delete created user and session from Hygraph
        // 1. Find the user by email
        const userQuery = `
            query ($email: String!) {
                gebruiker(where: { email: $email }) {
                    id
                    sessies {
                        id
                    }
                }
            }
        `;
        const userData = await hygraph.request(userQuery, { email: uniqueEmail });
        createdUserId = userData.gebruiker?.id;
        const sessions = userData.gebruiker?.sessies ?? [];

        // 2. Delete sessions
        for (const sessie of sessions) {
            const deleteSessionMutation = `
                mutation ($id: ID!) {
                    deleteSessie(where: { id: $id }) { id }
                }
            `;
            await hygraph.request(deleteSessionMutation, { id: sessie.id });
        }

        // 3. Delete user
        if (createdUserId) {
            const deleteUserMutation = `
                mutation ($id: ID!) {
                    deleteGebruiker(where: { id: $id }) { id }
                }
            `;
            await hygraph.request(deleteUserMutation, { id: createdUserId });
        }
    });
});