# Movies watch list

A React app with separate JSX and CSS files. Add and remove movies, write or edit reviews, choose 1–5 stars, and display the rating using ⭐ emojis. Movies are stored in localStorage in the current browser.

## Run

Install Node.js 20.19+ or 22.12+, then open a terminal in this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Opening index.html directly will not run JSX.

## Build

```sh
npm run build
npm run preview
```

## Files

- `index.html` — page shell
- `src/main.jsx` — React entry point
- `src/App.jsx` — components and movie state
- `src/style.css` — styling
- `package.json` — dependencies and commands

Google Fonts are optional; the app falls back to Arial when offline. Browser storage can be cleared by browser settings. The app displays a notice when saving is unavailable.

The provided assignment states that AI is not permitted for React-related work. This project contains AI-generated React code; follow your course rules when using it.

## Ready-to-run Windows package
Portable Node.js and npm are included in tools. Double-click START.bat to run the app, then keep the terminal open. BUILD.bat rebuilds the production files. Dependencies are included; no separate installation is required. This package targets Windows x64. Fonts use local fallbacks and do not require a download.
