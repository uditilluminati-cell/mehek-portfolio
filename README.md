# Udit Punjabi — Portfolio

AI Engineer & Builder. Live at **https://uditilluminati-cell.github.io/udit-portfolio/**

## Deploy / update

This repo auto-deploys via GitHub Pages on every push to `main`.

To update:
1. Edit files in this folder
2. `git add . && git commit -m "update" && git push`
3. Pages rebuilds in ~30–60 seconds

## Local preview
Open `index.html` directly in a browser, OR run:
```
python -m http.server 5173
```
then visit http://localhost:5173

## Update the portrait
Replace `assets/udit.jpg` with a new square photo (800x800 recommended).

## Files
- `index.html`   - markup
- `styles.css`   - design system + animations + responsive
- `script.js`    - cursor, magnetic preview, scramble, spotlight
- `assets/`      - portrait, AI artwork, project screenshots
- `netlify.toml` - config (if deploying to Netlify instead)
