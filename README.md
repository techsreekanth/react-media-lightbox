# react-media-lightbox

A lightweight, dependency-free React lightbox for **images and video** in a single component. Supports YouTube, Vimeo, and self-hosted video files, with keyboard navigation, looping, a loading spinner, image fallbacks, and a clean, responsive UI.

- Zero runtime dependencies (only `react` as a peer dependency)
- One unified `<MediaLightbox>` for mixed image + video galleries
- YouTube, Vimeo, and self-hosted (`<video>`) sources
- Keyboard nav (←/→/Esc), click-outside-to-close, body-scroll lock
- ESM + CJS builds with TypeScript types
- Works with React 18 and 19 (incl. Next.js App Router — ships `"use client"`)

## Installation

```bash
npm install react-media-lightbox
```

> `react` and `react-dom` are peer dependencies (>= 18).

## Usage

Import the component **and the stylesheet** once:

```tsx
import { useState } from "react";
import { MediaLightbox, type MediaItem } from "react-media-lightbox";
import "react-media-lightbox/styles.css";

const items: MediaItem[] = [
  { type: "image", src: "https://picsum.photos/id/1015/1200/800", title: "A river" },
  { type: "video", src: "https://youtu.be/dQw4w9WgXcQ", title: "YouTube clip" },
  { type: "video", src: "https://vimeo.com/76979871", title: "Vimeo clip" },
  { type: "video", src: "https://example.com/clip.mp4", provider: "file", title: "Self-hosted", poster: "https://picsum.photos/id/1016/1200/800" },
];

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <button onClick={() => { setIndex(0); setOpen(true); }}>Open gallery</button>

      {open && (
        <MediaLightbox
          items={items}
          initialIndex={index}
          onClose={() => setOpen(false)}
          fallbackSrc="/no_image.png"
        />
      )}
    </>
  );
}
```

The lightbox is **controlled by the parent**: render it conditionally and supply an `onClose` handler. It does not manage its own visibility.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `MediaItem[]` | — | Media to display (images and videos). |
| `initialIndex` | `number` | `0` | Index opened first. |
| `onClose` | `() => void` | — | Called on Esc, close button, or overlay click. |
| `fallbackSrc` | `string` | — | Image shown when an image fails to load. |
| `showCounter` | `boolean` | `true` | Show the `N / total` counter. |
| `loop` | `boolean` | `true` | Wrap navigation at the ends. |
| `closeOnOverlayClick` | `boolean` | `true` | Close when the dimmed background is clicked. |
| `lockBodyScroll` | `boolean` | `true` | Lock page scroll while open. |
| `className` | `string` | — | Extra class on the overlay root. |
| `onIndexChange` | `(index: number) => void` | — | Fired when the active index changes. |

## Item shapes

```ts
type ImageItem = {
  type: "image";
  src: string;
  title?: string;
  alt?: string; // falls back to title
};

type VideoItem = {
  type: "video";
  src: string;                                   // page/embed URL or direct file URL
  provider?: "youtube" | "vimeo" | "file" | "auto"; // default: "auto" (detected from src)
  title?: string;
  poster?: string;  // for "file" videos
  autoplay?: boolean; // default true
};

type MediaItem = ImageItem | VideoItem;
```

When `provider` is omitted or `"auto"`, the provider is detected from the URL:
- `youtube.com` / `youtu.be` / `youtube-nocookie.com` → YouTube iframe
- `vimeo.com` → Vimeo iframe
- anything else → self-hosted `<video>`

## Helpers

The URL utilities are exported if you need them directly:

```ts
import { detectProvider, getEmbedURL, getYouTubeId, getVimeoId } from "react-media-lightbox";
```

## Styling

All class names are prefixed with `rml-` to avoid collisions. Override them in your own CSS after importing `react-media-lightbox/styles.css`, or pass `className` for the overlay root.

## License

MIT
