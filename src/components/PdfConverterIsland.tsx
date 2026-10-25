import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { jsPDF as JsPDFType } from 'jspdf';
import {
  Upload,
  Plus,
  RotateCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Sparkles,
  WifiOff,
  Loader2,
  ArrowRightCircle
} from 'lucide-react';
import type { Dictionary } from '@/i18n/config';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  rotation: 0 | 90 | 180 | 270;
  width: number;
  height: number;
}

type Orientation = 'portrait' | 'landscape';
type PageSize = 'a4' | 'letter' | 'fit';
type MarginSize = 0 | 10 | 20;

interface Props {
  dict: Dictionary;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function loadImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600
      });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 });
    };
    img.src = url;
  });
}

function renderRotatedImageToDataUrl(
  url: string,
  rotation: 0 | 90 | 180 | 270
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;
      const isSwapped = rotation === 90 || rotation === 270;
      const targetW = isSwapped ? srcH : srcW;
      const targetH = isSwapped ? srcW : srcH;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // Fill clean white background for transparent PNG/WebP images
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      ctx.translate(targetW / 2, targetH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      resolve({ dataUrl, width: targetW, height: targetH });
    };
    img.onerror = () => reject(new Error('Failed to decode image for PDF generation'));
    img.src = url;
  });
}

export default function PdfConverterIsland({ dict }: Props) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sidebar configuration states
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [margin, setMargin] = useState<MarginSize>(0);
  const [mergeAll, setMergeAll] = useState<boolean>(true);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(dict.sidebar.statusReady);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeUrlsRef = useRef<Set<string>>(new Set());

  // Revoke all object URLs on unmount to prevent memory leaks
  useEffect(() => {
    const urls = activeUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const handleFilesSelected = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList).filter((file) =>
      ACCEPTED_TYPES.includes(file.type.toLowerCase()) ||
      /\.(jpe?g|png|webp)$/i.test(file.name)
    );

    if (filesArray.length === 0) return;

    // Warm up jsPDF chunk in background once user selects images
    import('jspdf').catch(() => {});

    const newItems: UploadedImage[] = await Promise.all(
      filesArray.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        activeUrlsRef.current.add(previewUrl);
        const dims = await loadImageDimensions(previewUrl);
        return {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl,
          rotation: 0,
          width: dims.width,
          height: dims.height
        };
      })
    );

    setImages((prev) => [...prev, ...newItems]);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        activeUrlsRef.current.delete(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      activeUrlsRef.current.delete(item.previewUrl);
    });
    setImages([]);
    setStatusMessage(dict.sidebar.statusReady);
  };

  const rotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextRotation = ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...item, rotation: nextRotation };
      })
    );
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  // Drag and Drop handlers for card reordering
  const handleCardDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(draggedIndex, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
    setDraggedIndex(index);
  };

  const handleCardDragEnd = () => {
    setDraggedIndex(null);
  };

  // Dropzone Drag and Drop handlers
  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDropzoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const generatePdfForList = async (items: UploadedImage[], outputFilename: string) => {
    const { jsPDF } = await import('jspdf');
    let doc: JsPDFType | null = null;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rendered = await renderRotatedImageToDataUrl(item.previewUrl, item.rotation);

      // Convert pixel dimensions to mm (at 96 DPI: 1 px = 0.264583 mm)
      const imgWidthMm = rendered.width * 0.264583;
      const imgHeightMm = rendered.height * 0.264583;

      let pageW = 210;
      let pageH = 297;
      let pageOrientation: 'p' | 'l' = orientation === 'portrait' ? 'p' : 'l';

      if (pageSize === 'a4') {
        pageW = orientation === 'portrait' ? 210 : 297;
        pageH = orientation === 'portrait' ? 297 : 210;
      } else if (pageSize === 'letter') {
        pageW = orientation === 'portrait' ? 215.9 : 279.4;
        pageH = orientation === 'portrait' ? 279.4 : 215.9;
      } else {
        // Fit to Image
        pageW = Math.max(20, imgWidthMm + margin * 2);
        pageH = Math.max(20, imgHeightMm + margin * 2);
        pageOrientation = pageW >= pageH ? 'l' : 'p';
      }

      if (i === 0 || !doc) {
        doc = new jsPDF({
          orientation: pageOrientation,
          unit: 'mm',
          format: [pageW, pageH],
          compress: true
        });
      } else {
        doc.addPage([pageW, pageH], pageOrientation);
      }

      const availW = Math.max(10, pageW - margin * 2);
      const availH = Math.max(10, pageH - margin * 2);

      const scale = Math.min(availW / rendered.width, availH / rendered.height);
      const drawW = rendered.width * scale;
      const drawH = rendered.height * scale;
      const offsetX = margin + (availW - drawW) / 2;
      const offsetY = margin + (availH - drawH) / 2;

      doc.addImage(rendered.dataUrl, 'JPEG', offsetX, offsetY, drawW, drawH, undefined, 'FAST');
    }

    if (doc) {
      doc.save(outputFilename);
    }
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0 || isConverting) return;
    setIsConverting(true);
    setStatusMessage(dict.sidebar.statusConverting);

    try {
      if (mergeAll || images.length === 1) {
        const baseName = images[0].file.name.replace(/\.[^/.]+$/, '') || 'document';
        const outName = images.length === 1 ? `${baseName}.pdf` : `${baseName}-merged-topdf.pdf`;
        await generatePdfForList(images, outName);
      } else {
        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          const baseName = item.file.name.replace(/\.[^/.]+$/, '') || `image-${i + 1}`;
          await generatePdfForList([item], `${baseName}.pdf`);
        }
      }
      setStatusMessage(dict.sidebar.statusComplete);
    } catch (err) {
      console.error('PDF generation error:', err);
      setStatusMessage(dict.sidebar.statusReady);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onFileInputChange}
        aria-label={dict.dropzone.inputAria}
        className="sr-only"
      />

      {/* Screen-Reader Polite Live Region for PDF Conversion Status */}
      <div aria-live="polite" role="status" className="sr-only">
        {statusMessage}
      </div>

      {/* Single Page H1 & Privacy Subheadline */}
      <div className={`text-center max-w-3xl mx-auto ${images.length > 0 ? 'mb-6' : 'mb-8'}`}>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-espresso dark:text-linen">
          {dict.hero.h1}
        </h1>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base lg:text-lg text-espresso/80 dark:text-linen/80 leading-relaxed">
          {dict.hero.subtitle}
        </p>
      </div>

      {images.length === 0 ? (
        /* =========================================================
           STATE 1: INITIAL MINIMAL DROPZONE
           ========================================================= */
        <div
          onDragOver={handleDropzoneDragOver}
          onDragLeave={handleDropzoneDragLeave}
          onDrop={handleDropzoneDrop}
          onClick={triggerFilePicker}
          role="button"
          tabIndex={0}
          aria-label={dict.dropzone.inputAria}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFilePicker();
            }
          }}
          className={`group relative mx-auto max-w-3xl cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center transition-all duration-200 shadow-soft ${
            isDraggingOver
              ? 'border-coral bg-coral/10 dark:bg-coral/15 scale-[1.01]'
              : 'border-slate/45 dark:border-slate-light/45 bg-linen-light dark:bg-espresso-card hover:border-coral dark:hover:border-coral'
          }`}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate/10 dark:bg-slate-light/20 text-slate dark:text-slate-light group-hover:scale-105 transition-transform">
            <Upload className="h-10 w-10 text-coral" aria-hidden="true" />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerFilePicker();
              }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-coral hover:bg-coral-hover active:bg-coral-active px-8 py-4 text-lg sm:text-xl font-extrabold text-white shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{dict.dropzone.selectBtn}</span>
            </button>
          </div>

          <p className="mt-4 text-sm sm:text-base font-medium text-espresso/75 dark:text-linen/75">
            {dict.dropzone.orDrop}
          </p>

          {/* Secondary Slate Blue Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate/30 dark:border-slate-light/40 bg-slate/10 dark:bg-slate-light/15 px-3.5 py-1 text-xs font-semibold text-slate dark:text-linen">
              <ShieldCheck className="h-3.5 w-3.5 text-coral" aria-hidden="true" />
              {dict.dropzone.privacyBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate/30 dark:border-slate-light/40 bg-slate/10 dark:bg-slate-light/15 px-3.5 py-1 text-xs font-semibold text-slate dark:text-linen">
              <Sparkles className="h-3.5 w-3.5 text-coral" aria-hidden="true" />
              {dict.dropzone.formatsBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate/30 dark:border-slate-light/40 bg-slate/10 dark:bg-slate-light/15 px-3.5 py-1 text-xs font-semibold text-slate dark:text-linen">
              <WifiOff className="h-3.5 w-3.5 text-coral" aria-hidden="true" />
              {dict.dropzone.offlineBadge}
            </span>
          </div>
        </div>
      ) : (
        /* =========================================================
           STATE 2: INTERACTIVE WORKSPACE GRID + OPTIONS SIDEBAR
           ========================================================= */
        <div
          onDragOver={handleDropzoneDragOver}
          onDragLeave={handleDropzoneDragLeave}
          onDrop={handleDropzoneDrop}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left / Center Image Preview Grid */}
          <div className="lg:col-span-8 rounded-3xl border border-espresso/15 dark:border-linen/15 bg-linen-light dark:bg-espresso-card p-4 sm:p-6 shadow-soft">
            {/* Top Workspace Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-espresso/10 dark:border-linen/10">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 items-center rounded-lg bg-slate px-2.5 text-xs font-bold text-white">
                  {images.length}
                </span>
                <span className="text-sm sm:text-base font-bold text-espresso dark:text-linen">
                  {dict.workspace.imagesCount}
                </span>
                <span className="hidden sm:inline text-xs text-espresso/60 dark:text-linen/60">
                  • {dict.workspace.dragHint}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerFilePicker}
                  aria-label={dict.workspace.addMoreAria}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate hover:bg-slate-dark px-3.5 py-2 text-xs sm:text-sm font-bold text-white transition-colors"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{dict.workspace.addMore}</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllImages}
                  aria-label={dict.workspace.clearAllAria}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-espresso/20 dark:border-linen/20 px-3 py-2 text-xs sm:text-sm font-semibold text-espresso/80 dark:text-linen/80 hover:border-coral hover:text-coral transition-colors"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>{dict.workspace.clearAll}</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleCardDragStart(idx)}
                  onDragOver={(e) => handleCardDragOver(e, idx)}
                  onDragEnd={handleCardDragEnd}
                  className={`group relative flex flex-col rounded-2xl border-2 bg-linen dark:bg-espresso p-3 transition-all ${
                    draggedIndex === idx
                      ? 'border-coral opacity-60 scale-95'
                      : 'border-espresso/15 dark:border-linen/15 hover:border-slate dark:hover:border-slate-light'
                  }`}
                >
                  {/* Top Badge Bar: Page Index + Remove ('X') */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="inline-flex items-center rounded-md bg-slate px-2 py-0.5 text-[11px] font-bold text-white">
                      {dict.workspace.pageBadge} {idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      {img.rotation > 0 && (
                        <span className="rounded bg-coral/15 px-1.5 py-0.5 text-[10px] font-bold text-coral">
                          {img.rotation}°
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        aria-label={`${dict.workspace.removeAria}: ${img.file.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-espresso/10 dark:bg-linen/10 text-espresso dark:text-linen hover:bg-coral hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Image Preview Box (Fixed Aspect Ratio + Explicit width/height for CLS = 0) */}
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white/80 dark:bg-espresso-card border border-espresso/10 dark:border-linen/10 p-2">
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      width={220}
                      height={220}
                      loading="lazy"
                      decoding="async"
                      style={{ transform: `rotate(${img.rotation}deg)` }}
                      className="max-h-full max-w-full object-contain transition-transform duration-200 select-none"
                    />
                  </div>

                  {/* Filename & Resolution */}
                  <div className="mt-2.5 flex items-center justify-between gap-1 text-xs">
                    <p
                      className="truncate font-semibold text-espresso dark:text-linen"
                      title={img.file.name}
                    >
                      {img.file.name}
                    </p>
                    <span className="shrink-0 text-[10px] text-espresso/60 dark:text-linen/60">
                      {img.width}×{img.height}
                    </span>
                  </div>

                  {/* Bottom Card Action Bar: Move Left, Rotate 90°, Move Right */}
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5 pt-2 border-t border-espresso/10 dark:border-linen/10">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, -1)}
                      aria-label={`${dict.workspace.moveLeftAria}: ${img.file.name}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-espresso/15 dark:border-linen/15 bg-linen-light dark:bg-espresso-card text-espresso dark:text-linen hover:border-slate disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => rotateImage(img.id)}
                      aria-label={`${dict.workspace.rotateAria}: ${img.file.name}`}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate/30 dark:border-slate-light/40 bg-slate/10 dark:bg-slate-light/15 text-xs font-bold text-slate dark:text-linen hover:bg-slate hover:text-white transition-colors"
                    >
                      <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>90°</span>
                    </button>

                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, 1)}
                      aria-label={`${dict.workspace.moveRightAria}: ${img.file.name}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-espresso/15 dark:border-linen/15 bg-linen-light dark:bg-espresso-card text-espresso dark:text-linen hover:border-slate disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Floating '+' Card to Add More Images */}
              <button
                type="button"
                onClick={triggerFilePicker}
                aria-label={dict.workspace.addMoreAria}
                className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate/40 dark:border-slate-light/40 bg-linen/50 dark:bg-espresso/40 p-4 text-center hover:border-coral hover:bg-coral/5 transition-all group"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-espresso dark:text-linen">
                  {dict.workspace.addMore}
                </span>
              </button>
            </div>
          </div>

          {/* Right Configuration Sidebar (<aside>) */}
          <aside
            aria-label={dict.sidebar.ariaLabel}
            className="lg:col-span-4 rounded-3xl border border-espresso/15 dark:border-linen/15 bg-linen-light dark:bg-espresso-card p-5 sm:p-6 shadow-soft lg:sticky lg:top-20"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-espresso dark:text-linen pb-3 border-b border-espresso/10 dark:border-linen/10">
              {dict.sidebar.title}
            </h2>

            {/* 1. Page Orientation Selector Cards */}
            <div className="mt-5">
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso/80 dark:text-linen/80 mb-2.5">
                {dict.sidebar.orientationLabel}
              </span>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label={dict.sidebar.orientationLabel}>
                <button
                  type="button"
                  aria-pressed={orientation === 'portrait'}
                  onClick={() => setOrientation('portrait')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3.5 text-sm font-bold transition-all ${
                    orientation === 'portrait'
                      ? 'border-slate dark:border-slate-light bg-slate/10 dark:bg-slate-light/20 text-espresso dark:text-linen shadow-sm'
                      : 'border-espresso/15 dark:border-linen/15 bg-linen dark:bg-espresso text-espresso/75 dark:text-linen/75 hover:border-slate/50'
                  }`}
                >
                  <span className="h-7 w-5 rounded-sm border-2 border-current" aria-hidden="true" />
                  <span>{dict.sidebar.portrait}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={orientation === 'landscape'}
                  onClick={() => setOrientation('landscape')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3.5 text-sm font-bold transition-all ${
                    orientation === 'landscape'
                      ? 'border-slate dark:border-slate-light bg-slate/10 dark:bg-slate-light/20 text-espresso dark:text-linen shadow-sm'
                      : 'border-espresso/15 dark:border-linen/15 bg-linen dark:bg-espresso text-espresso/75 dark:text-linen/75 hover:border-slate/50'
                  }`}
                >
                  <span className="h-5 w-7 rounded-sm border-2 border-current" aria-hidden="true" />
                  <span>{dict.sidebar.landscape}</span>
                </button>
              </div>
            </div>

            {/* 2. Page Size Dropdown */}
            <div className="mt-5">
              <label
                htmlFor="pdf-page-size"
                className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso/80 dark:text-linen/80 mb-2"
              >
                {dict.sidebar.pageSizeLabel}
              </label>
              <select
                id="pdf-page-size"
                aria-label={dict.sidebar.pageSizeAria}
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="w-full rounded-xl border-2 border-espresso/20 dark:border-linen/20 bg-linen dark:bg-espresso px-3.5 py-2.5 text-sm font-semibold text-espresso dark:text-linen focus:border-slate dark:focus:border-slate-light transition-colors"
              >
                <option value="a4">{dict.sidebar.sizeA4}</option>
                <option value="letter">{dict.sidebar.sizeLetter}</option>
                <option value="fit">{dict.sidebar.sizeFit}</option>
              </select>
            </div>

            {/* 3. Margin Selector Cards */}
            <div className="mt-5">
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso/80 dark:text-linen/80 mb-2.5">
                {dict.sidebar.marginLabel}
              </span>
              <div className="grid grid-cols-3 gap-2.5" role="group" aria-label={dict.sidebar.marginLabel}>
                {(
                  [
                    { value: 0 as MarginSize, label: dict.sidebar.marginNone, padClass: 'p-0' },
                    { value: 10 as MarginSize, label: dict.sidebar.marginSmall, padClass: 'p-1' },
                    { value: 20 as MarginSize, label: dict.sidebar.marginBig, padClass: 'p-2' }
                  ] as const
                ).map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    aria-pressed={margin === m.value}
                    onClick={() => setMargin(m.value)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2.5 text-xs font-bold transition-all ${
                      margin === m.value
                        ? 'border-slate dark:border-slate-light bg-slate/10 dark:bg-slate-light/20 text-espresso dark:text-linen'
                        : 'border-espresso/15 dark:border-linen/15 bg-linen dark:bg-espresso text-espresso/75 dark:text-linen/75 hover:border-slate/50'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-5 items-center justify-center rounded-sm border border-current ${m.padClass}`}
                      aria-hidden="true"
                    >
                      <span className="h-full w-full bg-coral/70 rounded-[1px]" />
                    </span>
                    <span className="text-center leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Merge All Checkbox */}
            <div className="mt-5 pt-4 border-t border-espresso/10 dark:border-linen/10">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mergeAll}
                  onChange={(e) => setMergeAll(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-espresso/30 text-slate focus:ring-slate accent-[#315B8C]"
                />
                <span className="text-sm font-semibold text-espresso dark:text-linen leading-snug">
                  {dict.sidebar.mergeLabel}
                </span>
              </label>
            </div>

            {/* 5. Prominent Bottom '#F2765E' CTA Button ('Convert to PDF ->') */}
            <div className="mt-6">
              <button
                type="button"
                disabled={isConverting}
                onClick={handleConvertToPdf}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-coral hover:bg-coral-hover active:bg-coral-active disabled:opacity-60 px-6 py-4 text-base sm:text-lg font-extrabold text-white shadow-md hover:shadow-lg transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span>{dict.sidebar.convertingBtn}</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{dict.sidebar.convertBtn}</span>
                    <ArrowRightCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
