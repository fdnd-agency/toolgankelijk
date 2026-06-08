# Technische Documentatie

## Projectstructuur

Het project bestaat uit twee samenwerkende applicaties:

- **toolgankelijk/**: De front-end applicatie voor partners en beheerders.
- **toolgankelijk-audit/**: De backend auditservice voor automatische toegankelijkheidscontroles.

### toolgankelijk/

- **src/routes/**: Bevat alle pagina's en route-logica (SvelteKit).
- **src/lib/components/**: Herbruikbare Svelte-componenten, georganiseerd volgens Atomic Design (atoms, molecules, organisms, templates).
- **src/lib/server/**: Bevat backend-logica zoals queries, repositories, authenticatie en sessiebeheer.
- **static/**: Statische assets zoals afbeeldingen en fonts.
- **docs/**: Documentatiebestanden.

### toolgankelijk-audit/

- **src/lib/server/**: Backend-logica, repositories en auditservices.
- **src/routes/api/**: REST API-endpoints voor audit-acties.
- **src/routes/**: SvelteKit-routes voor statuspagina's en documentatie.

## Samenwerking tussen de projecten

- **toolgankelijk** beheert partners, websites, urls en toegankelijkheidschecks via een **Directus CMS**.
- **toolgankelijk-audit** voert periodiek of op verzoek automatische WCAG-audits uit op URLs van partners.
- De front-end start een audit via een API-call naar de auditservice in `toolgankelijk-audit`.
- Auditresultaten worden teruggeschreven naar Directus, zodat de front-end direct de actuele status kan tonen.

## Belangrijke Componenten

### toolgankelijk

#### Componenten (Atomic Design)

- Bestand: [`src/lib/components/templates/checklist.svelte`](../src/lib/components/templates/checklist.svelte)
  - Functie: Toont de toegankelijkheids-checklist per principe.
  - Werking: Ontvangt `richtlijnen` en `toolboardData` as props en rendert de checklist-items.
- Bestand: [`src/lib/components/molecules/heading.svelte`](../src/lib/components/molecules/heading.svelte)
  - Functie: Toont de titel en navigatie van de huidige pagina.
- Bestand: [`src/lib/components/templates/sidebar.svelte`](../src/lib/components/templates/sidebar.svelte)
  - Functie: Navigatie tussen principes en urls binnen een website.
- Bestand: [`src/lib/components/templates/dialog.svelte`](../src/lib/components/templates/dialog.svelte)
  - Functie: Formuliercomponent voor het toevoegen, bewerken en verwijderen van partners en URLs, en het starten van audits.
- Bestand: [`src/lib/components/templates/card.svelte`](../src/lib/components/templates/card.svelte)
  - Functie: Toont een kaart voor een partner of een URL met relevante informatie, voortgang en acties.
- Bestand: [`src/lib/components/organisms/pages.svelte`](../src/lib/components/organisms/pages.svelte)
  - Functie: Paginering-component voor het navigeren door lijsten van partners of URLs.
- Bestand: [`src/lib/components/molecules/loader.svelte`](../src/lib/components/molecules/loader.svelte)
  - Functie: Toont voortgangs- en statusupdates tijdens lange bewerkingen (zoals partner/url toevoegen).

#### Server-side Logica (Repositories & Queries)

Het project gebruikt het Repository-patroon voor data-ontsluiting uit Directus. Repositories bevinden zich in `src/lib/server/repositories/` en gebruiken REST of GraphQL queries uit `src/lib/server/queries/`.

- Bestand: [`src/lib/server/repositories/partnerRepository.js`](../src/lib/server/repositories/partnerRepository.js)
  - Functie: Beheert partner- en websitegegevens (ophalen, toevoegen, bewerken, verwijderen).
- Bestand: [`src/lib/server/repositories/urlRepository.js`](../src/lib/server/repositories/urlRepository.js)
  - Functie: Beheert URL-gegevens en de bijbehorende handmatige checks.
- Bestand: [`src/lib/server/repositories/contentRepository.js`](../src/lib/server/repositories/contentRepository.js)
  - Functie: Ophalen van WCAG-content (principes, richtlijnen, succescriteria) en toolboard-data.
- Bestand: [`src/lib/server/repositories/baseRepository.js`](../src/lib/server/repositories/baseRepository.js)
  - Functie: Basisklasse voor repositories, bevat algemene Directus-interactielogica en foutafhandeling.
- Bestand: [`src/lib/server/index.js`](../src/lib/server/index.js)
  - Functie: Initialiseert de repositories met de Directus-client.

### toolgankelijk-audit

- Bestand: [`src/lib/server/repositories/AuditRepository.js`](../../toolgankelijk-audit/src/lib/server/repositories/AuditRepository.js)
  - Functie: De `AuditRepository` klasse verzorgt de communicatie met Directus voor het opslaan en ophalen van auditresultaten.
- Bestand: [`src/lib/server/services/AuditService.js`](../../toolgankelijk-audit/src/lib/server/services/AuditService.js)
  - Functie: De `AuditService` klasse regelt de hoofdlogica voor het uitvoeren van audits, verwerken van resultaten en aanroepen van repository-methodes.
- Bestand: [`src/routes/api/specifiedUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/specifiedUrls/+server.js)
  - Functie: Endpoint voor het uitvoeren van audits op specifieke partner-urls.
- Bestand: [`src/routes/api/allUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/allUrls/+server.js)
  - Functie: Endpoint voor het uitvoeren van een periodieke audit op alle URLs van alle partners.
- Bestand: [`src/routes/api/isProjectRunning/+server.js`](../../toolgankelijk-audit/src/routes/api/isProjectRunning/+server.js)
  - Functie: Endpoint voor healthcheck van de audit-backend.
- Bestand: [`src/lib/server/utils/ActiveAudits.js`](../../toolgankelijk-audit/src/lib/server/utils/ActiveAudits.js)
  - Functie: De `ActiveAudits` singleton houdt bij welke partners momenteel worden geaudit om dubbele audits te voorkomen.
- Bestand: [`src/lib/server/utils/AuditRunner.js`](../../toolgankelijk-audit/src/lib/server/utils/AuditRunner.js)
  - Functie: De `AuditRunner` voert de daadwerkelijke toegankelijkheids-audit uit op een URL met Puppeteer en axe-core.
- Bestand: [`src/lib/server/utils/RequestRetry.js`](../../toolgankelijk-audit/src/lib/server/utils/RequestRetry.js)
  - Functie: Bevat logica om requests te herhalen bij rate limiting of netwerkfouten.

## CMS Configuratie (Directus)

### Contenttypes

- **Check**: Koppeling tussen een URL en de behaalde succescriteria.
- **EmailDomein**: Toegestane e-maildomeinen voor registratie.
- **EmailVerificatiecode**: Tijdelijke code voor e-mailverificatie bij registratie.
- **Gebruiker**: Gebruikersaccount met e-mail, gebruikersnaam, wachtwoord en verificatiestatus.
- **Niveau**: WCAG-niveau (A, AA, AAA) waaraan succescriteria zijn gekoppeld.
- **Principe**: Hoofdcategorie binnen WCAG, bevat meerdere Richtlijnen.
- **Richtlijn**: Subcategorie binnen een Principe, bevat meerdere Succescriteria.
- **Sessie**: Actieve login-sessie van een gebruiker.
- **Succescriterium**: Concreet toetsingspunt, bevat criteria en makkelijkeCriteria (beide als rich text).
- **Test**: Audit/testresultaat van een URL op een bepaald moment.
- **TestNode**: Detailinformatie over een specifieke bevinding binnen een Test.
- **URL**: Een specifieke pagina van een website, gekoppeld aan een Website.
- **Website**: Bevat algemene info over een partner/website.

## API-documentatie

### toolgankelijk

- **Directus API**: Voor het ophalen en muteren van content.
  - Queries worden uitgevoerd via de repositories in `src/lib/server/repositories`.
  - GraphQL queries zijn te vinden in [`src/lib/server/queries/`](../src/lib/server/queries/).
  - Authenticatie gebeurt via een Bearer token (`VITE_DIRECTUS_KEY`), ingesteld in de `.env` configuratie.
- **Audit API**: `/api/startAudit` stuurt een lijst van URLs en slug naar de audit-backend.
  - Endpoint: [`src/routes/api/startAudit/+server.js`](../src/routes/api/startAudit/+server.js)
  - Methode: `POST`
  - Body: FormData met:
    - `urls`: JSON-string van een array met URLs
    - `slug`: slug van de website
  - Werking: Stuurt een request naar de audit-backend (zie `TOOLGANKELIJK_AUDIT_URL` in `.env`).
- **Partner/URL beheer API's**:
  - Partner toevoegen: [`/api/addPartner`](../src/routes/api/addPartner/+server.js) (`POST`)
  - Partner bewerken: [`/api/editPartner`](../src/routes/api/editPartner/+server.js) (`POST`)
  - Partner verwijderen: [`/api/deletePartner`](../src/routes/api/deletePartner/+server.js) (`POST`)
  - URL toevoegen: [`/api/addUrl`](../src/routes/api/addUrl/+server.js) (`POST`)
  - URL bewerken: [`/api/editUrl`](../src/routes/api/editUrl/+server.js) (`POST`)
  - URL verwijderen: [`/api/deleteUrl`](../src/routes/api/deleteUrl/+server.js) (`POST`)
  - Al deze endpoints accepteren FormData en geven statusupdates terug via Server-Sent Events (SSE).
- **Authenticatie en sessiebeheer**:
  - Sessie wordt beheerd via cookies en gecontroleerd in [`src/hooks.server.js`](../src/hooks.server.js).
  - Gebruikersdata en sessies worden opgeslagen in Directus.

### toolgankelijk-audit

- **/api/specifiedUrls**

  - Methode: `POST`
  - Body:
    ```json
    {
    	"urls": [
    		{ "url": "https://voorbeeld.nl/pagina1", "urlSlug": "pagina1-slug" },
    		{ "url": "https://voorbeeld.nl/pagina2", "urlSlug": "pagina2-slug" }
    	],
    	"websiteSlug": "voorbeeld"
    }
    ```
  - Functie: Ontvangt een lijst van URLs en een websiteSlug, voert audits uit op deze URLs met Puppeteer en axe-core, en schrijft de resultaten terug naar Directus.
  - Response:
    - `200`: Audit succesvol uitgevoerd
    - `409`: Audit is al bezig voor deze partner
    - `500`: Fout tijdens uitvoeren audit

- **/api/allUrls**

  - Methode: `POST`
  - Functie: Start een periodieke audit op alle URLs van alle partners.
  - Body: geen of optioneel configuratie-object
  - Response:
    - `200`: Audit gestart
    - `500`: Fout tijdens uitvoeren audit

- **/api/isProjectRunning**
  - Methode: `GET`
  - Functie: Healthcheck endpoint, geeft aan of de audit-backend actief is.
  - Response:
    - `200`: Backend is actief
    - `503`: Backend is niet bereikbaar

## Overige

- Zie [`README.md`](../README.md) voor een globale uitleg van het project en installatie-instructies.
- Zie [`CONTRIBUTING.md`](../CONTRIBUTING.md) voor richtlijnen over het bijdragen aan dit project, zoals de workflow, code conventies, branching strategy, commit messages en het pull request proces.
