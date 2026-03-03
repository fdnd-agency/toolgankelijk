# Vervoerregio Amsterdam | Toolgankelijk

![example event parameter](https://github.com/github/docs/actions/workflows/main.yml/badge.svg?event=push)

Live link: [http://toolgankelijk.agency.fdnd.nl/](http://toolgankelijk.agency.fdnd.nl/)

## Contents

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

Toolgankelijk is an ongoing project at FDND-agency that has been developed by alternating teams since 2023. Within this project, a website with an audit tool has been developed, allowing partners of Vervoer Regio Amsterdam to test their websites for accessibility according to EAA legislation. 

![image](static/readme-images/partners-overview.png)

## Features

This project is made with SvelteKit and the data will be fetched from Directus. The framework is updated from sveltekit version 4 to 5.
The application is hosted by Netlify where the repositry will be automatically deployed.

With the application you can run a performance audit, to check the status of your website. After you run the test it you will see the results of the automatically tests. There are some audits you have to check manually. There is a second [repositry](https://github.com/fdnd-agency/toolgankelijk-audit). When you need to run a performance audit make sure you run this in the background.

Authentication and session are implented with email verification included. The application is developed in mind of the digital accesbillity (WCAG) and uses the modern web technics. Only authors with the email @toolgankelijk are able to login to the system.

Sources
- [Svelte](https://svelte.dev/docs/svelte/overview)
- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [Directus](https://directus.io/docs/)
- [Figma](https://www.figma.com/design/AcoAfiRyevwqXLmdBrbxtG/Toolgankelijk?node-id=18-42&t=vePCwpOn8RYkWthI-1)
- [Netlify](https://www.netlify.com/)

## New Design

One of the epics of this project is to implent the new design over the old design which is working fully on the Responsive, Accesbillity, Perfromance and Progressive Enhancement principles. The styleguide we use for the design is imported from this [styleguide](https://github.com/fdnd-agency/toolgankelijk/blob/main/Vervoerregio%20Handboek_Huisstijl_v5_2025_LR.pdf).

## Installation

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

## Sources

[FDND agency](https://github.com/fdnd-agency/vervoerregio-amsterdam) <br>
[Email verificatie setup met Nodemailer](https://www.youtube.com/watch?v=qa-Sh0iM-kM)<br>

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
