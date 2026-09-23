# Blackbird product website

Complete source for the Blackbird marketing website. This is a buildless static website: the files in `dist/` are both the editable source and the deployable site.

## Run locally

From this folder, run:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Serve over HTTP instead of opening the HTML files directly; asset URLs start at `/`.

## Deploy

Upload the **contents of `dist/`** to the root of a static web host. No build step, packages, environment variables, or API keys are required. Preserve the directory structure. The Pages `/`, `/privacy.html`, and `/terms.html` are standalone HTML pages.

## Files

- `dist/index.html`: homepage content, product previews, TV scoreboard, and setup flow.
- `dist/style.css`: Figtree font definitions, Blackbird colors, responsive layouts, and animation styling.
- `dist/script.js`: scoring preview, product tabs, game descriptions, and capability counters.
- `dist/tv.js`: light/dark TV preview and pause/resume animation controls; respects reduced motion and pauses when hidden or offscreen.
- `dist/dot-grid.js`: interactive background dot field.
- `dist/privacy.html`, `dist/terms.html`: draft legal pages retained for owner review.
- `dist/assets/`: supplied Blackbird logos, locally served Figtree fonts and license, and the original dark TV screenshot.
- `dist/favicon.svg`: Blackbird favicon.

## App and Developer links

The separate scoring application remains at https://blackbird-dart-scoring-system.vercel.app. App links are present in the HTML; update these URLs if the application moves. Authentication is handled by that separate application, not by this static website. There is no website account/session backend in this bundle.

The Developer footer link points to https://github.com/mattsinitiere/blackbird. This ZIP contains the complete marketing website; the separate scoring application's source is in that repository.

## TV preview

The themeable TV preview is HTML/CSS with an SVG dartboard and the example Matt/Sam match from the original screenshot. Both appearances share the same content and dimensions. It is a website demonstration, not a live connected scoreboard. The app's TV route currently forces dark mode; this website's light theme does not modify that separate app. The original dark screenshot is retained in `dist/assets/tv-x01.png` for reference.

## Latest review changes

1. Removed “FIND YOUR GAME”.
2. Added Dark and Light buttons to the TV preview.
3. Removed the screenshot/demo caption.
4. Changed the caption to “BLACKBIRD TV”.
5. Replaced the three setup cards with a connected animated flow, including pause/resume, mobile vertical layout, and reduced-motion support.
6. Added Developer to every page's footer.

## Assets and policies

Blackbird branding was supplied by the owner. Figtree is distributed under the SIL Open Font License; see `dist/assets/OFL-Figtree.txt`. The existing Privacy Policy and Terms of Use remain clearly marked drafts, including the unresolved owner details already identified in them.

No credentials, repository history, private deployment metadata, or user data are included in the distributable ZIP.
