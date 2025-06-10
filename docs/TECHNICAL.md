# Technische Documentatie

## Projectstructuur

Het project bestaat uit twee samenwerkende applicaties:

- **toolgankelijk/**: De front-end applicatie voor partners en beheerders.
- **toolgankelijk-audit/**: De backend auditservice voor automatische toegankelijkheidscontroles.

### toolgankelijk/

- **src/routes/**: Bevat alle pagina's en route-logica (SvelteKit).
- **src/lib/components/**: Herbruikbare Svelte-componenten zoals `Heading`, `Checklist`, en `Sidebar`.
- **src/lib/queries/**: GraphQL query-functies voor communicatie met het CMS (Hygraph).
- **static/**: Statische assets zoals afbeeldingen.
- **docs/**: Documentatiebestanden.

### toolgankelijk-audit/

- **src/lib/server/**: Backend-logica, repositories en auditservices.
- **src/routes/api/**: REST API-endpoints voor audit-acties.
- **src/routes/**: SvelteKit-routes voor statuspagina's en documentatie.

## Samenwerking tussen de projecten

- **toolgankelijk** beheert partners, websites, urls en toegankelijkheidschecks via een Hygraph CMS.
- **toolgankelijk-audit** voert periodiek of op verzoek automatische WCAG-audits uit op URLs van partners.
- De front-end start een audit via een API-call naar de auditservice in `toolgankelijk-audit`.
- Auditresultaten worden via GraphQL-mutations teruggeschreven naar Hygraph, zodat de front-end direct de actuele status kan tonen.

## Belangrijke Componenten

### toolgankelijk

- Bestand: [`src/lib/components/checklist.svelte`](../src/lib/components/checklist.svelte)
  - Functie: Toont de toegankelijkheids-checklist per principe.
  - Werking: Ontvangt `richtlijnen` en `toolboardData` als props en rendert de checklist-items.
- Bestand: [`src/lib/components/heading.svelte`](../src/lib/components/heading.svelte)
  - Functie: Toont de titel en navigatie van de huidige pagina.
- Bestand: [`src/lib/components/sidebar.svelte`](../src/lib/components/sidebar.svelte)
  - Functie: Navigatie tussen principes en urls binnen een website.
- Bestand: [`src/lib/components/addForm.svelte`](../src/lib/components/addForm.svelte)
  - Functie: Formuliercomponent voor het toevoegen, bewerken en verwijderen van partners en URLs, en het starten van audits.
- Bestand: [`src/lib/components/partner.svelte`](../src/lib/components/partner.svelte)
  - Functie: Toont een partnerkaart met relevante informatie, voortgang en acties.
- Bestand: [`src/lib/components/websites.svelte`](../src/lib/components/websites.svelte)
  - Functie: Overzicht van alle websites/partners, inclusief voortgangsindicatie.
- Bestand: [`src/lib/components/loader.svelte`](../src/lib/components/loader.svelte)
  - Functie: Toont voortgangs- en statusupdates tijdens lange bewerkingen (zoals partner/url toevoegen).
- Bestand: [`src/lib/queries/partner.js`](../src/lib/queries/partner.js)
  - Functie: GraphQL-query voor het ophalen van partnergegevens en bijbehorende URLs.
- Bestand: [`src/lib/queries/website.js`](../src/lib/queries/website.js)
  - Functie: GraphQL-query voor het ophalen van gegevens van een specifieke website/partner.
- Bestand: [`src/lib/queries/toolboard.js`](../src/lib/queries/toolboard.js)
  - Functie: GraphQL-query voor het ophalen van checklist- en principegegevens.
- Bestand: [`src/lib/utils/sitemap.js`](../src/lib/utils/sitemap.js)
  - Functie: Bevat hulpfuncties voor het ophalen, crawlen en verwerken van sitemaps en URLs van partnersites.
- Bestand: [`src/routes/api/addPartner/+server.js`](../src/routes/api/addPartner/+server.js)
  - Functie: API-endpoint voor het toevoegen van een partner, inclusief het ophalen van URLs via sitemap of crawling.
- Bestand: [`src/routes/api/editPartner/+server.js`](../src/routes/api/editPartner/+server.js)
  - Functie: API-endpoint voor het bewerken van partnergegevens en bijbehorende URLs.
- Bestand: [`src/routes/api/deletePartner/+server.js`](../src/routes/api/deletePartner/+server.js)
  - Functie: API-endpoint voor het verwijderen van een partner en alle bijbehorende URLs en checks.
- Bestand: [`src/routes/api/addUrl/+server.js`](../src/routes/api/addUrl/+server.js)
  - Functie: API-endpoint voor het toevoegen van een losse URL aan een partner.
- Bestand: [`src/routes/api/editUrl/+server.js`](../src/routes/api/editUrl/+server.js)
  - Functie: API-endpoint voor het bewerken van een bestaande URL.
- Bestand: [`src/routes/api/deleteUrl/+server.js`](../src/routes/api/deleteUrl/+server.js)
  - Functie: API-endpoint voor het verwijderen van een URL.
- Bestand: [`src/routes/api/startAudit/+server.js`](../src/routes/api/startAudit/+server.js)
  - Functie: API-endpoint dat een audit start voor opgegeven URLs bij de audit-backend.

### toolgankelijk-audit

- Bestand: [`src/lib/server/repositories/AuditRepository.js`](../../toolgankelijk-audit/src/lib/server/repositories/AuditRepository.js)
  - Functie: Data-opslag en ophalen van auditresultaten in Hygraph.
- Bestand: [`src/lib/server/services/AuditService.js`](../../toolgankelijk-audit/src/lib/server/services/AuditService.js)
  - Functie: Logica voor het uitvoeren van audits, verwerken van resultaten en aanroepen van repository-methodes.
- Bestand: [`src/routes/api/specifiedUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/specifiedUrls/+server.js)
  - Functie: Endpoint voor het uitvoeren van audits op specifieke partner-urls.
- Bestand: [`src/routes/api/allUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/allUrls/+server.js)
  - Functie: Endpoint voor het uitvoeren van een periodieke audit op alle URLs van alle partners.
- Bestand: [`src/routes/api/isProjectRunning/+server.js`](../../toolgankelijk-audit/src/routes/api/isProjectRunning/+server.js)
  - Functie: Endpoint voor healthcheck van de audit-backend.
- Bestand: [`src/lib/server/utils/ActiveAudits.js`](../../toolgankelijk-audit/src/lib/server/utils/ActiveAudits.js)
  - Functie: Singleton die bijhoudt welke partners momenteel worden geaudit, voorkomt dubbele audits.
- Bestand: [`src/lib/server/utils/AuditRunner.js`](../../toolgankelijk-audit/src/lib/server/utils/AuditRunner.js)
  - Functie: Voert de daadwerkelijke toegankelijkheids-audit uit op een URL met Puppeteer en axe-core.
- Bestand: [`src/lib/server/utils/RequestRetry.js`](../../toolgankelijk-audit/src/lib/server/utils/RequestRetry.js)
  - Functie: Bevat logica om GraphQL requests te herhalen bij rate limiting of netwerkfouten.

## CMS Configuratie (Hygraph)

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

### Koppeling met de Front-end

- Queries worden gedefinieerd in [`src/lib/queries`](../src/lib/queries).
- Data wordt opgehaald in de `+page.server.js` files per route, bijvoorbeeld [`src/routes/[websiteUID]/[urlUID]/[principeUID]/+page.server.js`](../src/routes/[websiteUID]/[urlUID]/[principeUID]/+page.server.js).
- De opgehaalde data wordt als property doorgegeven aan de Svelte componenten in de `+page.server.js` load functies.

## API-documentatie

### toolgankelijk

- **Hygraph GraphQL API**: Voor het ophalen en muteren van content.
  - Queries worden uitgevoerd via de `hygraph.request(query)` methode.
  - Voorbeeld van een query: zie [`getQueryToolboard`](../src/lib/queries/toolboard.js).
  - De GraphQL queries en mutations zijn te vinden in [`src/lib/queries`](../src/lib/queries).
  - Authenticatie gebeurt via een Bearer token, ingesteld in [`src/lib/utils/hygraph.js`](../src/lib/utils/hygraph.js).
  - Voorbeelden van veelgebruikte queries:
    - Partner- en websitegegevens: [`getQueryPartner`](../src/lib/queries/partner.js), [`getQueryWebsite`](../src/lib/queries/website.js)
    - URL's toevoegen/bewerken/verwijderen: [`getQueryAddUrl`](../src/lib/queries/addUrl.js), [`getQueryUpdateUrl`](../src/lib/queries/updateUrl.js), [`getQueryDeleteUrl`](../src/lib/queries/deleteUrl.js)
    - Checklists en principes: [`getQueryToolboard`](../src/lib/queries/toolboard.js), [`getQueryPrincipes`](../src/lib/queries/principes.js)
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
  - Gebruikersdata en sessies worden opgeslagen in Hygraph via GraphQL.

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
  - Functie: Ontvangt een lijst van URLs en een websiteSlug, voert audits uit op deze URLs met Puppeteer en axe-core, en schrijft de resultaten terug naar Hygraph.  
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

**Zie ook:**  
- Auditlogica: [`src/lib/server/services/AuditService.js`](../../toolgankelijk-audit/src/lib/server/services/AuditService.js)  
  - De [`AuditService`](../../toolgankelijk-audit/src/lib/server/services/AuditService.js) klasse regelt de hoofdlogica voor het uitvoeren van audits, het verwerken van resultaten en het aanroepen van repository-methodes.  
- Resultaatopslag: [`src/lib/server/repositories/AuditRepository.js`](../../toolgankelijk-audit/src/lib/server/repositories/AuditRepository.js)  
  - De [`AuditRepository`](../../toolgankelijk-audit/src/lib/server/repositories/AuditRepository.js) klasse verzorgt de communicatie met Hygraph voor het opslaan en ophalen van auditresultaten.  
- Singleton auditstatus: [`src/lib/server/utils/ActiveAudits.js`](../../toolgankelijk-audit/src/lib/server/utils/ActiveAudits.js)  
  - [`ActiveAudits`](../../toolgankelijk-audit/src/lib/server/utils/ActiveAudits.js) houdt bij welke partners momenteel worden geaudit en voorkomt dubbele audits.  
- Audit uitvoeren: [`src/lib/server/utils/AuditRunner.js`](../../toolgankelijk-audit/src/lib/server/utils/AuditRunner.js)  
  - [`AuditRunner`](../../toolgankelijk-audit/src/lib/server/utils/AuditRunner.js) voert de daadwerkelijke toegankelijkheids-audit uit op een URL met Puppeteer en axe-core.  
- Request retry-logica: [`src/lib/server/utils/RequestRetry.js`](../../toolgankelijk-audit/src/lib/server/utils/RequestRetry.js)  
  - [`RequestRetry`](../../toolgankelijk-audit/src/lib/server/utils/RequestRetry.js) bevat logica om GraphQL requests te herhalen bij rate limiting of netwerkfouten.

- Endpoint-implementatie:  
  - Specifieke URLs auditen: [`src/routes/api/specifiedUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/specifiedUrls/+server.js)  
  - Alle URLs periodiek auditen: [`src/routes/api/allUrls/+server.js`](../../toolgankelijk-audit/src/routes/api/allUrls/+server.js)  
  - Status/healthcheck endpoint: [`src/routes/api/isProjectRunning/+server.js`](../../toolgankelijk-audit/src/routes/api/isProjectRunning/+server.js)

## Overige

- Zie [`README.md`](../README.md) voor een globale uitleg van het project en installatie-instructies.
- Zie [`CONTRIBUTING.md`](../CONTRIBUTING.md) voor richtlijnen over het bijdragen aan dit project, zoals de workflow, code conventies, branching strategy, commit messages en het pull request proces.
