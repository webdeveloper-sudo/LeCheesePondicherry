import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

const LENS_ZOOM = 2.5;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

interface ProductImageGalleryProps {
  src: string;
  alt: string;
  images: string[];
  /** Extra controls rendered over the main image (e.g. wishlist button) */
  overlay?: ReactNode;
}

/**
 * Main product image with an Amazon-style hover lens (desktop) and a
 * click-to-open full screen viewer with prev/next and zoom controls.
 */
export default function ProductImageGallery({ src, alt, images, overlay }: ProductImageGalleryProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const gallery = images.length > 0 ? images : [src];

  const canHoverZoom = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box || !canHoverZoom() || (e.target as HTMLElement).closest("button")) {
      setLens(null);
      return;
    }
    const rect = box.getBoundingClientRect();
    const lensW = rect.width / LENS_ZOOM;
    const lensH = rect.height / LENS_ZOOM;
    // Keep the lens fully inside the image
    const x = Math.min(Math.max(e.clientX - rect.left - lensW / 2, 0), rect.width - lensW);
    const y = Math.min(Math.max(e.clientY - rect.top - lensH / 2, 0), rect.height - lensH);
    setLens({ x, y, w: rect.width, h: rect.height });
  };

  const openViewer = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const index = gallery.indexOf(src);
    setLens(null);
    setViewerIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      <div className="relative">
        <div
          ref={boxRef}
          className="aspect-square bg-bg-cream-light rounded-lg overflow-hidden relative cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLens(null)}
          onClick={openViewer}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {lens && (
            <div
              className="absolute border border-white/80 bg-white/30 pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
              style={{
                left: lens.x,
                top: lens.y,
                width: lens.w / LENS_ZOOM,
                height: lens.h / LENS_ZOOM,
              }}
            />
          )}
          {overlay}
        </div>

        {/* Zoom window, shown beside the image over the product info column */}
        {lens && (
          <div
            className="hidden lg:block absolute top-0 left-[calc(100%+1.5rem)] z-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl pointer-events-none"
            style={{ width: lens.w, height: lens.h }}
          >
            <img
              src={src}
              alt=""
              className="absolute max-w-none object-cover"
              style={{
                width: lens.w * LENS_ZOOM,
                height: lens.h * LENS_ZOOM,
                left: -lens.x * LENS_ZOOM,
                top: -lens.y * LENS_ZOOM,
              }}
            />
          </div>
        )}
      </div>

      {viewerIndex !== null && (
        <ImageViewer
          images={gallery}
          alt={alt}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}

interface ImageViewerProps {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function ImageViewer({ images, alt, index, onIndexChange, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hasMultiple = images.length > 1;

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const zoomTo = useCallback((next: number) => {
    const clamped = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
    setScale(clamped);
    if (clamped === 1) setOffset({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (next: number) => {
      onIndexChange((next + images.length) % images.length);
      setScale(1);
      setOffset({ x: 0, y: 0 });
    },
    [images.length, onIndexChange],
  );

  // Keyboard controls + body scroll lock
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && hasMultiple) goTo(index + 1);
      else if (e.key === "ArrowLeft" && hasMultiple) goTo(index - 1);
      else if (e.key === "+" || e.key === "=") zoomTo(scale + SCALE_STEP);
      else if (e.key === "-") zoomTo(scale - SCALE_STEP);
    };
    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, scale, hasMultiple, goTo, zoomTo, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    zoomTo(scale + (e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale === 1) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.originX + (e.clientX - drag.startX) / scale,
      y: drag.originY + (e.clientY - drag.startY) / scale,
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const controlClass =
    "p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image viewer`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={controlClass}
            onClick={() => zoomTo(scale - SCALE_STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          <span className="w-14 text-center text-sm tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            className={controlClass}
            onClick={() => zoomTo(scale + SCALE_STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button type="button" className={`${controlClass} ml-2`} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex-1 overflow-hidden flex items-center justify-center"
        onWheel={handleWheel}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          draggable={false}
          className={`max-w-[90vw] max-h-full object-contain transition-transform ${
            isDragging ? "duration-0" : "duration-200"
          } ${scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
          style={{ transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)` }}
          onDoubleClick={() => (scale > 1 ? resetZoom() : zoomTo(2))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              className={`${controlClass} absolute left-4 top-1/2 -translate-y-1/2`}
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              className={`${controlClass} absolute right-4 top-1/2 -translate-y-1/2`}
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex justify-center gap-2 px-4 py-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                i === index ? "border-brand-gold-subtle" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
