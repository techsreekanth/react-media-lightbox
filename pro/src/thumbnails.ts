import {
  detectProvider,
  getYouTubeId,
  getVimeoId,
  type MediaItem,
} from "react-media-lightbox";
import type { ProMediaItem } from "./types";

/** Resolve a thumbnail URL for a gallery item. */
export function getThumbnailUrl(item: ProMediaItem): string | null {
  if (item.thumb) return item.thumb;

  if (item.type === "image") {
    return item.src;
  }

  const provider =
    !item.provider || item.provider === "auto"
      ? detectProvider(item.src)
      : item.provider;

  if (item.poster) return item.poster;

  if (provider === "youtube") {
    const id = getYouTubeId(item.src);
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }

  if (provider === "vimeo") {
    const id = getVimeoId(item.src);
    if (id) return `https://vumbnail.com/${id}.jpg`;
  }

  return null;
}

export function isVideoItem(item: MediaItem): item is Extract<MediaItem, { type: "video" }> {
  return item.type === "video";
}
