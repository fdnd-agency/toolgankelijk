<img width="148" height="96" alt="image" src="https://github.com/user-attachments/assets/90978157-84ea-4ad4-a8ae-0b14ea7ac14e" />

# Vervoerregio Amsterdam | Toolgankelijk

## Contents

- Description
- Features
- Design Choices
- Component Library
- Datamodel
- Installation
- Projectteam 2026
- Sources
- Licence

## Description

Vervoerregio Amsterdam connects munancipilities and works on a ragion where people can achieve their destination easily. The municipalities Aalsmeer, Amstelveen, Amsterdam, Diemen, Edam-Volendam, Haarlemmermeer, Landsmeer, Oostzaan, Ouder-Amstel, Purmerend, Uithoorn, Waterland, Wormerland, Beemster, Purmerend en Zaanstad together forms Vervoerregio Amsterdam. Vervoerregio Amsterdam exist out of 14 munancipilities.

Vervoerregio is a client of the public transportation per bus, tram, metro.

Toolgankelijk is an ongoing project at FDND-agency that has been developed by alternating teams since 2023. Within this project, a website with an audit tool has been developed, allowing partners of Vervoer Regio Amsterdam to test their websites for accessibility according to EAA legislation.

With the application you can run a performance audit, to check the status of your website. After you run the test it you will see the results of the automatically tests. There are some audits you have to check manually. There is a second repositry. When you need to run a performance audit make sure you run this in the background.

<img width="1440" height="1047" alt="ss-1" src="https://github.com/user-attachments/assets/7081892e-c2bb-454a-b21e-a1baa9466636" />


## Design System

<img width="468" height="964" alt="ss-2" src="https://github.com/user-attachments/assets/c225ae09-b53b-415d-82ff-3d502209d0fd" />


This design system serves as the blueprint for the visual direction of the application within this project. It defines design decisions, style elements, and reusable components, creating a clear and consistent foundation for the further development of the product. In this way, the team can work from the same design principles, making it easier to add new features without compromising the overall consistency and coherence of the application.

[Design System figma file](https://www.figma.com/design/u9GyhD6jIajigsWlHYBuWj/Design-System---Vervoerregio-Amsterdam?node-id=1-830&t=IC3XiL7krvLuWoKn-1)

## Design Choises

This is the most up to date design of the application with the design system implemented in Figma. It reflects the current visual direction and the agreed design choices for the project. However, the design still needs to be implemented into the official application, meaning the next step is to translate these Figma components and styles into the working product so that the interface fully aligns with the defined design system.

**Homepage**
<img width="1440" height="1047" alt="ss-3" src="https://github.com/user-attachments/assets/c59f7bde-9630-4492-99df-ed44dab8e386" />


By applying a layout grid and a fixed color palette to the homepage, it already looks much more structured than before. The new design has not yet been fully implemented on the home page, but it is clearly moving in the right direction.

**Partner Cards**
<img width="624" height="196" alt="ss-4" src="https://github.com/user-attachments/assets/ae96d4d7-50aa-4919-b271-ddc218a37132" />



By only adjusting the color palette, the card already feels and looks much less cluttered and more balanced. The reduced contrast and more consistent use of colors help improve readability and create a calmer visual structure, making the content easier to scan and understand.

**URL screen**
<img width="1440" height="1047" alt="ss-5" src="https://github.com/user-attachments/assets/bc600802-c130-428d-8cea-6ea2ba8d681a" />

I have changed the flow of the website by combining the URL screen with the WCAG (Web Content Accessibility Guidelines). This improves the overall understandability of the application and creates a more logical and streamlined user experience. By bringing these elements together, users no longer need to switch between separate sections, which reduces friction and makes the navigation more intuitive. As a result, the information is easier to access and the structure of the application feels more coherent and consistent.

**Checklist**
<img width="1440" height="1047" alt="ss-6" src="https://github.com/user-attachments/assets/4ead4855-7e1f-43ac-9bc7-4e6cbdd55fe6" />

The overall checklist page was already in a strong state before I joined the project. The only necessary improvement was adding the option to switch between simplified language and the official language. By centralising this setting in one place, the checklist feels less cluttered and more focused, which improves the overall clarity and user experience.

## Component Library

The Component Library is build up according the atomic design rule here are the most important component. Here you see some descriptions of how the components look like in the web application.

**Header and sub header**

<img width="1460" height="98" alt="image 1" src="https://github.com/user-attachments/assets/a4e20bd6-1997-4482-bdde-d95d2efb65a1" />


<img width="1460" height="172" alt="image 2" src="https://github.com/user-attachments/assets/92769cd4-f095-4b5b-9e9e-fa6902a1ebbd" />


The header is updated to match the style of the newly designed version of the tool. Additionally, the header must be disabled on the login page, and the hamburger menu should be built using progressive enhancement (PE).

The subheader displaying navigation elements for partners and URLs, which includes breadcrumbs, a search tool, an "add a partner" button, and filtering capabilities (note: not all features will be fully functional yet). Specifically, on the principle page, the subheader needs to display filtering options for all levels and principles.

**Card**

<img width="1346" height="376" alt="image 3" src="https://github.com/user-attachments/assets/fa6e9c21-f95d-4831-a011-41f7f0910d22" />


The card component provides a quick, clear summary for a specific partner or URL. Displayed directly on both the partner and URL overview pages, it automatically loads the partner's profile photo and highlights their current accessibility test score at a glance.

**Dialog**


<img width="1102" height="838" alt="image 4" src="https://github.com/user-attachments/assets/1078cb9b-1996-4f6c-949c-ef77d8d94b32" />


The dialog component is a fully refactored pop-up modal that matches our latest Figma designs and successfully replaces a large amount of legacy code. It appears whenever you need to start, edit, or delete an audit. 

It is also used for adding new URLs and partners, providing a simple form to collect the name and URL, displaying helpful tip messages, and offering a convenient option to automatically fetch a sitemap during the process.

**Breadcrumb**

<img width="562" height="390" alt="image 5" src="https://github.com/user-attachments/assets/94bb274f-a9f6-4fd8-bfb2-d293f9ebb071" />


The Breadcrumb shows where you are located on the tool. It is a combination of a breadcrumb and dropdown function. You can navigate to all partner/urls by using the breadcrumbs. This has been fully tested on Progressive Enhancement as if the dropdown still works without using JavaScript.

## Other Pages

The login page has seen an massive design overhaul, allowing for a more welcoming appearance. 

<img width="2928" height="1436" alt="image 6" src="https://github.com/user-attachments/assets/e74e68fa-637c-486b-ac07-f535362806ef" />

The account page has seen an overhaul too, now an user can signout and see their account details like email and username.

<img width="2928" height="1436" alt="image 7" src="https://github.com/user-attachments/assets/cafff072-45b7-4c40-8706-9a19b11ff602" />

The info page displaying information about how to tool work and why you should appply.

<img width="2928" height="1436" alt="image 8" src="https://github.com/user-attachments/assets/15c662e3-fb42-4cfc-8a6c-f8e53b81073a" />


## Datamodel

<a href="docs/ERD.svg">
  <img src="docs/ERD.svg" alt="Public ERD for Toolgankelijk" width="900">
</a>

Full size: `docs/ERD.svg`

Source: `docs/ERD-public.mmd`

## Installation

```
1. Clone de repository
2. Open de repo in een IDE
3. Installeer npm packages d.m.v. npm install
4. Maak een `.env` bestand aan in de root van het project en vul de benodigde variabelen in (zie `example.env` voor de juiste namen en structuur)
5. Run de localhost d.m.v. npm run dev
```

## Projectteam 2026

- Tom - CMD student
- Maksim – Backend Developer
- Joost - Frontend Developer
- Miel - Frontend Developer

## Sources 💡

- Svelte
- FDND agency
- Email verificatie setup met Nodemailer
- SvelteKit
- Directus
- Figma
- Netlify
- Atomic Design System

## License

This project is licensed under the terms of the MIT license.
