//@ts-check

/**
 * DOMAIN TYPES
 * Core entities that map closely to domain concepts.
 */

/**
 * WCAG conformance level.
 *
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} level
 * @property {string} slug
 */

/**
 * Minimal success-criteria reference (id only), e.g. partner card counts or check junctions.
 *
 * @typedef {Object} SuccessCriteriaIdRef
 * @property {string} id
 */

/**
 * Success criteria fields used in principle and toolboard UIs (mapped from junction rows; one row per item).
 *
 * @typedef {Object} SuccessCriteria
 * @property {string} id
 * @property {string} [index]
 * @property {string} [level]
 * @property {string} [title]
 * @property {{ html: string }} [easyCriteria]
 * @property {{ html: string }} [criteria]
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
 * URL belonging to a partner website.
 *
 * @typedef {Object} WebsiteUrl
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {string} [name]
 * @property {{ id: string, successCriteria?: SuccessCriteriaIdRef[] }[]} [checks]
 */

/**
 * Guideline with optional nested success criteria (partner overview, principles list).
 *
 * @typedef {Object} Guideline
 * @property {string} id
 * @property {string} [index]
 * @property {string} [title]
 * @property {{ html: string }} [explanation]
 * @property {(SuccessCriteria|SuccessCriteriaIdRef)[]|null} successCriteria
 */

/**
 * WCAG principle with nested guidelines (`getAllPrinciples`, partner queries).
 *
 * @typedef {Object} Principle
 * @property {string} id
 * @property {string} [description]
 * @property {string} [index]
 * @property {string} [slug]
 * @property {string} [title]
 * @property {Guideline[]} guidelines
 */

/**
 * TOOLBOARD TYPES
 * URL toolboard page, checklist, and `getToolboard` repository output.
 */

/**
 * Check entry used on the toolboard URL view.
 *
 * @typedef {Object} ToolboardCheck
 * @property {string} id
 * @property {SuccessCriteria[]} successCriteria
 */

/**
 * Guideline reference used in toolboard context.
 *
 * @typedef {Object} ToolboardGuideline
 * @property {string} id
 * @property {string|null} guidelineId
 * @property {string} [index]
 * @property {string} [title]
 * @property {{ html: string }} [explanation]
 * @property {SuccessCriteria[]} [successCriteria]
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
 * @property {ToolboardGuideline[]} guidelines
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
 * Data returned by the toolboard repository (`getToolboard`).
 *
 * @typedef {Object} ToolboardData
 * @property {ToolboardUrl|null} url
 * @property {ToolboardPrinciple|null} principle
 * @property {ToolboardPrinciple[]} principles
 */

/**
 * AUTH TYPES
 * Sessions, users, and email verification used by server auth flows.
 */

/**
 * Email verification request for a user.
 *
 * @typedef {Object} EmailVerificationRequest
 * @property {string} id
 * @property {string} userId
 * @property {string} email
 * @property {string} code
 * @property {Date} expiresAt
 */

/**
 * Active login session.
 *
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} userId
 * @property {Date} expiresAt
 */

/**
 * Application user.
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} username
 * @property {boolean} isEmailVerified
 */

/**
 * AGGREGATED TYPES
 * Composite shapes from partner or URL repository queries.
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
 * URL details including website reference and checks.
 * Shape returned by the URL repository.
 *
 * @typedef {Object} UrlWithWebsite
 * @property {string} id
 * @property {string} slug
 * @property {string} url
 * @property {string} [name]
 * @property {{ id: string, slug?: string }|null} [website]
 * @property {{ id: string, successCriteria?: SuccessCriteria[] }[]} [checks]
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
 * COMPOSITE WCAG MODEL TYPES
 * Richer WCAG criterion + checklist composition; only referenced by typedefs here, not imported in app code.
 */

/**
 * Checklist item attached to a WCAG success criterion in the toolboard.
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} check
 * @property {string} question
 * @property {string} explanation
 * @property {string} tip
 */

/**
 * WCAG success criterion with nested level and checklist (conceptual / schema-oriented shape).
 *
 * @typedef {Object} SuccessCriteriaDetail
 * @property {string} id
 * @property {string} index
 * @property {string} title
 * @property {string} easy_criteria
 * @property {string} criteria
 * @property {Level} level
 * @property {ChecklistItem[]} checklist_items
 */

export {};
