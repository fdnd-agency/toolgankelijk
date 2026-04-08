/**
 * Server-side exports.
 * Separated from lib/index.js to avoid security issues with client-side imports.
 *
 * `gql` and `directus` are wired here only; repository modules export classes and must not import them.
 */

import { gql } from 'graphql-request';
import { directus } from '../utils/directus.js';
import { PartnerRepository } from './repositories/partnerRepository.js';
import { ContentRepository } from './repositories/contentRepository.js';
import { UrlRepository } from './repositories/urlRepository.js';
import { UserRepository } from './repositories/userRepository.js';
import { SessionRepository } from './repositories/sessionRepository.js';

export const partnerRepository = new PartnerRepository({ client: directus, gql });
export const contentRepository = new ContentRepository({ client: directus, gql });
export const urlRepository = new UrlRepository({ client: directus, gql });
export const userRepository = new UserRepository({ client: directus, gql });
export const sessionRepository = new SessionRepository({ client: directus, gql });
