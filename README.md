# Vervoerregio Amsterdam | Toolgankelijk

Live link: [http://toolgankelijk.agency.fdnd.nl/](http://toolgankelijk.agency.fdnd.nl/)

## Inhoudsopgave

- [Description](#description)
- [Features](#features)
- [Design Choices](#DesignChoices)
- [Installation](#installation)
- [Projectteam 2026](#projectteam-2025)
- [Sources](#sources)
- [Licence](#licentie)

## Description

![image](static/readme-images/vvr-logo.png)

Vervoerregio Amsterdam connects munancipilities and works on a ragion where people can achieve their destination easily. The municipalities Aalsmeer, Amstelveen, Amsterdam, Diemen, Edam-Volendam, Haarlemmermeer, Landsmeer, Oostzaan, Ouder-Amstel, Purmerend, Uithoorn, Waterland, Wormerland, Beemster, Purmerend en Zaanstad together forms Vervoerregio Amsterdam. Vervoerregio Amsterdam exist out of 14 munancipilities.

Vervoerregio is a client of the public transportation per bus, tram, metro.

De Vervoerregio is opdrachtgever van het openbaar vervoer per bus, tram en metro. Hiervoor verlenen ze concessies aan vervoerbedrijven en subsidie voor de exploitatie van het openbaar vervoer. Ook investeren ze in nieuwe trams en metro’s.

Toolgankelijk is an ongoing project at FDND-agency that has been developed by alternating teams since 2023. Within this project, a website with an audit tool has been developed, allowing partners of Vervoer Regio Amsterdam to test their websites for accessibility according to EAA legislation. 

Toolgankelijk is een interne webapplicatie ontwikkeld voor de Vervoerregio Amsterdam en haar partners. Met deze tool kunnen zowel medewerkers van de Vervoerregio als medewerkers van partnerorganisaties eenvoudig de digitale toegankelijkheid van partnerwebsites beoordelen en monitoren. De applicatie biedt een centraal overzicht van alle partners, inzicht in de status van hun websites op het gebied van toegankelijkheid, en ondersteunt het gezamenlijk werken aan een toegankelijke digitale omgeving.

![image](static/readme-images/partners-overview.png)

## Kenmerken

This project is made with SvelteKit and the data will be fetched from Hygraph by GraphQL queries. 
The application is hosted by Netlify where the repositry will be automatically deployed.

With the application you can run a performance audit to see which 

Dit project is ontwikkeld door middel van SvelteKit. De inhoud wordt opgehaald uit Hygraph door middel van GraphQL queries.

De applicatie wordt gehost via Netlify, waarbij automatische deploys plaatsvinden bij wijzigingen in de branch. Versiebeheer vindt plaats in deze repository op GitHub.

Daarnaast is er een tweede repository waarin de backend-code voor de auditlogica van partners wordt beheerd. De audit-functionaliteit communiceert met deze externe audit-backend via een API.

Authenticatie en sessiebeheer zijn geïmplementeerd, inclusief e-mailverificatie. De applicatie is ontwikkeld met aandacht voor digitale toegankelijkheid (WCAG) en maakt gebruik van moderne webtechnieken zoals component-based development (Svelte) en GraphQL voor data queries.

Wij hebben de volgende technieken en technologiën gebruikt:

- [Svelte](https://svelte.dev/docs/svelte/overview)
- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [Hygraph](https://hygraph.com/)
- [GraphQL](https://graphql.org/)
- Link naar [Figma](https://www.figma.com/design/djc9IttXBpRtzImK5Wxiwv/Vervoerregio-Amsterdam?node-id=0-1&t=8dC9foJZof3EOqEf-1)
- [Netlify](https://www.netlify.com/)
- [Nodemailer](https://nodemailer.com/)

## Design-Rationale

Bij dit project hoort ook een design rationale. Deze hebben wij zelf gemaakt.
Hierin staat alle nodige informatie voor onze ontwerpkeuzes waar je als designer veel  aan hebt.
Dit is de [design rationale](https://github.com/user-attachments/files/20852123/designrationale_vra_mats_ilias.pdf)
Bekijk deze als eerst, voordat je begint met iets anders. Hierin staat ook een lijst met eventuele werkzaamheden die nog gedaan moeten worden.



## Installatie

```
1. Clone de repository
2. Open de repo in een IDE
3. Installeer npm packages d.m.v. npm install
4. Maak een `.env` bestand aan in de root van het project en vul de benodigde variabelen in (zie `example.env` voor de juiste namen en structuur)
5. Run de localhost d.m.v. npm run dev
```

## Projectteam 2026

- [Maksim](https://github.com/MaksimH2O) – Backend Developer
- [Rick](https://github.com/RickFDND) - Frontend Developer
- [Miel](https://github.com/miel775) - Frontend Developer

## Bronnen

[FDND agency](https://github.com/fdnd-agency/vervoerregio-amsterdam) <br>
[Hygraph mutation](https://hygraph.com/docs/api-reference/content-api/mutations) <br>
[Email verificatie setup met Nodemailer](https://www.youtube.com/watch?v=qa-Sh0iM-kM)<br>

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
