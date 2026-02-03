# Contributing Guidelines

Dankjewel voor je interesse in bijdragen aan dit project! Deze richtlijnen zorgen ervoor dat de codekwaliteit hoog blijft en dat iedereen op een gestandaardiseerde manier samenwerkt. Lees dit document door voordat je begint!

---

## Inhoudsopgave

- [Team afspraken](#team-afspraken)
- [Quick Start](#quick-start)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Issues & Projectbord](#issues--projectbord)
- [Testen](#testen)
- [Definition of Ready](#definition-of-ready)
- [Definition of Done](#definition-of-done)
- [Post Mortem](#post-mortem)
- [Code Conventions](#code-conventions)
- [Tot slot](#tot-slot)

---

## Team afspraken
- Houd je aan de afspraken/code conventies gemaakt in de contributing.md
- We organiseren dagelijks een stand ups.
- Rick werkt maandag, woensdag, vrijdag mee aan het project.
- Alle branches worden gemerged naar de dev-branch
- Documentatie van de Sprint Reviews word genoteerd in issues
- We gebruiken 1 taal in het project.
- Aan het einde van elke sprint een retrospect (retromat).

---

## Quick Start
We volgen de **Git Flow workflow** als branching strategie. Dit betekent dat:
- Maak een feature branch aan vanaf `dev` (commit nooit direct naar `main` of `dev`).
- Gebruik duidelijke branchnamen: `feature/...`, `fix/...`, `docs/...`.
- Gebruik altijd kleine letters voor je branche bijv: "feature/component-name".
- Gebruik [Conventional Commits](https://www.conventionalcommits.org) voor commit messages.
- Open Pull Requests (PR’s) altijd naar `dev`, niet naar `main`.
- Koppel je werk aan een issue op het projectbord.
- Houd Pull Requests klein en zorg dat ze worden gereviewd en goedgekeurd voordat ze worden gemerged.

Voor meer visuele informatie over de Git Flow workflow, zie [GitKraken Git Flow](https://www.gitkraken.com/learn/git/git-flow#the-git-flow-workflow).

---

## Commit Messages

We hanteren conventionele commits die niet alleen helpen bij een overzichtelijke historie, maar ook bij het automatisch bepalen van versienummers volgens Semantic Versioning. Houd bij het schrijven van commitberichten de volgende structuur aan:

```plain
[commit-type]: [beschrijving-van-commit-inhoud] #[issue-nummer]
```

### Toegestane Commit Types

- **build:** Veranderingen die het build systeem of externe dependencies beïnvloeden.
- **chore:** Updates aan de build process of extra tools en bibliotheken, zoals documentatie generatie.
- **ci:** Wijzigingen aan CI-configuratiebestanden en scripts (bijv. GitHub Actions, netlify.toml).
- **docs:** Aanpassingen aan documentatie (bijv. README.md, Handover.md, design rationale).
- **feat:** Toevoegen van een nieuwe feature.
- **fix:** Oplossen van bugs, stijl- of layout-problemen.
- **perf:** Wijzigingen die de performance verbeteren.
- **refactor:** Aanpassingen die de structuur of leesbaarheid verbeteren zonder functionaliteit toe te voegen of te repareren.
- **style:** Wijzigingen die de leesbaarheid of de vormgeving verbeteren (zoals formatteren, inspringen, nieuwe regels).
- **test:** Toevoegen of corrigeren van tests.

### Commit Strategie

- **Frequent committen:** Commit vaak en op een logisch punt, zodat iedere belangrijke verandering vastgelegd wordt.
- **Referentie naar issues:** Verwijs in je commitmessage naar de betreffende issue door `#[issue-nummer]` toe te voegen.
- **Optionele Gitmoji:** Gebruik gitmoji's als visuele aanvulling op je commit message. Bijvoorbeeld:

  ```plaintext
  refactor: Deduplicated marker popup creation to helper function 🧑‍💻 #23
  style: Formatting toegepast in src bestanden #91
  feat: animals uit de database worden nu opgehaald en weergegeven in de dropdown #213
  fix: header font maat veranderd 🐛 #394
  ```

Meer info:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [use gitmoji in commit messages](https://gitmoji.dev/)
- [Semantic versioning](https://semver.org/)
- [Mastering commit messages](https://www.madewiththeforce.com/commit-messages/)

---

## Pull Requests
- Open altijd een PR naar de `dev`-branch.
- Houd PR’s klein en gefocust.
- Review je eigen code voordat je om een review vraagt.
- Geef context in de beschrijving (wat en waarom).
- Teamgenoten moeten de PR reviewen en goedkeuren voordat deze wordt gemerged.

## Pull request template
- What does this change?
- How Has This Been Tested?
    - [ ] [User test]()
    - [ ] [Accessibility test]()
    - [ ] [Performance test]()
    - [ ] [Responsive Design test]()
    - [ ] [Device test]()
    - [ ] [Browser test]()
- Images
- How to review

Meer info:  
[Helping others review your changes](https://github.com/isaacs/github/issues/29)

---

## Issues & Projectbord
We beheren al het werk via GitHub issues die zijn gekoppeld aan het projectbord.

**Soorten issues:**
- **Feature** – nieuwe functionaliteit of component
- **Bug** – fix voor een fout
- **Taak** – ondersteunend werk (refactoring, styling, setup)
- **Documentatie** – README-updates, overdracht, notities

**Structuur:**
- Grote doelen → opgesplitst in **epics → user stories → taken**
- Elke issue moet:
  - Duidelijk zijn en klein genoeg om snel af te ronden
  - Toegewezen zijn aan een teamlid
  - Gekoppeld zijn aan het projectbord
 
---

## Testen

Testen is een essentieel onderdeel van bijdragen aan dit project. Elke wijziging moet worden getest om kwaliteit, performance en toegankelijkheid te waarborgen.

### Functioneel testen
- Controleer of nieuwe en bestaande functionaliteiten correct werken.
- Voeg unit- en/of integratietests toe of werk deze bij waar van toepassing.
- Zorg dat er geen regressies worden geïntroduceerd.

### Performance
- Houd rekening met de impact op performance (bijv. grote afbeeldingen, zware scripts).
- Voer performancechecks uit wanneer relevant.
- Optimaliseer assets waar mogelijk.

### Toegankelijkheid (A11y)
- Volg basisrichtlijnen voor toegankelijkheid (WCAG).
- Zorg dat keyboard-navigatie correct werkt.
- Controleer kleurcontrast en leesbaarheid.
- Voorzie afbeeldingen van betekenisvolle alt-teksten.

### Responsiveness & browser-tests
- Test layouts op verschillende schermformaten.
- Controleer functionaliteit in gangbare browsers.
- Los layout- of interactieproblemen op wanneer deze worden gevonden.

### Validatie
- Valideer HTML/CSS waar van toepassing.
- Los validatiefouten en waarschuwingen op.

### Gebruikersonderzoek / UX
- Controleer of content en interacties duidelijk en intuïtief zijn.
- Zorg voor een logische opbouw en flow.
- Voeg context of begeleiding toe waar nodig.

---

## Definition of Ready 

De Definition of Ready beschrijft de afspraken binnen het Scrumteam die bepalen wanneer een item klaar is om opgepakt te worden tijdens een sprint. Dit helpt het team om efficiënter te werken en sneller waarde te leveren, doordat user stories van voldoende kwaliteit zijn voordat de ontwikkeling start.

Bron: [Wat is de Definition of Ready? | Agile Scrum Group](https://agilescrumgroup.nl/wat-is-definition-of-ready/)

Een item is *Ready* wanneer:
- Er een (globaal) ontwerp beschikbaar is in Figma, indien nodig
- De story is besproken en ingeschat (story poker gepland)
- De MoSCoW-methode is toegepast
- De user story het juiste format gebruikt  
  *(Als [rol] wil ik [functionaliteit], zodat [doel])*


## Definition of Done 

De Definition of Done is een checklist die aangeeft wanneer een taak, user story of feature als afgerond wordt beschouwd. Dit voorkomt discussie over wat “klaar” betekent en zorgt voor consistente kwaliteit binnen het team.

Bron: [Wat is Definition of Done? | Agile Scrum Group](https://agilescrumgroup.nl/wat-is-definition-of-done/)

Een item is *Done* wanneer:
- De functionaliteit is getest
- De taak volledig is afgerond
- De code voldoet aan de afgesproken code conventies
- De wijzigingen zijn gemerged naar de `dev`-branch
- Er een werkende live-link is naar de `dev`-omgeving

---

## Post-mortem

Een post-mortem wordt uitgevoerd wanneer het team moet reflecteren op samenwerkings- of procesproblemen.

We doen een post-mortem wanneer:
- Een teamlid afspraken niet nakomt
- Een teamlid onvoldoende communiceert
- Een teamlid structureel geen werk oplevert
---

## Code Conventions

Volg in dit project de code conventies zoals die ook worden toegepast binnen het project. Enkele belangrijke punten:

- **The Girl / Boy Scout Rule:** Zorg ervoor dat je bij elke commit de code achterlaat in een iets betere staat dan je hem aantrof. Zelfs kleine verbeteringen zijn waardevol.
- **Leesbaarheid en onderhoudbaarheid:** Schrijf code met het oog op toekomstige wijzigingen en zorg dat nieuwe code altijd consistent is met de bestaande codebase.
- **Documentatie:** Zorg dat alle belangrijke methodes en logica gedocumenteerd zijn zodat andere ontwikkelaars makkelijk de code kunnen begrijpen.

---

## Tot slot

Wij waarderen iedere bijdrage die leidt tot een betere codebase en een verbeterde werkomgeving voor het team. Volg deze richtlijnen zorgvuldig om ervoor te zorgen dat jouw bijdragen naadloos integreren in het project.

Voor alle conventies en de volledige werkwijze van FDND Agency, zie ook de [FDND Agency conventies](https://github.com/fdnd-agency/.github/wiki/Workflow-conventions).

Bedankt voor je inzet en veel succes met bijdragen!

Happy coding!  
_FDND Agency_
