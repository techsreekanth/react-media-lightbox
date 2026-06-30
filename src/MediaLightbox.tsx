"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem, MediaLightboxProps, VideoItem } from "./types";
import { detectProvider, getEmbedURL } from "./video";

/** Minimum px travelled before a gesture is treated as a swipe. */
const SWIPE_THRESHOLD = 50;
/** Vertical px travelled before a downward swipe closes the lightbox. */
const CLOSE_THRESHOLD = 110;

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

function ImageSlide({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset the loaded flag when the source changes (React-recommended derived
  // state via render-time comparison instead of an effect).
  const [renderedSrc, setRenderedSrc] = useState(src);
  if (renderedSrc !== src) {
    setRenderedSrc(src);
    setIsLoaded(false);
  }

  return (
    <div className="rml-imageContainer">
      {!isLoaded && <div className="rml-spinner" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`rml-image${isLoaded ? " rml-imageLoaded" : ""}`}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setIsLoaded(true);
          if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
            e.currentTarget.src = fallbackSrc;
          }
        }}
      />
    </div>
  );
}

function VideoSlide({ item }: { item: VideoItem }) {
  const autoplay = item.autoplay ?? true;
  const provider =
    !item.provider || item.provider === "auto"
      ? detectProvider(item.src)
      : item.provider;

  if (provider === "file") {
    return (
      <div className="rml-playerContainer rml-fileContainer">
        <video
          className="rml-videoPlayer"
          src={item.src}
          poster={item.poster}
          controls
          autoPlay={autoplay}
          playsInline
        />
      </div>
    );
  }

  const embedUrl = getEmbedURL(item.src, provider, autoplay) ?? item.src;

  return (
    <div className="rml-playerContainer">
      <iframe
        className="rml-iframePlayer"
        src={embedUrl}
        title={item.title || "Video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export function MediaLightbox({
  items,
  initialIndex = 0,
  onClose,
  fallbackSrc,
  showCounter = true,
  loop = true,
  closeOnOverlayClick = true,
  lockBodyScroll = true,
  className,
  onIndexChange,
}: MediaLightboxProps) {
  const count = items?.length ?? 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Live drag offset (in px) used to follow the finger during a swipe.
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const touchRef = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(
    null
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev === 0 ? (loop ? count - 1 : 0) : prev - 1;
      onIndexChange?.(next);
      return next;
    });
  }, [count, loop, onIndexChange]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev === count - 1 ? (loop ? 0 : count - 1) : prev + 1;
      onIndexChange?.(next);
      return next;
    });
  }, [count, loop, onIndexChange]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, axis: null };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    // Lock the gesture to a single axis once movement is clearly intentional.
    if (!start.axis && Math.abs(dx) + Math.abs(dy) > 10) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (start.axis === "x") {
      setDrag({ x: dx, y: 0 });
    } else if (start.axis === "y" && dy > 0) {
      // Only follow downward drags (swipe-to-close).
      setDrag({ x: 0, y: dy });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const start = touchRef.current;
    const offset = drag;
    touchRef.current = null;
    setDrag(null);
    if (!start || !offset) return;

    if (start.axis === "x" && Math.abs(offset.x) > SWIPE_THRESHOLD && count > 1) {
      if (offset.x < 0) handleNext();
      else handlePrev();
    } else if (start.axis === "y" && offset.y > CLOSE_THRESHOLD) {
      onClose();
    }
  }, [drag, count, handleNext, handlePrev, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    let previousOverflow = "";
    if (lockBodyScroll) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (lockBodyScroll) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [handlePrev, handleNext, onClose, lockBodyScroll]);

  if (!items || count === 0) return null;

  const safeIndex = Math.min(Math.max(currentIndex, 0), count - 1);
  const current: MediaItem = items[safeIndex];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const contentStyle: React.CSSProperties = drag
    ? {
        transform: `translate3d(${drag.x}px, ${drag.y}px, 0)`,
        transition: "none",
      }
    : {};

  // Dim the backdrop as the user drags down to close.
  const overlayStyle: React.CSSProperties =
    drag && drag.y > 0
      ? { opacity: Math.max(0.3, 1 - drag.y / 400) }
      : {};

  return (
    <div
      className={`rml-overlay${className ? ` ${className}` : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      style={overlayStyle}
    >
      <button className="rml-closeBtn" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>

      {count > 1 && (
        <button
          className="rml-navBtn rml-prevBtn"
          onClick={handlePrev}
          aria-label="Previous"
        >
          <PrevIcon />
        </button>
      )}

      <div
        className="rml-content"
        onClick={handleOverlayClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={contentStyle}
      >
        {current.type === "video" ? (
          <VideoSlide item={current} />
        ) : (
          <ImageSlide
            key={safeIndex}
            src={current.src}
            alt={current.alt || current.title || `Item ${safeIndex + 1}`}
            fallbackSrc={fallbackSrc}
          />
        )}
      </div>

      {count > 1 && (
        <button
          className="rml-navBtn rml-nextBtn"
          onClick={handleNext}
          aria-label="Next"
        >
          <NextIcon />
        </button>
      )}

      <div className="rml-footer">
        {showCounter && (
          <span className="rml-counter">{`${safeIndex + 1} / ${count}`}</span>
        )}
        {current.title && <h4 className="rml-title">{current.title}</h4>}
      </div>
    </div>
  );
}

export default MediaLightbox;
