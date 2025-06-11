# Contributing Guidelines

Dankjewel voor je interesse in bijdragen aan dit project! Deze richtlijnen zorgen ervoor dat de codekwaliteit hoog blijft en dat iedereen op een gestandaardiseerde manier samenwerkt. Lees dit document door voordat je begint!

---

## Inhoudsopgave

- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Conventions](#code-conventions)

---

## Branching Strategy

We volgen de **Git Flow workflow** als branching strategie. Dit betekent dat:

- **Nieuwe branches:** Maak nieuwe branches altijd aan vanaf de `dev` branch (of een andere voorgeschreven baselijn) met een duidelijke naamgeving.

  Gebruik voor features het patroon:

  ```bash
  feature/[issue-nummer]/[korte-beschrijving]
  ```

  Voor bugfixes gebruik je het patroon:

  ```bash
  bugfix/[issue-nummer]/[korte-beschrijving]
  ```

- **Naamgevingsconventie:** Gebruik korte, maar duidelijke namen zodat meteen duidelijk is waarvoor de branch dient.

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

## Pull Request Process

Pull Requests (PR’s) worden gebruikt om wijzigingen samen te voegen in branches. Volg de onderstaande stappen om een effectieve PR aan te maken en te reviewen:

1. **Kleine PR’s:** Houd je PR's klein en to the point; dit maakt het reviewproces gemakkelijker.
2. **Schrijf een goede PR beschrijving:**
   - Geef context over wat er is veranderd.
   - Verwijs naar relevante issues.
   - Geef duidelijk aan waarom de wijziging nodig is.
3. **Review je eigen PR eerst:** Bekijk je eigen werk opnieuw om eventuele onduidelijkheden of fouten te corrigeren.
4. **Vraag om feedback:** Nadat je je eigen review hebt gedaan, vraag collega’s om mee te helpen door een PR review.
5. **Gebruik het Pull Request Template:** Maak gebruik van het automatisch beschikbare PR-template dat in elk van onze repositories aanwezig is.

Meer info:  
[Helping others review your changes](https://github.com/isaacs/github/issues/29)

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
