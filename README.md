# Trump vs. Biden — Tic Tac Toe (React + Vite)

## Quick start on Replit
1. Create a new Repl using the **React (Vite)** template (or Node.js and paste these files).
2. Upload this project (all files) into your repl.
3. Put your real assets into `public/`:
   - `public/tb.jpg`
   - `public/prize.webp`
4. Click **Run**. If prompted for a command, use: `npm run dev`

## Local dev
```bash
npm install
npm run dev
```

## Build & Preview
```bash
npm run build
npm run preview
```

## Notes
- Tailwind styles are loaded via **CDN** in `index.html` to keep setup minimal.
- The game flow is: Prelander → Game → Thank-you (only on win). Loss/draw triggers a popup with replay/exit.
- If `window.close()` is blocked by the browser, the app redirects to the same URL.
