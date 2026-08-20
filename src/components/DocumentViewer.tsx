import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProcessedPage } from '../types';

interface DocumentViewerProps {
  page?: ProcessedPage;
  allPages?: ProcessedPage[];
  activePageIndex: number;
  onSelectPageIndex: (index: number) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  page,
  allPages = [],
  activePageIndex,
  onSelectPageIndex,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  if (!page || !page.originalImage) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400">
        <FileText className="w-12 h-12 stroke-[1.25] text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium">Chưa có tệp nào được chọn</p>
        <p className="text-xs text-slate-400 mt-1">Tải lên tệp PDF hoặc ảnh công thức để xem bản gốc tại đây</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
      {/* Viewer Header / Toolbar */}
      <div className="bg-white dark:bg-slate-900 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
            Trang {page.pageNumber}/{page.totalPages || 1}
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[180px]" title={page.fileName}>
            {page.fileName}
          </span>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center gap-1">
          {allPages.length > 1 && (
            <div className="flex items-center gap-0.5 mr-2 border-r border-slate-200 dark:border-slate-800 pr-2">
              <button
                type="button"
                onClick={() => onSelectPageIndex(Math.max(0, activePageIndex - 1))}
                disabled={activePageIndex === 0}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 font-mono px-1">
                {activePageIndex + 1}/{allPages.length}
              </span>
              <button
                type="button"
                onClick={() => onSelectPageIndex(Math.min(allPages.length - 1, activePageIndex + 1))}
                disabled={activePageIndex >= allPages.length - 1}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                title="Trang tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-500 min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Xoay 90 độ"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Mặc định"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative min-h-[380px] bg-slate-200/60 dark:bg-slate-900/60">
        <div
          className="transition-transform duration-150 origin-center flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={page.originalImage}
            alt={`Trang ${page.pageNumber}`}
            className="max-w-full max-h-[75vh] object-contain rounded shadow-md border border-slate-300 dark:border-slate-700 bg-white"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
