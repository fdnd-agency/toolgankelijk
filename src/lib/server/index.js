/**
 * Server-side exports.
 * Separated from lib/index.js to avoid security issues with client-side imports.
 *
 * Directus client is wired here; repository modules must not import it directly.
 */

import { directusClient } from '../utils/directus.js';
import { PartnerRepository } from './repositories/partnerRepository.js';
import { ContentRepository } from './repositories/contentRepository.js';
import { UrlRepository } from './repositories/urlRepository.js';
import { UserRepository } from './repositories/userRepository.js';
import { SessionRepository } from './repositories/sessionRepository.js';

export const partnerRepository = new PartnerRepository({ client: directusClient });
export const contentRepository = new ContentRepository({ client: directusClient });
export const urlRepository = new UrlRepository({ client: directusClient });
export const userRepository = new UserRepository({ client: directusClient });
export const sessionRepository = new SessionRepository({ client: directusClient });
