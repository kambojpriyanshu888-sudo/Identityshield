# IdentityShield

A browser-based digital identity safety workspace for checking suspicious messages, comparing supplied profile details, and organising a response.

**Live website:** https://identityshield-priyanshu.vercel.app/

**Author:** Priyanshu Kamboj

## Features

- **Message and link checks:** explainable signals for requests for passwords, OTPs or identity documents; urgent language; payment requests; and suspicious link structure or domain mismatches.
- **Profile comparison:** compare the display names, usernames, biographies and contact emails you supply.
- **Response plans:** scenario-specific checklists, incident notes and links to official reporting channels.
- **Downloadable summaries:** export a check, response plan or incident summary as a text file.
- **Saved checks:** save up to 50 summaries in this browser and delete them when needed.
- **Responsive interface:** mobile navigation, labelled inputs, keyboard-accessible controls and inline SVG icons.

## Run the website

This project uses plain HTML, CSS and JavaScript. There are no application dependencies, API keys, environment variables, database setup or build commands.

### Quick preview

Open `index.html` in a modern browser. For consistent browser storage behaviour, use a local web server as described below.

### Local web server

If Python 3 is installed, open a terminal in this project's folder and run:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

On Windows, you can also use:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Then open http://localhost:8000/ in your browser. Press `Ctrl+C` in the terminal to stop the server.

## Upload to GitHub

1. Extract the downloaded ZIP and open the `identityshield` folder.
2. Go to https://github.com/new and create a repository named `identityshield`. Choose **Public** if you want anyone to view your code.
3. On an empty repository, select **uploading an existing file**. In an existing repository, use **Add file → Upload files**.
4. Drag the **contents** of the extracted `identityshield` folder into the upload area. `index.html` and `README.md` should be directly in the repository root.
5. Commit the uploaded files with a message such as `Add IdentityShield website`.

Upload the extracted source files; uploading only the ZIP will keep the code inside an archive. Include `.gitignore` and `.nojekyll` when selecting the files.

### Upload with Git instead

After creating an empty GitHub repository, run these commands from this project's folder. Replace `YOUR_GITHUB_USERNAME` with your actual username.

```bash
git init
git add .
git commit -m "Add IdentityShield website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/identityshield.git
git push -u origin main
```

## Optional: publish with GitHub Pages

The existing Vercel website is already public. To also publish this copy with GitHub Pages:

1. Open the GitHub repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/(root)` folder, then save.
4. Wait for GitHub's deployment to finish and use the website address shown on that page.

All local asset references are relative, so the website also works under a repository subpath. The included `.nojekyll` file supports direct static publication. No framework build is needed.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | HTML entry point, navigation and shared page containers |
| `styles.css` | Layout, colours, typography, responsive styles and animations |
| `engine.js` | Message/link checks, profile similarity and saved-summary sanitisation |
| `app.js` | Page rendering, sample scenarios, forms, history, downloads and interaction handlers |
| `favicon.svg` | IdentityShield browser-tab icon |
| `.nojekyll` | Static publishing support for GitHub Pages |
| `.gitignore` | Excludes local environment files, editor state and generated folders |
| `README.md` | Setup, GitHub upload instructions and project explanation |

The five website source files are the complete, unchanged files served by the live deployment when this export was prepared on 16 November 2026. Documentation and repository housekeeping files were added for this download.

## How the checks work

`engine.js` exposes `IdentityEngine` in the browser. It also exports the same functions through CommonJS for inspection with Node.js.

Message checks match text against predefined patterns and inspect URLs with the browser's `URL` parser. Signals receive weights. A total weight of at least 6 produces **Strong warning signs**; a smaller score with at least one signal produces **Some warning signs**; no signals produces **No clear warning signs**.

Profile comparison uses normalised strings and edit-distance similarity for names, usernames and biographies, together with supplied email differences and message signals. Profile URLs are checked for valid format; the app does not retrieve their contents.

There is no trained machine learning model, generative AI service or external training dataset in this version. The fictional examples are written directly in `app.js`. No dataset download is required to run or reproduce the project.

## Data and privacy

Analysis runs in the visitor's browser. The application does not send entered messages or profiles to an analysis server, open submitted links, follow redirects or retrieve social profiles.

Only summaries explicitly saved by the user go into `localStorage`, under `identityshield.history.v1`. Those saved summaries retain signal descriptions and checked domains, but omit the original message, original profile inputs and per-signal evidence snippets. Clearing browser data removes saved summaries. Form entries, incident notes and checklist progress are held in memory for the current page session.

Downloaded incident reports can contain notes and check evidence when the user chooses to export them. These files remain under the user's control.

The page requests DM Sans and Manrope from Google Fonts when online and uses CSS fallback fonts when unavailable. The web host and font provider can receive ordinary network request metadata. Official reporting links open their respective external websites when clicked.

## Scope and limitations

The results are heuristic warning signals. They can miss harmful content or flag legitimate content. They do not establish account ownership, prove impersonation, verify that a website is safe or confirm that an account has been compromised.

The response checklist records progress marked by the user. IdentityShield does not change account settings, contact organisations or submit a complaint on the user's behalf.

## Useful references

- [GitHub: adding files to a repository](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [GitHub: configuring a Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

