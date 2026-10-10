# Copilot instructions for swissystem7.github.io

## Stack
Primary language: HTML. Top-level files: .github, .nojekyll, PROFILE_README.md, favicon.svg, index.html.

## Build / test / lint
- No package manifest detected: verify changes by opening the HTML pages and checking the browser console for errors.
Always run the relevant checks above before opening a PR and report results in the PR body.

## Conventions
- Keep changes small and focused: one issue = one Draft PR.
- Branch prefix: `copilot/`. Never push to `master` and never merge.
- Follow existing code style and folder structure; don't add new dependencies without explaining why.
- Never commit secrets, tokens, or .env files.
- Write or update tests when changing logic; update README when behavior changes.