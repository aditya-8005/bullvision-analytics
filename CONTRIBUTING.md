# Contributing to BullVision

Thank you for your interest in contributing to BullVision! We welcome contributions from the community to help make stock market analytics more accessible and powerful.

## 🤝 How Can I Contribute?

- **Reporting Bugs:** Create an issue describing the bug, how to reproduce it, and your environment.
- **Suggesting Enhancements:** Open an issue with a detailed explanation of the feature and its potential benefits.
- **Code Contributions:** Submit Pull Requests (PRs) for bug fixes or new features.

---

## 🌿 Branch Naming Convention

Please follow this format when creating branches:
- **Feature:** `feat/your-feature-name`
- **Bug Fix:** `fix/issue-description`
- **Refactor:** `refactor/what-was-changed`
- **Docs:** `docs/documentation-update`

Example: `feat/add-rsi-indicator`

---

## 📝 Commit Style (Conventional Commits)

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps us generate automated changelogs.

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests

Example: `feat(analytics): implement CAGR calculation for event models`

---

## 🔀 Pull Request Process

1. **Fork the Repository:** Create your own fork and branch off `main`.
2. **Write Clean Code:** Ensure your code follows the existing style. Run `npm run lint` before committing.
3. **Write Tests:** If adding a backend feature, add corresponding tests in `BACKEND/tests`.
4. **Update Documentation:** If you add an endpoint, update `docs/API.md`.
5. **Submit PR:** Point your PR to our `main` branch. Provide a clear description of the problem and the solution.

---

## 💻 Coding Standards

### Frontend (React)
- **Hooks & Components:** Use functional components and React hooks exclusively.
- **Types:** Use strict TypeScript. Avoid `any`. Define interfaces in `src/types`.
- **CSS:** Use TailwindCSS utility classes. Avoid creating custom CSS unless absolutely necessary (e.g., complex animations).
- **Structure:** Place feature-specific logic inside `src/features/`. Do not clutter the global `src/components/` folder.

### Backend (Node.js)
- **Architecture:** Follow the Controller-Service pattern. Controllers handle HTTP (Req/Res), Services handle business logic.
- **Validation:** Always use Zod for payload validation in the `middlewares/validate.js` layer.
- **Secrets:** Never log passwords or full API error objects. Always pass errors to `next(error)` for the global error handler to scrub.

## 📂 Folder Organization

When adding files, adhere to the strict separation of concerns outlined in our `ARCHITECTURE.md`. Do not create new top-level directories without discussing it in an issue first.
