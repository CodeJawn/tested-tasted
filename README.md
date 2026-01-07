# Tested & Tasted

Tested & Tasted is a lightweight recipe search tool that helps you find recipes from **trusted, high-quality cooking websites** in one place.

Instead of searching the entire internet, Tested & Tasted limits results to a curated list of recipe sources known for reliable testing, clear instructions, and dependable results.

The site is static, fast, and designed to be easy to maintain.

---

## How it works

- Users type a recipe or ingredient into a single search box
- The site builds a Google search query restricted to trusted recipe domains
- Results open in Google, filtered to only those curated sources
- Users can customize which sources are included, and their preferences are saved in the browser

No scraping, no backend, and no accounts required.

---

## Project structure

```
/
  index.html          Home page
  sources.html        Customize Sources page
  assets/
    sources.json      Curated list of trusted recipe sites
    icons/            Site logos used on the home page
  js/
    app.js            Shared utilities (loading sources, storage, search logic)
    home.js           Home page behavior
    sources.js        Customize Sources behavior
```

---

## Managing trusted sources

All trusted recipe sites are defined in:

```
assets/sources.json
```

Each source includes:

- `id`: Stable unique identifier
- `name`: Display name
- `domain`: Domain used in the Google `site:` filter
- `icon`: Path to the site logo
- `homepage`: Boolean controlling whether the logo appears on the home page

Example:

```json
{
  "id": "seriouseats",
  "name": "Serious Eats",
  "domain": "seriouseats.com",
  "icon": "assets/icons/seriouseats.svg",
  "homepage": true
}
```

New sources are enabled by default for existing users.

---

## User preferences

User source selections are stored locally in the browser using `localStorage`.

- Preferences persist across sessions
- No user data is sent anywhere
- Clearing browser storage resets selections

---

## Local development

Because the site loads JSON with `fetch()`, it must be served from a local web server.

Recommended:

- Open the project folder in VS Code
- Use the Live Server extension to run the site locally

---

## Deployment

Tested & Tasted is designed to be hosted on **GitHub Pages**.

- No build step required
- No backend services
- Push to the main branch and GitHub Pages handles the rest
