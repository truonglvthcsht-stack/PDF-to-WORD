import React from 'react';
import {
  FileText,
  Trash2,
  Play,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { UploadedFileItem } from '../types';

interface BatchSidebarProps {
  files: UploadedFileItem[];
  activeFileId: string;
  activePageIndex: number;
  onSelectFile: (fileId: string, pageIndex?: number) => void;
  onDeleteFile: (fileId: string) => void;
  onProcessPage: (fileId: string, pageIndex: number) => void;
  onProcessAll: () => void;
  isProcessingAny: boolean;
  onOpenUpload: () => void;
}

export const BatchSidebar: React.FC<BatchSidebarProps> = ({
  files,
  activeFileId,
  activePageIndex,
  onSelectFile,
  onDeleteFile,
  onProcessPage,
  onProcessAll,
  isProcessingAny,
  onOpenUpload,
}) => {
  const totalPagesCount = files.reduce((acc, f) => acc + f.pages.length, 0);
  const donePagesCount = files.reduce(
    (acc, f) => acc + f.pages.filter((p) => p.status === 'done').length,
    0
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Hàng đợi ({donePagesCount}/{totalPagesCount} trang)
          </h3>
        </div>
        <button
          type="button"
          onClick={onOpenUpload}
          className="p-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded flex items-center gap-1 cursor-pointer"
          title="Thêm tệp khác"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm tệp</span>
        </button>
      </div>

      {/* Process All Button if multiple */}
      {totalPagesCount > 0 && (
        <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onProcessAll}
            disabled={isProcessingAny}
            className="w-full py-2 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isProcessingAny ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xử lý OCR hàng loạt...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Nhận diện tất cả ({totalPagesCount} trang)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* File & Page List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {files.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            Chưa có tệp nào trong danh sách.
          </div>
        ) : (
          files.map((file) => {
            const isFileActive = file.id === activeFileId;

            return (
              <div
                key={file.id}
                className={`rounded-lg border transition-all overflow-hidden ${
                  isFileActive
                    ? 'border-blue-300 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {/* File Header */}
                <div className="p-2.5 flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <div
                    onClick={() => onSelectFile(file.id, 0)}
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {file.pages.length} trang • {file.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Xóa tệp"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Page Thumbnails / List */}
                <div className="p-1.5 space-y-1">
                  {file.pages.map((page, pIdx) => {
                    const isPageActive = isFileActive && activePageIndex === pIdx;

                    return (
                      <div
                        key={page.id}
                        onClick={() => onSelectFile(file.id, pIdx)}
                        className={`p-1.5 rounded-md flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          isPageActive
                            ? 'bg-blue-100/70 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Mini Thumbnail */}
                          {page.originalImage && (
                            <img
                              src={page.originalImage}
                              alt={`Trang ${page.pageNumber}`}
                              className="w-7 h-9 object-cover rounded border border-slate-300 dark:border-slate-700 shrink-0 bg-white"
                            />
                          )}
                          <span className="truncate">Trang {page.pageNumber}</span>
                        </div>

                        {/* Status Icon & Action */}
                        <div className="flex items-center gap-1.5">
                          {page.status === 'processing' && (
                            <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                          )}
                          {page.status === 'done' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {page.status === 'error' && (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          )}
                          {page.status === 'idle' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onProcessPage(file.id, pIdx);
                              }}
                              disabled={isProcessingAny}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white rounded border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                              title="Chạy OCR cho trang này"
                            >
                              OCR
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
