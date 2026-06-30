"use client";

import { useEffect, useRef } from "react";
import type { ThumbnailStripProps } from "./types";
import { getThumbnailUrl, isVideoItem } from "./thumbnails";

export function ThumbnailStrip({
  items,
  activeIndex,
  onSelect,
}: ThumbnailStripProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  if (items.length <= 1) return null;

  return (
    <div className="rmlp-thumbs" role="tablist" aria-label="Gallery thumbnails">
      {items.map((item, i) => {
        const thumb = getThumbnailUrl(item);
        const isActive = i === activeIndex;
        const label = item.title || `Item ${i + 1}`;

        return (
          <button
            key={`${item.type}-${item.src}-${i}`}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={`rmlp-thumb${isActive ? " rmlp-thumbActive" : ""}`}
            onClick={() => onSelect(i)}
          >
            {thumb ? (
              <img src={thumb} alt="" draggable={false} />
            ) : (
              <span className="rmlp-thumbPlaceholder" aria-hidden="true">
                {isVideoItem(item) ? "▶" : "◻"}
              </span>
            )}
            {isVideoItem(item) && thumb && (
              <span className="rmlp-thumbPlay" aria-hidden="true">
                ▶
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
