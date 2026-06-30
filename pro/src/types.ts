import type { MediaItem, MediaLightboxProps } from "react-media-lightbox";

/** Optional thumbnail override for any media item. */
export type ProMediaItem = MediaItem & {
  thumb?: string;
};

export interface MediaLightboxProProps extends Omit<MediaLightboxProps, "items"> {
  items: ProMediaItem[];
  /** Show the clickable thumbnail strip. Defaults to `true`. */
  showThumbnails?: boolean;
}

export interface ThumbnailStripProps {
  items: ProMediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}
