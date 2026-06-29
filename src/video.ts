import type { VideoProvider } from "./types";

/** Detect a video provider from its URL. */
export function detectProvider(url: string): VideoProvider {
  if (!url) return "file";
  if (/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(url)) {
    return "youtube";
  }
  if (/vimeo\.com/i.test(url)) {
    return "vimeo";
  }
  return "file";
}

/** Extract the YouTube video id from any common YouTube URL shape. */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    if (url.includes("youtube.com/embed/")) {
      return url.split("youtube.com/embed/")[1]?.split(/[?&/]/)[0] ?? null;
    }
    if (url.includes("youtube-nocookie.com/embed/")) {
      return url.split("youtube-nocookie.com/embed/")[1]?.split(/[?&/]/)[0] ?? null;
    }
    if (url.includes("youtube.com/v/")) {
      return url.split("youtube.com/v/")[1]?.split(/[?&/]/)[0] ?? null;
    }
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split(/[?&/]/)[0] ?? null;
    }
    if (url.includes("youtube.com/watch")) {
      const params = new URLSearchParams(new URL(url).search);
      return params.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

/** Extract the numeric Vimeo id from any common Vimeo URL shape. */
export function getVimeoId(url: string): string | null {
  if (!url) return null;
  if (url.includes("player.vimeo.com/video/")) {
    return url.split("player.vimeo.com/video/")[1]?.split(/[?&/]/)[0] ?? null;
  }
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/i);
  return match ? match[1] : null;
}

/**
 * Resolve a video URL to an embeddable `<iframe>` src.
 * Returns `null` if the URL is not an iframe-embeddable provider (e.g. a file).
 */
export function getEmbedURL(
  url: string,
  provider: VideoProvider,
  autoplay: boolean
): string | null {
  if (provider === "youtube") {
    const id = getYouTubeId(url);
    if (id) {
      const params = autoplay ? "?autoplay=1" : "";
      return `https://www.youtube-nocookie.com/embed/${id}${params}`;
    }
    return url.replace("youtube.com", "youtube-nocookie.com");
  }
  if (provider === "vimeo") {
    const id = getVimeoId(url);
    if (id) {
      const params = autoplay ? "?autoplay=1" : "";
      return `https://player.vimeo.com/video/${id}${params}`;
    }
    return url;
  }
  return null;
}
