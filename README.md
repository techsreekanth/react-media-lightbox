# react-media-lightbox

Open images and videos in a fullscreen lightbox — one component, zero extra dependencies.

Works with **photos**, **YouTube**, **Vimeo**, and **MP4 files**.

---

## Quick start (3 steps)

### 1. Install

```bash
npm install react-media-lightbox
```

You also need React 18+ (`react` and `react-dom`).

### 2. Import the CSS once

```tsx
import "react-media-lightbox/styles.css";
```

### 3. Copy, paste, run

```tsx
import { useState } from "react";
import { MediaLightbox } from "react-media-lightbox";
import "react-media-lightbox/styles.css";

export default function App() {
  const [open, setOpen] = useState(false);

  const items = [
    { type: "image", src: "/photo1.jpg", title: "Photo 1" },
    { type: "image", src: "/photo2.jpg", title: "Photo 2" },
    { type: "video", src: "https://youtu.be/VIDEO_ID", title: "YouTube video" },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)}>Open gallery</button>

      {open && (
        <MediaLightbox
          items={items}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
```

That is the whole integration. No config file, no provider wrapper, no extra packages.

---

## How it works

| You do this | The lightbox does this |
| --- | --- |
| Set `open` to `true` and render `<MediaLightbox>` | Shows fullscreen overlay |
| Pass an `items` array | Shows image or video for each item |
| Pass `onClose` | Closes on **Esc**, **X button**, or **background click** |
| Add more items | **← / →** keys and "Previous / Next" buttons navigate |

**Video URLs are auto-detected.** Paste a YouTube or Vimeo link — no extra setup.

```tsx
{ type: "video", src: "https://youtu.be/abc123" }   // YouTube
{ type: "video", src: "https://vimeo.com/123456" }  // Vimeo
{ type: "video", src: "/clip.mp4" }                  // MP4 file
```

---

## Common recipes

**Open a specific photo (e.g. user clicked thumbnail #3):**

```tsx
const [open, setOpen] = useState(false);
const [startAt, setStartAt] = useState(0);

<button onClick={() => { setStartAt(2); setOpen(true); }}>View photo 3</button>

{open && (
  <MediaLightbox items={items} initialIndex={startAt} onClose={() => setOpen(false)} />
)}
```

**Show a placeholder when an image fails to load:**

```tsx
<MediaLightbox items={items} onClose={...} fallbackSrc="/no-image.png" />
```

**Next.js App Router** — add `"use client"` at the top of your file (the component already includes it).

---

## Props (optional — defaults work for most apps)

| Prop | Default | What it does |
| --- | --- | --- |
| `items` | — | Your images and videos (required) |
| `onClose` | — | Called when user closes (required) |
| `initialIndex` | `0` | Which item opens first |
| `index` | — | Controlled active slide (use with `onIndexChange`) |
| `fallbackSrc` | — | Image shown if a photo fails to load |
| `showCounter` | `true` | Show `1 / 5` counter |
| `loop` | `true` | Wrap around at first/last item |
| `closeOnOverlayClick` | `true` | Click dark background to close |
| `lockBodyScroll` | `true` | Stop page scrolling while open |
| `className` | — | Extra CSS class on the overlay |
| `onIndexChange` | — | `(index) => void` when slide changes |

---

## Item format

```ts
// Image
{ type: "image", src: "https://...", title: "Optional caption", alt: "Optional alt text" }

// Video (provider is optional — detected from URL)
{ type: "video", src: "https://youtu.be/...", title: "Optional" }
{ type: "video", src: "/video.mp4", poster: "/thumb.jpg" }  // MP4 with poster
```

---

## Styling

Class names start with `rml-` (e.g. `.rml-overlay`, `.rml-closeBtn`). Override them in your CSS **after** importing `react-media-lightbox/styles.css`.

---

## Live demo

Try the free and Pro versions locally:

```bash
npm run demo:install   # first time only
npm run demo           # opens http://localhost:5173
```

The demo includes a **Free** tab (core lightbox) and a **Pro** tab (thumbnail strip).

---

## Pro package (preview)

**Thumbnail strip** is available now in `pro/` as `react-media-lightbox-pro`:

```tsx
import { MediaLightboxPro } from "react-media-lightbox-pro";
import "react-media-lightbox/styles.css";
import "react-media-lightbox-pro/styles.css";

{open && (
  <MediaLightboxPro
    items={items}
    initialIndex={0}
    onClose={() => setOpen(false)}
    showThumbnails={true}
  />
)}
```

Optional `thumb` on any item overrides the auto-generated preview:

```ts
{ type: "image", src: "/full.jpg", thumb: "/small.jpg", title: "Product" }
```

Build the Pro package: `npm run build:pro`

---

## Premium features (roadmap)

| Status | Feature | Why people pay |
| --- | --- | --- |
| **Available** | **Thumbnail strip** | Faster browsing in large albums |
| Planned | Pinch & double-tap zoom | Product photos, portfolios, real estate |
| Planned | Slideshow mode | Auto-advance with timer, pause on hover |
| Planned | Deep links | Share `yoursite.com/gallery#photo-4` |
| Planned | Download & share buttons | Stock sites, wedding galleries, press kits |
| Planned | Custom themes pack | Match site branding without writing CSS |
| Planned | Fullscreen API | True browser fullscreen on desktop |
| Planned | Image preloading | No flash when navigating |
| Planned | Captions & EXIF panel | Photography sites |
| Planned | Before/after slider | Renovation, beauty, fitness comparisons |
| Planned | PDF viewer | Brochures, menus, catalogs |
| Planned | Analytics hooks | Track views and engagement |
| Planned | Commercial license | SaaS and client projects |

**Suggested pricing model:** free MIT core + **Pro npm package** or **one-time license**.

Interested in Pro? [Open an issue](https://github.com/techsreekanth/react-media-lightbox/issues) or email the author listed in `package.json`.

---

## License

MIT — free for personal and open-source projects. See [LICENSE](./LICENSE). Pro add-ons are licensed separately — see [pro/LICENSE](./pro/LICENSE).
