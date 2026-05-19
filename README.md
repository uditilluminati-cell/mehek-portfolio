# Mehek Duseja — Portfolio

## Deploy to Netlify

### Option 1 — Drag and drop (easiest)
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the drop zone
3. Done in ~30 seconds — Netlify gives you a live URL

### Option 2 — Connect a GitHub repo
1. Push this folder to a GitHub repo
2. Netlify → New site → Import from Git → Pick the repo
3. Auto-deploys on every push

## Local preview
Open `index.html` directly in a browser, OR run:
```
python -m http.server 5173
```
then visit http://localhost:5173

## Update Mehek's photo
Replace `assets/mehek.jpg` with a new square photo (800x800 recommended).

## Files
- `index.html`  - markup
- `styles.css`  - design system + all animations
- `script.js`   - cursor, magnetic preview, scramble, spotlight, etc.
- `assets/`     - photos, screenshots, design samples
- `netlify.toml` - deployment config
