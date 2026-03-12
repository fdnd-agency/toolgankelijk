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

export {};
