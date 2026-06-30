export type VideoProvider = "youtube" | "vimeo" | "file";

export interface ImageItem {
  type: "image";
  /** Image source URL. */
  src: string;
  /** Optional caption shown in the footer; also used as the `alt` text. */
  title?: string;
  /** Explicit alt text. Falls back to `title`. */
  alt?: string;
}

export interface VideoItem {
  type: "video";
  /**
   * Video source. For `youtube`/`vimeo` this is the page or embed URL; for
   * `file` this is a direct media URL (mp4/webm/etc.).
   */
  src: string;
  /**
   * Video provider. When omitted (or "auto"), the provider is detected from
   * the `src` URL.
   */
  provider?: VideoProvider | "auto";
  /** Optional caption shown in the footer. */
  title?: string;
  /** Poster image for self-hosted (`file`) videos. */
  poster?: string;
  /** Autoplay when the slide becomes active. Defaults to `true`. */
  autoplay?: boolean;
}

export type MediaItem = ImageItem | VideoItem;

export interface MediaLightboxProps {
  /** The media items to display. */
  items: MediaItem[];
  /** Index of the item to open first. Defaults to `0`. Ignored when `index` is set. */
  initialIndex?: number;
  /** Controlled active index. When set, the parent must update this via `onIndexChange`. */
  index?: number;
  /** Called when the lightbox requests to close (Esc, close button, overlay click). */
  onClose: () => void;
  /** Fallback image URL used when an image fails to load. */
  fallbackSrc?: string;
  /** Show the "N / total" counter in the footer. Defaults to `true`. */
  showCounter?: boolean;
  /** Wrap around when navigating past the first/last item. Defaults to `true`. */
  loop?: boolean;
  /** Close the lightbox when the dimmed overlay (background) is clicked. Defaults to `true`. */
  closeOnOverlayClick?: boolean;
  /** Lock body scroll while the lightbox is open. Defaults to `true`. */
  lockBodyScroll?: boolean;
  /** Extra class name applied to the overlay root element. */
  className?: string;
  /** Fired whenever the active index changes. */
  onIndexChange?: (index: number) => void;
}
