import React, { useState } from 'react';
import {
  X,
  FileDown,
  FileCode,
  Copy,
  Check,
  FileType,
  Sparkles,
  Layers,
  Settings,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExportSettings, UploadedFileItem } from '../types';
import { exportToDocx } from '../lib/docxExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: UploadedFileItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, files }) => {
  const [settings, setSettings] = useState<ExportSettings>({
    documentTitle: 'Tài Liệu Toán Học Chuyển Đổi',
    fontFamily: 'Times New Roman',
    fontSizePt: 12,
    lineSpacing: 1.15,
    accentColor: '#1E3A8A',
    includePageNumbers: true,
    includeCoverPage: false,
    pageBreakBetweenPages: true,
    authorName: 'Giáo viên / Học viên',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // Aggregate all markdown texts from processed pages
  const allPageTexts: string[] = [];
  files.forEach((file) => {
    file.pages.forEach((p) => {
      if (p.markdownText.trim()) {
        allPageTexts.push(p.markdownText);
      }
    });
  });

  const combinedMarkdown = allPageTexts.join('\n\n---\n\n');

  const handleExportWord = async () => {
    if (allPageTexts.length === 0) {
      alert('Không có nội dung nào được OCR để xuất file Word.');
      return;
    }

    try {
      setIsExporting(true);
      const safeTitle = settings.documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Math_Document';
      await exportToDocx(allPageTexts, settings, `${safeTitle}.docx`);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('Word export failed:', err);
      alert(`Lỗi xuất file Word: ${err.message || 'Vui lòng thử lại'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([combinedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.documentTitle.replace(/\s+/g, '_') || 'Math_Doc'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadLatex = () => {
    const latexDoc = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{vietnam}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{geometry}
\\geometry{a4paper, margin=2cm}
\\usepackage{booktabs}
\\usepackage{hyperref}

\\title{${settings.documentTitle}}
\\author{${settings.authorName}}
\\date{\\today}

\\begin{document}
\\maketitle

${combinedMarkdown.replace(/---/g, '\\newpage')}

\\end{document}`;

    const blob = new Blob([latexDoc], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.documentTitle.replace(/\s+/g, '_') || 'Math_Doc'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Xuất Tệp & Cấu Hình Microsoft Word
              </h2>
              <p className="text-xs text-slate-500">
                Tùy chỉnh định dạng văn bản, phông chữ và công thức toán học
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Document Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tiêu đề tài liệu Word (.docx)
              </label>
              <input
                type="text"
                value={settings.documentTitle}
                onChange={(e) => setSettings({ ...settings, documentTitle: e.target.value })}
                placeholder="VD: Đề thi thử THPT Quốc Gia môn Toán"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tên tác giả / Đơn vị
              </label>
              <input
                type="text"
                value={settings.authorName}
                onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
                placeholder="VD: Tổ Toán - THPT Chuyên"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Typography Settings */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-blue-600" /> Định dạng văn bản & Font chữ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Phông chữ (Font)
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) =>
                    setSettings({ ...settings, fontFamily: e.target.value as any })
                  }
                  className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                >
                  <option value="Times New Roman">Times New Roman (Học thuật)</option>
                  <option value="Calibri">Calibri (Hiện đại)</option>
                  <option value="Arial">Arial (Không chân)</option>
                  <option value="Georgia">Georgia (Trang nhã)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Cỡ chữ (Size)
                </label>
                <select
                  value={settings.fontSizePt}
                  onChange={(e) =>
                    setSettings({ ...settings, fontSizePt: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                >
                  <option value={11}>11 pt (Nhỏ gọn)</option>
                  <option value={12}>12 pt (Tiêu chuẩn Đề thi)</option>
                  <option value={13}>13 pt (Dễ đọc)</option>
                  <option value={14}>14 pt (Lớn)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Giãn dòng (Line spacing)
                </label>
                <select
                  value={settings.lineSpacing}
                  onChange={(e) =>
                    setSettings({ ...settings, lineSpacing: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                >
                  <option value={1.15}>1.15 (Tiêu chuẩn)</option>
                  <option value={1.3}>1.3 (Thoáng)</option>
                  <option value={1.5}>1.5 (Rộng)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pageBreakBetweenPages}
                  onChange={(e) =>
                    setSettings({ ...settings, pageBreakBetweenPages: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Ngắt trang (Page Break) giữa từng trang gốc
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includePageNumbers}
                  onChange={(e) =>
                    setSettings({ ...settings, includePageNumbers: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Tự động đánh số trang ở Footer
              </label>
            </div>
          </div>

          {/* Quick Summary of Content */}
          <div className="text-xs text-slate-500 flex items-center justify-between px-1">
            <span>
              Tổng số trang đã OCR: <strong className="text-blue-600 font-bold">{allPageTexts.length}</strong> trang
            </span>
            <span>Công thức toán: Font Cambria Math chuyên dụng Word</span>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(combinedMarkdown, 'md')}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedType === 'md' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Tải về file .md"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Tệp .md</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadLatex}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Tải về file .tex"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Tệp .tex</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleExportWord}
              disabled={isExporting || allPageTexts.length === 0}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <span>Đang tạo file Word...</span>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Tải Xuống Microsoft Word (.docx)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
