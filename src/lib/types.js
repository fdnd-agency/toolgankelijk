//@ts-check

/**
 * DOMAIN TYPES
 * ------------
 * Core entities that map closely to domain concepts.
 */

/**
 * URL belonging to a partner website.
 *
 * @typedef {Object} WebsiteUrl
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {string} [name]
 * @property {{ id: string, successcriteria?: { id: string }[] }[]} [checks]
 */

/**
 * Partner website.
 *
 * @typedef {Object} PartnerWebsite
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} homepage
 * @property {WebsiteUrl[]} [urls]
 */

/**
 * WCAG principle level.
 *
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} level
 * @property {string} slug
 */

/**
 * WCAG principle representation used on overview pages.
 *
 * @typedef {Object} Principle
 * @property {string} id 
 * @property {string} description
 * @property {string} index
 * @property {string} slug
 * @property {string} title
 */

/**
 * Checklist item attached to a WCAG principle in the toolboard.
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} check
 * @property {string} question
 * @property {string} explanation
 * @property {string} tip
 */

/**
 * Guideline reference used in toolboard context.
 *
 * @typedef {Object} ToolboardGuideline
 * @property {string} id
 * @property {string|null} guidelineId
 */

/**
 * Principle with full toolboard information.
 *
 * @typedef {Object} ToolboardPrinciple
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} index
 * @property {string} slug
 * @property {ChecklistItem[]} checklistItems
 * @property {ToolboardGuideline[]} guidelines
 */

/**
 * Check entry used on the toolboard URL view.
 *
 * @typedef {Object} ToolboardCheck
 * @property {string} id
 * @property {{ id: string }[]} successcriteria
 */

/**
 * Summary URL information for the toolboard page.
 *
 * @typedef {Object} ToolboardUrl
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {ToolboardCheck[]} checks
 */

/**
 * An object representing a session.
 *
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} userId
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

/**
 * COMBINED / AGGREGATED TYPES
 * ---------------------------
 * Shapes that combine multiple domain entities or represent query results.
 */

/**
 * Data returned from the partner overview query (`getQueryPartner`).
 *
 * @typedef {Object} PartnerOverviewData
 * @property {PartnerWebsite[]} websites
 * @property {number} totalWebsites
 * @property {Principle[]} principles
 */

/**
 * Detailed website data as used on single-partner pages.
 *
 * @typedef {Object} WebsiteDetails
 * @property {PartnerWebsite | null} website
 * @property {WebsiteUrl[]} urls
 * @property {number} totalUrls
 * @property {Principle[]} principles
 */

/**
 * Normalized data returned by the toolboard repository.
 *
 * @typedef {Object} ToolboardData
 * @property {ToolboardUrl|null} url
 * @property {ToolboardPrinciple|null} principle
 * @property {ToolboardPrinciple[]} principles
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
 * @property {{ id: string, successcriteria?: { id: string }[] }[]} [checks]
 */

export {};
