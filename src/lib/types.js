//@ts-check

/**
 * URL belonging to a partner website.
 *
 * @typedef {Object} WebsiteUrl
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {string} [name]
 * @property {{ id: string, success_criteria?: { id: string }[] }[]} [checks]
 */

/**
 * Partner website (high-level website entry).
 *
 * @typedef {Object} PartnerWebsite
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} homepage
 * @property {WebsiteUrl[]} [urls]
 */

/**
 * Minimal principle representation used on overview pages.
 *
 * @typedef {Object} Principle
 * @property {string} id
 * @property {string} title
 */

/**
 * Data returned from the partner overview query (`getQueryPartner`),
 *
 * @typedef {Object} PartnerOverviewData
 * @property {PartnerWebsite[]} websites
 * @property {number} totalWebsites
 * @property {Principle[]} principes
 */

/**
 * Detailed website data as used on single-partner pages.
 *
 * @typedef {Object} WebsiteDetails
 * @property {PartnerWebsite|null} website
 * @property {WebsiteUrl[]} urls
 * @property {number} totalUrls
 * @property {Principle[]} principes
 */

/**
 * URL details including website reference and checks.
 * This is the normalized shape returned by the URL repository.
 *
 * @typedef {Object} UrlWithWebsite
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {string} [name]
 * @property {{ id: string, slug?: string } | null} [website]
 * @property {{ id: string, success_criteria?: { id: string }[] }[]} [checks]
 */

/**
 * an object representing a session.
 *
 * @typedef {Object} Session
 * @property {string|null} id
 * @property {string|null} userId
 * @property {Date} expiresAt
 */

/**
 * An object representing a user.
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} username
 * @property {boolean} isEmailVerified
 */

/**
 * An email verification request for a user.
 *
 * @typedef {Object} EmailVerificationRequest
 * @property {string} id
 * @property {string} userId
 * @property {string} email
 * @property {string} code
 * @property {Date} expiresAt
 */

export {};
