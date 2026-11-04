# Rules and guidelines
- always use shadcn ui for frontends
- use cli to install shadcn ui compoents
- use cli to install shadcn ui themes
- use cli to install shadcn ui icons
- use cli to install shadcn ui fonts
- components of pages should be in feature folders in components directory- pages should be only have this code
```
export default function Home() {
    return <Home />
    }
```
- each file should only doing one thing
- do not commit .env files except for .env.example
- use already the existing templates in shadcn ui for sidebar and header.
- git commit and push after every change and task
- make github bot as contributor and reviewer
- check also the acceptance criteria for the task and for each issue
- Each file should have maximum of ~200 lines of codes only, if it passes 200 lines of codes, it should then be broken down into smaller files. Separate the files in another directory from the main files that calls it.
- no unnecessary comments

# Components
## Header
- use cli to install shadcn ui header component

## Footer
- use cli to install shadcn ui footer component

## Sidebar
- use cli to install shadcn ui sidebar component

## Navbar
- use cli to install shadcn ui navbar component

## Card
- use cli to install shadcn ui card component

## Button
- use cli to install shadcn ui button component

## Modal
- use cli to install shadcn ui modal component

## Table
- use cli to install shadcn ui table component

## Tabs
- use cli to install shadcn ui tabs component

## Accordion
- use cli to install shadcn ui accordion component

## Drawer
- use cli to install shadcn ui drawer component

## Alert
- use cli to install shadcn ui alert component

## Badge
- use cli to install shadcn ui badge component

## Breadcrumb
- use cli to install shadcn ui breadcrumb component

## Collapse
- use cli to install shadcn ui collapse component

## Dropdown
- use cli to install shadcn ui dropdown component

## ListGroup
- use cli to install shadcn ui list

## Agent skills

### Issue tracker

Issues live as GitHub issues in this repo, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
