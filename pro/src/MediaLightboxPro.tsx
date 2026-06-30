"use client";

import { useCallback, useState } from "react";
import { MediaLightbox } from "react-media-lightbox";
import { ThumbnailStrip } from "./ThumbnailStrip";
import type { MediaLightboxProProps } from "./types";

export function MediaLightboxPro({
  items,
  initialIndex = 0,
  showThumbnails = true,
  onIndexChange,
  className,
  ...rest
}: MediaLightboxProProps) {
  const [index, setIndex] = useState(initialIndex);

  const handleIndexChange = useCallback(
    (next: number) => {
      setIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange]
  );

  return (
    <>
      <MediaLightbox
        {...rest}
        items={items}
        index={index}
        onIndexChange={handleIndexChange}
        className={className}
      />
      {showThumbnails && (
        <ThumbnailStrip
          items={items}
          activeIndex={index}
          onSelect={handleIndexChange}
        />
      )}
    </>
  );
}

export default MediaLightboxPro;
