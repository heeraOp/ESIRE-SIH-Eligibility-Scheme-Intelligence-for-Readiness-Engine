# PAANGBA frontend redesign

This update applies a distinctive editorial visual system inspired by Manipur's textile geometry and landscape: warm ivory surfaces, deep ink-blue, restrained brick red, saffron and leaf-green accents, serif display headings, and subtle woven-line motifs.

## Updated design files
- `src/index.css` — shared design tokens, typography and base styles
- `src/Pages/Landup.css` — responsive landing page
- `src/Pages/Scheme-Dashboard.css` — shared signed-in layout, sidebar, header and scheme discovery layout
- `src/Components/Schemes.css` — scheme cards
- `src/Components/Profile.css` — profile form
- `src/Pages/SchemeShow.css` — scheme detail page
- `src/Pages/Documents.css` — document library
- `src/Pages/Help.css` — help and FAQ page
- `src/Pages/Settings.css` — settings and account controls
- `src/Pages/Authentication/Login.css` — login / OTP screen
- `src/Pages/Authentication/Signup.css` — multi-step signup screen

The existing JSX, routes, API calls, authentication flow, and translation context were retained to reduce the risk of breaking existing functionality. Several pages intentionally share global design tokens while keeping page-specific layouts.

## Run locally
```bash
npm ci
npm run dev
```

Note: a production build could not be verified in this environment because Vite was not available after dependency installation timed out. Run `npm ci` in your local project and then `npm run build` to verify against your installed environment.
