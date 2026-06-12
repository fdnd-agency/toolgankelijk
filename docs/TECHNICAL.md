# Technical Documentation

## Project Structure

The project consists of two interacting applications:

- **toolgankelijk/**: The front-end application for partners and administrators.
- **toolgankelijk-audit/**: The backend audit service for automated accessibility checks.

### toolgankelijk/

- **src/routes/**: Contains all pages and routing logic (SvelteKit).
- **src/lib/components/**: Reusable Svelte components, organized according to Atomic Design (atoms, molecules, organisms, templates).
- **src/lib/server/**: Contains backend logic such as queries, repositories, authentication, and session management.
- **static/**: Static assets like images and fonts.
- **docs/**: Documentation files.

### toolgankelijk-audit/

- **src/lib/server/**: Backend logic, repositories, and audit services.
- **src/routes/api/**: REST API endpoints for audit actions.
- **src/routes/**: SvelteKit routes for status pages and documentation.

## Collaboration Between the Projects

- **toolgankelijk** manages partners, websites, URLs, and accessibility checks via a **Directus CMS**.
- **toolgankelijk-audit** performs automated WCAG audits periodically or on demand on partner URLs.
- The front-end initiates an audit via an API call to the audit service in `toolgankelijk-audit`.
- Audit results are written back to Directus so the front-end can immediately display the current status.

## Key Components

### toolgankelijk

# Component Architecture Documentation

### Atoms

**Icon**
* **Bestand:** `src/lib/components/atoms/icon.svelte`
* **Function:** Imports and renders specific vector icons from an icon pack.

**LogoHeader**
* **Bestand:** `src/lib/components/atoms/logo-header.svelte`
* **Function:** Displays the primary application or brand logo, typically used in navigation bars.

**Separator**
* **Bestand:** `src/lib/components/atoms/separator.svelte`
* **Function:** A visual divider (horizontal or vertical line) used to separate content and group related UI elements.

---

### Molecules

**Alert**
* **Bestand:** `src/lib/components/molecules/alert.svelte`
* **Function:** Displays a prominent message to the user, communicating states like success, error, warning, or information.

**Checkbox**
* **Bestand:** `src/lib/components/molecules/checkbox.svelte`
* **Function:** A form control that allows a user to select one or multiple options from a set, often paired with a label.

**Heading**
* **Bestand:** `src/lib/components/molecules/heading.svelte`
* **Function:** Renders standardized typographic headings (H1-H6) with consistent sizing, spacing, and brand styling.

**Input**
* **Bestand:** `src/lib/components/molecules/input.svelte`
* **Function:** A text entry field for user data collection, usually combining a raw input HTML tag with labels, icons, or error messages.

**Loader**
* **Bestand:** `src/lib/components/molecules/loader.svelte`
* **Function:** A visual indicator (such as a spinner or skeleton screen) that signals to the user that a background process or data fetch is occurring.

**NavButton**
* **Bestand:** `src/lib/components/molecules/nav-button.svelte`
* **Function:** A specialized button component specifically styled and structured for navigation menus and routing links.

**Progressbar**
* **Bestand:** `src/lib/components/molecules/progressbar.svelte`
* **Function:** Visually communicates the completion status of a specific task, process, or file upload.

**Search**
* **Bestand:** `src/lib/components/molecules/search.svelte`
* **Function:** A composite search field, typically combining an input molecule with a search icon and a clear/submit button.

---

### Organisms

**Breadcrumbs**
* **Bestand:** `src/lib/components/organisms/breadcrumbs.svelte`
* **Function:** A secondary navigation scheme that reveals the user's location in an application or website, allowing them to easily trace their path back.

**HamburgerMenu**
* **Bestand:** `src/lib/components/organisms/hamburger-menu.svelte`
* **Function:** A collapsible navigation menu system containing multiple `NavButton` elements, commonly used for responsive mobile layouts.

**Pages**
* **Bestand:** `src/lib/components/organisms/pages.svelte`
* **Function:** A high-level container component that orchestrates layout, data fetching, and nested components for specific application routes.

---

### Templates

**Card**
* **Bestand:** `src/lib/components/templates/card.svelte`
* **Function:** A flexible content container used to group related information, interactive elements, and actions into a distinct visual block.

**Checklist**
* **Bestand:** `src/lib/components/templates/checklist.svelte`
* **Function:** A structured layout template designed to display a series of `Checkbox` molecules and text, facilitating task tracking or bulk selections.

**Dialog**
* **Bestand:** `src/lib/components/templates/dialog.svelte`
* **Function:** A modal window template that overlays the main interface, capturing user focus for critical decisions, forms, or acknowledgments.

**Header**
* **Bestand:** `src/lib/components/templates/header.svelte`
* **Function:** The overarching top-level navigation template, combining organisms like the `HamburgerMenu` and atoms like the `LogoHeader` to construct the primary app header.
#### Server-side Logic (Repositories & Queries)

The project uses the Repository pattern for data retrieval from Directus. Repositories are located in `src/lib/server/repositories/` and use REST or GraphQL queries from `src/lib/server/queries/`.

- File: [`src/lib/server/repositories/partnerRepository.js`](../src/lib/server/repositories/partnerRepository.js)
  - Function: Manages partner and website data (fetching, adding, editing, deleting).
- File: [`src/lib/server/repositories/urlRepository.js`](../src/lib/server/repositories/urlRepository.js)
  - Function: Manages URL data and the associated manual checks.
- File: [`src/lib/server/repositories/contentRepository.js`](../src/lib/server/repositories/contentRepository.js)
  - Function: Fetching WCAG content (principles, guidelines, success criteria) and toolboard data.
- File: [`src/lib/server/repositories/baseRepository.js`](../src/lib/server/repositories/baseRepository.js)
  - Function: Base class for repositories, contains general Directus interaction logic and error handling.
- File: [`src/lib/server/index.js`](../src/lib/server/index.js)
  - Function: Initializes the repositories with the Directus client.

### toolgankelijk-audit

- File: [`src/lib/server/repositories/AuditRepository.js`](../../toolgankelijk-audit/src/lib/server/repositories/AuditRepository.js)
  - Function: The `AuditRepository` class handles communication with Directus for saving and retrieving audit results.
- File: [`src/lib/server/services/AuditService.js`](../../toolgankelijk-audit/src/lib/server/services/AuditService.js)
  - Function: The `AuditService` class manages the core logic for running audits, processing results, and calling repository methods.
- File: [`src/routes/api/specifiedUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/specifiedUrls/+server.js)
  - Function: Endpoint for executing audits on specific partner URLs.
- File: [`src/routes/api/allUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/allUrls/+server.js)
  - Function: Endpoint for executing a periodic audit on all URLs of all partners.
- File: [`src/routes/api/isProjectRunning/+server.js`](../../toolgankelijk-audit/src/routes/api/isProjectRunning/+server.js)
  - Function: Endpoint for health check of the audit backend.
- File: [`src/lib/server/utils/ActiveAudits.js`](../../toolgankelijk-audit/src/lib/server/utils/ActiveAudits.js)
  - Function: The `ActiveAudits` singleton tracks which partners are currently being audited to prevent duplicate audits.
- File: [`src/lib/server/utils/AuditRunner.js`](../../toolgankelijk-audit/src/lib/server/utils/AuditRunner.js)
  - Function: The `AuditRunner` performs the actual accessibility audit on a URL using Puppeteer and axe-core.
- File: [`src/lib/server/utils/RequestRetry.js`](../../toolgankelijk-audit/src/lib/server/utils/RequestRetry.js)
  - Function: Contains logic to retry requests in case of rate limiting or network errors.

## CMS Configuration (Directus)

### Content Types

- **Check**: Link between a URL and the achieved success criteria.
- **Checklist Item**: Item in the checklist belonging to a principle.
- **Email Domain**: Allowed email domains for registration.
- **Email Verification Code**: Temporary code for email verification during registration.
- **User**: User account with email, username, password, and verification status.
- **Principle**: Main category within WCAG, contains multiple Guidelines.
- **Guideline**: Subcategory within a Principle, contains multiple Success Criteria.
- **Session**: Active login session of a user.
- **SuccessCriteria**: Concrete assessment point, contains criteria and easy criteria (both as rich text).
- **Test**: Audit/test result of a URL at a specific moment.
- **TestNode**: Detailed information about a specific finding within a Test.
- **URL**: A specific page of a website, linked to a Website.
- **Website**: Contains general info about a partner/website.

## API Documentation

### toolgankelijk

- **Directus API**: For fetching and mutating content.
  - Queries are executed via the repositories in `src/lib/server/repositories`.
  - GraphQL queries can be found in [`src/lib/server/queries/`](../src/lib/server/queries/).
  - Authentication is done via a Bearer token (`VITE_DIRECTUS_KEY`), set in the `.env` configuration.
- **Audit API**: `/api/startAudit` sends a list of URLs and a slug to the audit backend.
  - Endpoint: [`src/routes/api/startAudit/+server.js`](../src/routes/api/startAudit/+server.js)
  - Method: `POST`
  - Body: FormData with:
    - `urls`: JSON string of an array of URLs
    - `slug`: website slug
  - Operation: Sends a request to the audit backend (see `TOOLGANKELIJK_AUDIT_URL` in `.env`).
- **Partner/URL Management APIs**:
  - Add Partner: [`/api/addPartner`](../src/routes/api/addPartner/+server.js) (`POST`)
  - Edit Partner: [`/api/editPartner`](../src/routes/api/editPartner/+server.js) (`POST`)
  - Delete Partner: [`/api/deletePartner`](../src/routes/api/deletePartner/+server.js) (`POST`)
  - Add URL: [`/api/addUrl`](../src/routes/api/addUrl/+server.js) (`POST`)
  - Edit URL: [`/api/editUrl`](../src/routes/api/editUrl/+server.js) (`POST`)
  - Delete URL: [`/api/deleteUrl`](../src/routes/api/deleteUrl/+server.js) (`POST`)
  - All these endpoints accept FormData and return status updates via Server-Sent Events (SSE).
- **Authentication and Session Management**:
  - Session is managed via cookies and checked in [`src/hooks.server.js`](../src/hooks.server.js).
  - User data and sessions are stored in Directus.

### toolgankelijk-audit

- **/api/specifiedUrls**

  - Method: `POST`
  - Body:
    ```json
    {
      "urls": [
        { "url": "https://example.com/page1", "urlSlug": "page1-slug" },
        { "url": "https://example.com/page2", "urlSlug": "page2-slug" }
      ],
      "websiteSlug": "example"
    }
    ```
  - Function: Receives a list of URLs and a websiteSlug, performs audits on these URLs using Puppeteer and axe-core, and writes the results back to Directus.
  - Response:
    - `200`: Audit executed successfully
    - `409`: Audit is already in progress for this partner
    - `500`: Error while executing audit

- **/api/allUrls**

  - Method: `POST`
  - Function: Starts a periodic audit on all URLs of all partners.
  - Body: None or optional configuration object
  - Response:
    - `200`: Audit started
    - `500`: Error while executing audit

- **/api/isProjectRunning**
  - Method: `GET`
  - Function: Health check endpoint, indicates whether the audit backend is active.
  - Response:
    - `200`: Backend is active
    - `503`: Backend is unreachable

## Miscellaneous

- See [`README.md`](../README.md) for a general explanation of the project and installation instructions.
- See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines on contributing to this project, such as the workflow, code conventions, branching strategy, commit messages, and the pull request process.