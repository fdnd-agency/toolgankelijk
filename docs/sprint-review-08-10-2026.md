Today, Thursday 8 October 2026, we had an on-location sprint review with the Product Owner and stakeholders: Tijn van Zijl, Mark Werkman, and Nienke de Keijzer (UX expert).

**Roles**

- Seb: Team lead
- Tin: Presenter
- Sieuwke: Note taker

We presented our completed work and received detailed and useful feedback. The following action points came out of the sprint review.

### Style guide / Stylesheet
- [ ] Add a HEX code alongside every HSL color code.
- [ ] Not all color combinations meet WCAG accessibility requirements. Create a clear overview of which colors can be used together.
- [ ] Dark mode is a _Could_ rather than a Must.

### Breadcrumbs / Filters
- [ ] Move the current breadcrumbs into a filter menu and add labels to each input.
- [ ] Add labels to all inputs, including the '+' inputs for adding a URL or partner.
- [ ] Align all `select`-elements with 2em spacing between them.

### Success / Error / Loading States
- [ ] Add a close button to success and error messages so users can manually dismiss them.
- [ ] The loading state can be larger and displayed inside the button. The button is allowed to change size when the loading state is shown.
- [ ] When saving a form, the form should be stateless. When saving the form again, only the loading state needs to be displayed; the success/error state does not need to be shown.

### Checklist Page
- [ ] Make sure that when guidelines and criteria are expanded/collapsed, the screen reader announces the change. This is a change of content/context.
- [ ] Add lines underneath newly added criteria as part of the styling.
- [ ] When a guideline has no criteria, do not hide the guideline. Instead, show an empty state indicating that there are no criteria at this level. The guideline should also not be expandable in this state.

### Aside
- [ ] Add numbers to the aside so users can see the order of the principles.
- [ ] Update the styling of the aside to match the Figma design.

### Agenda
- [ ] Send the agenda points before the meeting for future sprint reviews.

We will process all the feedback from the sprint review and turn it into issues. These issues will be added to our backlog so we can work on them in upcoming sprints.
