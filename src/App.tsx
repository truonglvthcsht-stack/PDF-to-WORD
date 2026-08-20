/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Eye,
  Code2,
  Columns,
  Play,
  RotateCw,
  Copy,
  Check,
  FileDown,
  Trash2,
  Layers,
  ChevronRight,
  AlertTriangle,
  Upload,
  BookOpen,
} from 'lucide-react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { DocumentViewer } from './components/DocumentViewer';
import { MathRenderer } from './components/MathRenderer';
import { LatexToolbar } from './components/LatexToolbar';
import { ExportModal } from './components/ExportModal';
import { BatchSidebar } from './components/BatchSidebar';
import { UploadedFileItem, ProcessedPage, OcrMode } from './types';
import { SAMPLE_DATASETS, SampleItem } from './data/samples';

export default function App() {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<OcrMode>('academic_exam');
  const [activeViewTab, setActiveViewTab] = useState<'split' | 'rendered' | 'editor'>('split');
  const [isProcessingAny, setIsProcessingAny] = useState<boolean>(false);
  const [isAiFixing, setIsAiFixing] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSamplesModalOpen, setIsSamplesModalOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Active file and page resolution
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const activePage = activeFile?.pages[activePageIndex] || activeFile?.pages[0];

  const totalPageCount = files.reduce((acc, f) => acc + f.pages.length, 0);
  const donePageCount = files.reduce(
    (acc, f) => acc + f.pages.filter((p) => p.status === 'done').length,
    0
  );
  const hasProcessedContent = files.some((f) =>
    f.pages.some((p) => p.markdownText && p.markdownText.trim().length > 0)
  );

  // Load a sample dataset automatically if empty on initial load
  useEffect(() => {
    if (files.length === 0 && SAMPLE_DATASETS.length > 0) {
      handleLoadSample(SAMPLE_DATASETS[0]);
    }
  }, []);

  const handleFilesAdded = (newFiles: UploadedFileItem[]) => {
    setFiles((prev) => {
      const updated = [...prev, ...newFiles];
      return updated;
    });
    if (newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
      setActivePageIndex(0);
    }
  };

  const handleSelectFile = (fileId: string, pageIndex = 0) => {
    setActiveFileId(fileId);
    setActivePageIndex(pageIndex);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== fileId);
      if (activeFileId === fileId) {
        if (filtered.length > 0) {
          setActiveFileId(filtered[0].id);
          setActivePageIndex(0);
        } else {
          setActiveFileId('');
          setActivePageIndex(0);
        }
      }
      return filtered;
    });
  };

  const handleResetWorkspace = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ hàng đợi tệp hiện tại?')) {
      setFiles([]);
      setActiveFileId('');
      setActivePageIndex(0);
    }
  };

  const handleLoadSample = (sample: SampleItem) => {
    const sampleFileId = `sample-${Date.now()}`;
    const samplePage: ProcessedPage = {
      id: `page-${sampleFileId}-1`,
      fileId: sampleFileId,
      fileName: `${sample.title}.pdf`,
      pageNumber: 1,
      totalPages: 1,
      originalImage: sample.previewSvg,
      status: 'done',
      markdownText: sample.defaultMarkdown,
      processedAt: Date.now(),
    };

    const sampleFile: UploadedFileItem = {
      id: sampleFileId,
      name: `${sample.title}.pdf`,
      size: 1024 * 250,
      type: 'pdf',
      pages: [samplePage],
      activePageIndex: 0,
      status: 'done',
    };

    setFiles((prev) => [sampleFile, ...prev]);
    setActiveFileId(sampleFileId);
    setActivePageIndex(0);
    setIsSamplesModalOpen(false);
  };

  // Perform Gemini OCR on a specific page
  const handleProcessPage = async (fileId: string, pageIdx: number) => {
    const targetFile = files.find((f) => f.id === fileId);
    if (!targetFile) return;
    const targetPage = targetFile.pages[pageIdx];
    if (!targetPage || !targetPage.originalImage) return;

    // Set page status to processing
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        const updatedPages = [...f.pages];
        updatedPages[pageIdx] = {
          ...updatedPages[pageIdx],
          status: 'processing',
          errorMessage: undefined,
        };
        return { ...f, pages: updatedPages, status: 'processing' };
      })
    );

    try {
      setIsProcessingAny(true);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetPage.originalImage,
          mimeType: 'image/png',
          mode: selectedMode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'OCR xử lý thất bại');
      }

      // Update with OCR markdown result
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileId) return f;
          const updatedPages = [...f.pages];
          updatedPages[pageIdx] = {
            ...updatedPages[pageIdx],
            status: 'done',
            markdownText: data.text || '',
            processedAt: Date.now(),
          };
          const allDone = updatedPages.every((p) => p.status === 'done');
          return { ...f, pages: updatedPages, status: allDone ? 'done' : 'idle' };
        })
      );
    } catch (err: any) {
      console.error('OCR error for page:', err);
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileId) return f;
          const updatedPages = [...f.pages];
          updatedPages[pageIdx] = {
            ...updatedPages[pageIdx],
            status: 'error',
            errorMessage: err.message || 'Lỗi nhận diện AI',
          };
          return { ...f, pages: updatedPages, status: 'error' };
        })
      );
    } finally {
      setIsProcessingAny(false);
    }
  };

  // Process all unprocessed pages in queue
  const handleProcessAll = async () => {
    setIsProcessingAny(true);
    for (const file of files) {
      for (let pIdx = 0; pIdx < file.pages.length; pIdx++) {
        const page = file.pages[pIdx];
        if (page.status !== 'done') {
          await handleProcessPage(file.id, pIdx);
        }
      }
    }
    setIsProcessingAny(false);
  };

  // Update markdown text when user edits
  const handleUpdatePageMarkdown = (newMarkdown: string) => {
    if (!activeFile || !activePage) return;
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== activeFile.id) return f;
        const updatedPages = [...f.pages];
        updatedPages[activePageIndex] = {
          ...updatedPages[activePageIndex],
          markdownText: newMarkdown,
        };
        return { ...f, pages: updatedPages };
      })
    );
  };

  // AI LaTeX & Syntax Fixer
  const handleAiFixLatex = async () => {
    if (!activePage || !activePage.markdownText.trim()) return;

    try {
      setIsAiFixing(true);
      const response = await fetch('/api/fix-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: activePage.markdownText,
          instruction: 'Fix any broken LaTeX formulas, dollar sign balance, and Markdown table syntax.',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.fixedText) {
        handleUpdatePageMarkdown(data.fixedText);
      }
    } catch (err) {
      console.error('AI Fix error:', err);
    } finally {
      setIsAiFixing(false);
    }
  };

  // Insert LaTeX snippet into active textarea
  const handleInsertSnippet = (snippet: string) => {
    const textarea = editorTextareaRef.current;
    if (!textarea) {
      handleUpdatePageMarkdown((activePage?.markdownText || '') + '\n' + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const updated = current.substring(0, start) + snippet + current.substring(end);
    handleUpdatePageMarkdown(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const handleCopyCurrentMarkdown = () => {
    if (!activePage?.markdownText) return;
    navigator.clipboard.writeText(activePage.markdownText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <Header
        onOpenExport={() => setIsExportModalOpen(true)}
        hasProcessedContent={hasProcessedContent}
        totalPageCount={totalPageCount}
        donePageCount={donePageCount}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onResetWorkspace={handleResetWorkspace}
        onOpenSamples={() => setIsSamplesModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Upload Zone & Quick Mode Selector */}
        <UploadZone
          onFilesAdded={handleFilesAdded}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          onLoadSample={handleLoadSample}
        />

        {/* Workspace Canvas (Sidebar + Document Viewer + Converted Math Workspace) */}
        {files.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[640px]">
            {/* Left Queue / Sidebar (3 cols on lg) */}
            <div className="lg:col-span-3 h-full min-h-[300px] lg:min-h-[600px] rounded-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800">
              <BatchSidebar
                files={files}
                activeFileId={activeFile?.id || ''}
                activePageIndex={activePageIndex}
                onSelectFile={handleSelectFile}
                onDeleteFile={handleDeleteFile}
                onProcessPage={handleProcessPage}
                onProcessAll={handleProcessAll}
                isProcessingAny={isProcessingAny}
                onOpenUpload={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Middle: Original Document Image / PDF Viewer (4 cols on lg) */}
            <div className="lg:col-span-4 h-full min-h-[400px] lg:min-h-[600px] flex flex-col">
              <DocumentViewer
                page={activePage}
                allPages={activeFile?.pages || []}
                activePageIndex={activePageIndex}
                onSelectPageIndex={(idx) => setActivePageIndex(idx)}
              />
            </div>

            {/* Right: AI OCR Output & Math Equation Studio (5 cols on lg) */}
            <div className="lg:col-span-5 h-full min-h-[500px] lg:min-h-[600px] flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              {/* Studio Header Toolbar */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                {/* View Mode Toggle: Split / KaTeX Render / Markdown Source */}
                <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveViewTab('split')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      activeViewTab === 'split'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title="Chế độ chia đôi (Xem trước KaTeX & Trình soạn thảo)"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Chia đôi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveViewTab('rendered')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      activeViewTab === 'rendered'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title="Xem trước kết quả hiển thị công thức chuẩn"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Công thức (KaTeX)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveViewTab('editor')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      activeViewTab === 'editor'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title="Chỉnh sửa mã nguồn Markdown & LaTeX"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Mã LaTeX</span>
                  </button>
                </div>

                {/* Single Page OCR & Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {activePage && activePage.status === 'idle' && (
                    <button
                      type="button"
                      onClick={() => handleProcessPage(activeFile.id, activePageIndex)}
                      disabled={isProcessingAny}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Nhận diện trang này</span>
                    </button>
                  )}

                  {activePage && activePage.status === 'processing' && (
                    <div className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 rounded-md flex items-center gap-1.5">
                      <RotateCw className="w-3 h-3 animate-spin text-blue-600" />
                      <span>Đang OCR...</span>
                    </div>
                  )}

                  {activePage && activePage.status === 'done' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleProcessPage(activeFile.id, activePageIndex)}
                        disabled={isProcessingAny}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Chạy lại OCR cho trang này"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyCurrentMarkdown}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Sao chép nội dung trang này"
                      >
                        {copiedSuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* LaTeX Math Formula Quick Insertion Toolbar */}
              <LatexToolbar
                onInsert={handleInsertSnippet}
                onAiFix={handleAiFixLatex}
                isAiFixing={isAiFixing}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Idle / Empty Page State */}
                {activePage && activePage.status === 'idle' && !activePage.markdownText && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Sẵn sàng nhận diện công thức toán
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Nhấn &quot;Nhận diện trang này&quot; để Gemini OCR trích xuất công thức, bảng biểu và văn bản sang LaTeX.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleProcessPage(activeFile.id, activePageIndex)}
                      className="mt-4 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Bắt đầu OCR AI</span>
                    </button>
                  </div>
                )}

                {/* Processing State */}
                {activePage && activePage.status === 'processing' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                    <RotateCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Đang phân tích cấu trúc toán học...
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Đang trích xuất công thức LaTeX, bảng số liệu và căn chỉnh bố cục tài liệu.
                    </p>
                  </div>
                )}

                {/* Error State */}
                {activePage && activePage.status === 'error' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-red-500 bg-red-50/20 dark:bg-red-950/20">
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <h3 className="text-sm font-bold">Xảy ra lỗi trong quá trình nhận diện</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      {activePage.errorMessage || 'Vui lòng kiểm tra lại hình ảnh hoặc kết nối mạng'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleProcessPage(activeFile.id, activePageIndex)}
                      className="mt-3 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {/* View Modes */}
                {activePage && (activePage.status === 'done' || activePage.markdownText) && (
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    {/* Mode 1: Split View (Top/Bottom or Side-by-Side in container) */}
                    {activeViewTab === 'split' && (
                      <div className="flex-1 grid grid-rows-2 h-full overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                        {/* KaTeX Live Render View */}
                        <div className="overflow-y-auto flex-1 p-1 bg-slate-50/40 dark:bg-slate-900/40">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-blue-500" /> Kết quả hiển thị (Rendered Math):
                          </div>
                          <MathRenderer content={activePage.markdownText} />
                        </div>

                        {/* LaTeX Source Textarea */}
                        <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-900">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                            <Code2 className="w-3 h-3 text-purple-500" /> Trình chỉnh sửa Markdown &amp; LaTeX:
                          </div>
                          <textarea
                            ref={editorTextareaRef}
                            value={activePage.markdownText}
                            onChange={(e) => handleUpdatePageMarkdown(e.target.value)}
                            placeholder="Mã Markdown & LaTeX sẽ hiển thị tại đây..."
                            className="flex-1 w-full p-4 font-mono text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none leading-relaxed text-slate-800 dark:text-slate-200 overflow-y-auto"
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* Mode 2: KaTeX Render View Only */}
                    {activeViewTab === 'rendered' && (
                      <div className="flex-1 overflow-y-auto">
                        <MathRenderer content={activePage.markdownText} />
                      </div>
                    )}

                    {/* Mode 3: LaTeX Code Editor Only */}
                    {activeViewTab === 'editor' && (
                      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                        <textarea
                          ref={editorTextareaRef}
                          value={activePage.markdownText}
                          onChange={(e) => handleUpdatePageMarkdown(e.target.value)}
                          placeholder="Mã Markdown & LaTeX..."
                          className="flex-1 w-full p-4 font-mono text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none leading-relaxed text-slate-800 dark:text-slate-200 overflow-y-auto"
                          spellCheck={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Export to Word (.docx) & File Hub Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        files={files}
      />

      {/* Samples Selector Dialog */}
      {isSamplesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Chọn tài liệu toán mẫu để thử nghiệm</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSamplesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_DATASETS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {sample.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 group-hover:text-blue-600">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">
                    {sample.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
