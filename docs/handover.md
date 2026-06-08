# Toolgankelijk Handover

This is the handover of Toolgankelijk made by the team: Miel, Maksim, Joost en Tom

## What is the current status of the project?

The foundation of the application works. Internal users can perform digital accessibility audits on specific partners (built for Vervoerregio Amsterdam). The application is built using a modern, component-driven structure in SvelteKit. However, there is still some technical debt and several front-end bugs that need priority to make the app work perfectly.

Known issues and limitations:

- Adding a partner/URL fails: You currently cannot add a new partner or URL. This is directly related to the recently disabled form elements on the right side of the subheader. The logic or styling here needs to be fixed.

- Pagination: The pagination (navigating between pages of results) is currently broken.

- CSS and Layout bugs: There are unwanted layout shifts in the dropdown menus. When debugging, pay attention to CSS scoping: sometimes Svelte components do not pick up global variables properly, which might require using the :global() modifier.

- Checklist code debt: The code for the checklist feature is messy and needs to be refactored so it fits well with the rest of the component structure.
Mobile responsiveness: There has been no focus on mobile users yet. The interface still needs to be made fully responsive for phones.

- Design integration: The new visual design has only been partially added to the current pages and components.

## What are the main features that already work?

- Performing audits: The core feature for creating and doing audits works.
Progress tracking: Users can clearly see the current status and progress of an active audit.
- Database connection: Data is successfully fetched from the database and shown correctly on the pages.
- Architecture: There is a solid, component-driven base so code can easily be reused.
- Authentication: The login system works and keeps the tool secure.

## What are the biggest points of attention or challenges?

- Implementing the design: Adding the new design consistently across all pages. This should be done using plain Vanilla CSS (without frameworks like Tailwind).

- Bug fixing & Stability: Finding and fixing the current front-end bugs. The existing features need to be 100% reliable and user-friendly before adding big new features.


## What is recommended as a first step for the next team?

First, new developers should read the "Lokale setup installatie" (Local setup installation) section in the documentation to properly set up their development environment. After that, it is highly recommended to study the new design, compare it with the live application, and write down the missing parts and known bugs as clear, small issues on the backlog. This will give everyone a clear overview of the work left to do.


## Sprint Goal (Suggestion for the next sprint)

Set up the local development environment, write concrete issues for the missing design elements, and fix the main blocking front-end bugs (like the partner form and pagination) to ensure a stable base for future development.
