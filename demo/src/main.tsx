import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { MediaLightbox } from "react-media-lightbox";
import { MediaLightboxPro, getThumbnailUrl } from "react-media-lightbox-pro";
import { sampleItems } from "./items";
import "react-media-lightbox/styles.css";
import "react-media-lightbox-pro/styles.css";
import "./App.css";

type Mode = "free" | "pro";

function App() {
  const [mode, setMode] = useState<Mode>("free");
  const [open, setOpen] = useState(false);
  const [startAt, setStartAt] = useState(0);

  const openGallery = (index = 0) => {
    setStartAt(index);
    setOpen(true);
  };

  return (
    <main className="demo">
      <header className="demo-header">
        <h1>react-media-lightbox</h1>
        <p>Click a thumbnail to open the gallery.</p>

        <div className="demo-tabs" role="tablist" aria-label="Lightbox mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "free"}
            className={mode === "free" ? "active" : ""}
            onClick={() => setMode("free")}
          >
            Free
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "pro"}
            className={mode === "pro" ? "active" : ""}
            onClick={() => setMode("pro")}
          >
            Pro (thumbnails)
          </button>
        </div>
      </header>

      <section className="demo-grid">
        {sampleItems.map((item, i) => {
          const thumb = getThumbnailUrl(item);
          const isVideo = item.type === "video";

          return (
            <button
              key={`${item.type}-${item.src}`}
              type="button"
              className="demo-card"
              onClick={() => openGallery(i)}
            >
              {thumb ? (
                <>
                  <img src={thumb} alt={item.title ?? ""} />
                  {isVideo && <span className="demo-card-play" aria-hidden="true">▶</span>}
                </>
              ) : (
                <span className="demo-card-fallback">Video</span>
              )}
              <span className="demo-card-label">{item.title}</span>
            </button>
          );
        })}
      </section>

      {open && mode === "free" && (
        <MediaLightbox
          items={sampleItems}
          initialIndex={startAt}
          onClose={() => setOpen(false)}
        />
      )}

      {open && mode === "pro" && (
        <MediaLightboxPro
          items={sampleItems}
          initialIndex={startAt}
          onClose={() => setOpen(false)}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
