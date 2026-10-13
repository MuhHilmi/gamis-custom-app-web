# AGENTS.md

## Purpose

This file defines how AI coding agents should work in this Next.js / React project. Follow these instructions when analyzing, implementing, testing, and documenting changes.

## 1. Start by Understanding the Project

Before making changes:

1. Inspect the repository structure and identify the app's architecture.
2. Read `package.json` and the available lockfile to understand the package manager, scripts, and dependencies.
3. Check for existing project guidance, including other `AGENTS.md` files, `README.md`, configuration files, and relevant documentation.
4. Identify whether the project uses the Next.js App Router (`app/`) or Pages Router (`pages/`), and follow the existing convention.
5. Review nearby components, utilities, styles, and tests before editing related code.
6. If important context is missing, ask a concise clarifying question rather than making risky assumptions.

Do not assume a directory structure, dependency, script, or framework version without checking the repository.

## 2. Plan Before Implementing

For non-trivial work:

1. Restate the goal and identify the expected behavior.
2. Locate the relevant files and trace the affected code paths.
3. Consider edge cases, accessibility, performance, security, and compatibility.
4. Make a short implementation plan.
5. Keep the change focused on the requested outcome.

For small, straightforward changes, proceed directly while still checking the relevant context.

## 3. Coding Standards

- Follow the conventions already established in the repository.
- Prefer clear, maintainable, readable code over clever or unnecessarily abstract solutions.
- Use TypeScript if the project already uses it; do not migrate JavaScript files to TypeScript unless requested or clearly necessary.
- Give components, functions, variables, and types descriptive names.
- Keep components and functions focused on a single responsibility.
- Reuse existing components, hooks, utilities, and design patterns where appropriate.
- Avoid duplicated logic, speculative abstractions, and premature optimization.
- Avoid `any` in TypeScript unless there is a clear reason and the usage is safely contained.
- Handle loading, empty, success, and error states where relevant.
- Do not leave dead code, unused imports, debugging statements, or temporary workarounds.
- Add comments when they explain intent or non-obvious constraints; do not narrate self-explanatory code.
- Avoid adding dependencies when existing project capabilities are sufficient. Explain why a new dependency is needed.

## 4. Next.js and React Practices

- Follow the project's installed Next.js and React versions; verify version-specific APIs before using them.
- Respect the existing router architecture. Do not mix App Router and Pages Router patterns without a clear project requirement.
- In the App Router, prefer Server Components by default. Add the `"use client"` directive only when client-side interactivity, browser APIs, state, or effects require it.
- Keep client-side JavaScript and client component boundaries as small as practical.
- Do not use React hooks in Server Components.
- Use `next/link` for internal navigation and the project's established image approach, such as `next/image`, where appropriate.
- Follow existing conventions for route handlers, server actions, data fetching, caching, metadata, and error handling.
- Do not expose secrets or private server-only values to client components or public environment variables.
- Avoid unnecessary `useEffect` calls when derived state, server-side data loading, or event handlers are more appropriate.
- Use stable and meaningful React keys when rendering lists.
- Keep forms accessible, validate untrusted input, and provide useful feedback for validation and submission errors.
- Follow the project's styling system (for example, CSS Modules, Tailwind CSS, or another existing solution) rather than introducing a competing system without approval.

## 5. Architecture and Scope

- Preserve the existing architecture unless the task explicitly calls for a structural change.
- Prefer the smallest complete change that solves the problem.
- Do not rewrite unrelated files or perform broad refactors as part of a focused task.
- Avoid changing public APIs, route behavior, database schemas, environment variable names, or package versions unless required.
- Do not overwrite user changes. Inspect the working tree and relevant diffs before editing when Git is available.
- Never delete files or data merely because they appear unused; confirm their role first.
- If a requested change has significant trade-offs, explain them before proceeding when practical.

## 6. Security and Privacy

- Never hard-code credentials, API keys, access tokens, or other secrets.
- Never commit `.env` files or reveal secret values. Use the project's established environment-variable pattern and update example files with placeholders only when needed.
- Treat user input, URL parameters, API responses, and external content as untrusted.
- Validate data at appropriate boundaries and enforce authorization on the server, not only in the UI.
- Avoid unsafe HTML rendering and injection-prone APIs. If raw HTML is essential, sanitize it using an appropriate existing or approved solution.
- Do not log passwords, tokens, sensitive personal data, or confidential payloads.
- Do not weaken authentication, authorization, Content Security Policy, validation, or other security controls just to make a test pass.
- Do not run destructive commands, deploy, publish packages, or modify production data without explicit authorization.

## 7. Accessibility and User Experience

- Use semantic HTML elements and appropriate labels for form controls.
- Ensure interactive controls are keyboard accessible and have clear focus states.
- Provide meaningful alternative text for informative images; use empty alternative text for purely decorative images where appropriate.
- Do not rely on color alone to communicate important information.
- Preserve responsive behavior and check layouts at common viewport sizes when relevant.
- Follow existing design tokens and UI conventions for consistent spacing, typography, and colors.
- Provide useful loading, empty, success, and error feedback for user-facing flows.

## 8. Testing and Validation

After making changes:

1. Run the most relevant tests available in the repository.
2. Run the configured lint, type-check, and build commands when practical.
3. Inspect the final diff for accidental changes, unrelated formatting, unused code, and security issues.
4. If a command cannot run, state why; do not claim it passed.
5. If tests fail, determine whether the failure is related to the change. Fix relevant failures and report unrelated failures clearly.
6. Add or update tests for new behavior and bug fixes when the project has an appropriate testing setup.

Check `package.json` before choosing commands. Use the package manager indicated by the lockfile and repository conventions. Common scripts may include:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

These are examples, not guaranteed scripts. Do not invent scripts or report commands as successful unless they were actually executed.

## 9. Dependencies and Configuration

- Prefer the package manager and lockfile already used by the project.
- Do not switch package managers or regenerate unrelated lockfiles.
- Review dependency and configuration changes carefully.
- Avoid upgrading major versions unless explicitly requested or necessary.
- Explain any new dependency, environment variable, or configuration requirement.
- Preserve existing lint, formatting, TypeScript, and build conventions.

## 10. Documentation

- Update relevant documentation when behavior, setup, configuration, or commands change.
- Document new environment variables using placeholder values, never real secrets.
- Keep examples consistent with the current implementation.
- Do not claim functionality is implemented unless it exists and has been validated to the extent possible.

## 11. Communication and Delivery

When completing a task, provide a concise summary that includes:

- What changed and why.
- Important files or areas affected.
- Tests and validation commands actually run, with their results.
- Any known limitations, unresolved issues, or follow-up work.

Ask questions when requirements are ambiguous and the choice could materially affect architecture, security, data, or user-visible behavior. Otherwise, make a reasonable, low-risk assumption and state it when relevant.

## 12. Definition of Done

A task is complete when:

- The requested behavior is implemented.
- The solution follows the project's existing conventions.
- Relevant tests and checks have been run where practical.
- No unrelated changes or known avoidable security issues remain.
- Necessary documentation is updated.
- The final response accurately describes the changes and validation results.

---

## Agent Operating Rule

**Inspect first, plan when needed, implement narrowly, validate honestly, and summarize clearly.** Preserve existing project behavior unless the requested task requires changing it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
