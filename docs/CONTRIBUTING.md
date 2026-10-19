# Contributing Guidelines

Thank you for your interest in contributing to this project! These guidelines help keep code quality high and make sure everyone collaborates in a standardized way. Please read this document before you get started!

---

## Table of Contents

- [Team Agreements](#team-agreements)
- [Quick Start](#quick-start)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Issues & Project Board](#issues--project-board)
- [Testing](#testing)
- [Definition of Ready](#definition-of-ready)
- [Definition of Done](#definition-of-done)
- [Post-mortem](#post-mortem)
- [Code Conventions](#code-conventions)
- [Wrapping Up](#wrapping-up)

---

## Team Agreements
- Stick to the agreements and code conventions defined in this CONTRIBUTING.md.
- We hold daily stand-ups.
- All branches are merged into the `dev` branch.
- Sprint Review documentation is recorded in issues.
- We use one language throughout the project.
- At the end of every sprint we hold a retrospective (Retromat).

**Team Canvas**

<img width="905" height="639" alt="image" src="https://github.com/user-attachments/assets/e3a7ad68-53d8-4924-b987-f951f553de34" />

---

## Quick Start
We follow the **Git Flow workflow** as our branching strategy. This means:
- Create a feature branch from `dev` (never commit directly to `main`).
- Use clear branch names: `feature/...`, `fix/...`, `docs/...`.
- Always use lowercase for your branch names, e.g. `feature/component-name`.
- Use [Conventional Commits](https://www.conventionalcommits.org) for commit messages.
- Always open Pull Requests (PRs) against `dev`, not `main`.
- Link your work to an issue on the project board.
- Keep Pull Requests small and make sure they are reviewed and approved before they are merged.

For a more visual explanation of the Git Flow workflow, see [GitKraken Git Flow](https://www.gitkraken.com/learn/git/git-flow#the-git-flow-workflow).

---

## Commit Messages

We use conventional commits, which not only keep the history clear but also help automatically determine version numbers according to Semantic Versioning. Use the following structure when writing commit messages:

```plain
[commit-type]: [description-of-commit-content] #[issue-number]
```

### Allowed Commit Types

- **build:** Changes that affect the build system or external dependencies.
- **chore:** Updates to the build process or auxiliary tools and libraries, such as documentation generation.
- **ci:** Changes to CI configuration files and scripts (e.g. GitHub Actions, netlify.toml).
- **docs:** Changes to documentation (e.g. README.md, Handover.md, design rationale).
- **feat:** Adding a new feature.
- **fix:** Fixing bugs, styling or layout issues.
- **perf:** Changes that improve performance.
- **refactor:** Changes that improve structure or readability without adding or fixing functionality.
- **style:** Changes that improve readability or formatting (such as formatting, indentation, new lines).
- **test:** Adding or correcting tests.

### Commit Strategy

- **Commit frequently:** Commit often and at logical points, so every significant change is recorded.
- **Reference issues:** Reference the relevant issue in your commit message by adding `#[issue-number]`.
- **Optional Gitmoji:** Use gitmojis as a visual addition to your commit message. For example:

  ```plaintext
  refactor: Deduplicated marker popup creation to helper function 🧑‍💻 #23
  style: Applied formatting to src files #91
  feat: animals are now fetched from the database and shown in the dropdown #213
  fix: changed header font size 🐛 #394
  ```

More info:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Use gitmoji in commit messages](https://gitmoji.dev/)
- [Semantic Versioning](https://semver.org/)
- [Mastering commit messages](https://www.madewiththeforce.com/commit-messages/)

---

## Pull Requests
- Always open a PR against the `dev` branch.
- Keep PRs small and focused.
- Review your own code before requesting a review.
- Provide context in the description (what and why).
- Teammates must review and approve the PR before it is merged.

## Pull Request Template
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

More info:  
[Helping others review your changes](https://github.com/isaacs/github/issues/29)

---

## Issues & Project Board
We manage all work through GitHub issues linked to the project board.

**Issue types:**
- **Feature** – new functionality or component
- **Bug** – fix for an error
- **Task** – supporting work (refactoring, styling, setup)
- **Documentation** – README updates, handover, notes

**Structure:**
- Large goals → broken down into **epics → user stories → tasks**
- Every issue must:
  - Be clear and small enough to complete quickly
  - Be assigned to a team member
  - Be linked to the project board

---

## Testing

Testing is an essential part of contributing to this project. Every change must be tested to ensure quality, performance and accessibility.

### Functional testing
- Check that new and existing functionality works correctly.
- Add or update unit and/or integration tests where applicable.
- Make sure no regressions are introduced.

### Performance
- Consider the impact on performance (e.g. large images, heavy scripts).
- Run performance checks when relevant.
- Optimize assets where possible.

### Accessibility (A11y)
- Follow basic accessibility guidelines (WCAG).
- Make sure keyboard navigation works correctly.
- Check color contrast and readability.
- Provide images with meaningful alt text.

### Responsiveness & browser testing
- Test layouts on different screen sizes.
- Check functionality in common browsers.
- Fix layout or interaction issues when they are found.

### Validation
- Validate HTML/CSS where applicable.
- Resolve validation errors and warnings.

### User research / UX
- Check that content and interactions are clear and intuitive.
- Ensure a logical structure and flow.
- Add context or guidance where needed.

---

## Definition of Ready

The Definition of Ready describes the agreements within the Scrum team that determine when an item is ready to be picked up during a sprint. This helps the team work more efficiently and deliver value faster, because user stories are of sufficient quality before development starts.

Source: [What is the Definition of Ready? | Agile Scrum Group (Dutch)](https://agilescrumgroup.nl/wat-is-definition-of-ready/)

An item is *Ready* when:
- A (rough) design is available in Figma, if needed
- The story has been discussed and estimated (story poker scheduled)
- The MoSCoW method has been applied
- The user story uses the correct format  
  *(As a [role] I want [functionality], so that [goal])*

When the item is ready, you can place the item from the `Backlog` column to the `ToDo` column in the project board.

## Definition of Done

The Definition of Done is a checklist that indicates when a task, user story or feature is considered complete. This prevents discussion about what "done" means and ensures consistent quality within the team.

Source: [What is the Definition of Done? | Agile Scrum Group (Dutch)](https://agilescrumgroup.nl/wat-is-definition-of-done/)

An item is *Done* when:
- The functionality has been tested
- The task has been fully completed
- The code follows the agreed code conventions
- The changes have been merged into the `dev` branch
- There is a working live link to the `dev` environment


When the item is ready, you can place the item from the `To review` column to the `Done` column in the project board.

---

## Post-mortem

A post-mortem is held when the team needs to reflect on collaboration or process issues.

We hold a post-mortem when:
- A team member does not keep to agreements
- A team member does not communicate sufficiently
- A team member structurally does not deliver work

---

## Code Conventions

Follow the code conventions already applied within this project. Some key points:

- **The Girl / Boy Scout Rule:** With every commit, leave the code in a slightly better state than you found it. Even small improvements are valuable.
- **Readability and maintainability:** Write code with future changes in mind and make sure new code is always consistent with the existing codebase.
- **Documentation:** Make sure all important methods and logic are documented so other developers can easily understand the code.

---

## Wrapping Up

We value every contribution that leads to a better codebase and an improved working environment for the team. Follow these guidelines carefully to make sure your contributions integrate seamlessly into the project.

For all conventions and the full workflow of FDND Agency, see also the [FDND Agency conventions](https://github.com/fdnd-agency/.github/wiki/Workflow-conventions).

Thanks for your effort and good luck contributing!

Happy coding!  
_FDND Agency_
