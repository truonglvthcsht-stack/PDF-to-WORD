import React from 'react';
import {
  FileDown,
  Sparkles,
  Layers,
  Moon,
  Sun,
  BookOpen,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
  hasProcessedContent: boolean;
  totalPageCount: number;
  donePageCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetWorkspace: () => void;
  onOpenSamples: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  hasProcessedContent,
  totalPageCount,
  donePageCount,
  darkMode,
  onToggleDarkMode,
  onResetWorkspace,
  onOpenSamples,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-serif text-xl font-bold">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Math-to-Word Pro
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                AI Native Equation
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Chuyển đổi PDF &amp; Ảnh công thức toán học sang Microsoft Word (.docx), Markdown &amp; LaTeX
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Samples Button */}
          <button
            type="button"
            onClick={onOpenSamples}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Dữ liệu mẫu</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Reset Workspace if has files */}
          {totalPageCount > 0 && (
            <button
              type="button"
              onClick={onResetWorkspace}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer hidden md:flex"
              title="Làm mới không gian làm việc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Primary Export to Word Button */}
          <button
            type="button"
            onClick={onOpenExport}
            disabled={!hasProcessedContent}
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Xuất Microsoft Word (.docx)</span>
            {donePageCount > 0 && (
              <span className="bg-blue-800 text-blue-100 text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                {donePageCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
