# Dreams Career Site

## Project notes

### New starter social graphic generator

- Nuxt route: `/new-starter`
- Page implementation: `nuxt-craft-app/frontend/pages/new-starter.vue`
- Page-only styles: `nuxt-craft-app/frontend/assets/css/social-graphic-generator.css`
- Craft query: `nuxt-craft-app/frontend/queries/socialGraphicGenerator.mjs`
- Secure image endpoint: `nuxt-craft-app/frontend/server/api/social-graphic-image.get.js`

The page is based on `frontend-design/build/new-starter.html`, but only its generator-specific CSS and JavaScript behaviour were carried into Nuxt. The shared Nuxt header and footer are supplied by the `application` layout.

Craft CMS supplies the branded graphics from the `socialGraphicGenerator` section. Each nested `images_Entry` must return its `id`, `title`, and first `image` asset so every option has a unique single-selection value.

User flow:

1. Upload a local headshot or photo. The image remains in the browser and can be removed or replaced.
2. Select one branded graphic. Selecting another graphic replaces the previous selection.
3. The selected graphic and uploaded photo are composed into a 590×590 canvas preview.
4. Once both are present, the combined image can be downloaded as a JPEG.

Craft assets are loaded into the canvas through the same-origin `/api/social-graphic-image` endpoint. This avoids browser canvas/CORS failures while restricting requests to the origin configured by `CRAFT_URL`, accepting image responses only, and rejecting declared files larger than 20 MB.

The page and server endpoint pass the Nuxt production build. The repository still reports unrelated pre-existing asset/CSS build warnings.

### Homepage scroll video iOS fallback

- Homepage route: `/`
- Homepage markup: `nuxt-craft-app/frontend/pages/index.vue`
- Source JS: `frontend-design/src/js/main.js`
- Built static JS: `frontend-design/build/js/main.js`
- Nuxt-served JS: `nuxt-craft-app/frontend/public/js/main.js`
- Cache-busting config: `nuxt-craft-app/frontend/nuxt.config.js`

The homepage scroll experience injects muted `<video>` elements into each `.pin-section` and scrubs `currentTime` with GSAP/ScrollTrigger. For iPhone/Safari versions before iOS 17, the setup now adds iOS-safe inline playback attributes (`muted`, `playsinline`, `webkit-playsinline`), primes the first video with a guarded muted play/pause, waits on metadata as well as loaded data, and catches transient seek errors while Safari prepares the media.

The page markup references mobile MP4 paths, but this checkout currently only includes tablet and desktop MP4 files in `nuxt-craft-app/frontend/public/video`. The loader now falls back from mobile to tablet/desktop sources so missing mobile files do not leave a blank scroll section. After changing the source JS, run `npx gulp js` from `frontend-design`, then copy `frontend-design/build/js/main.js` to `nuxt-craft-app/frontend/public/js/main.js`.

Script query strings were bumped to `1.0.10698` in `nuxt.config.js` so mobile browsers fetch the updated bundle. Verification used `npx gulp js`, `npm run build` from `nuxt-craft-app/frontend`, `node --check nuxt-craft-app/frontend/public/js/main.js`, and `git diff --check`.
