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
