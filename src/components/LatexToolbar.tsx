import React from 'react';
import {
  Divide,
  Superscript,
  Square,
  Sparkles,
  Table as TableIcon,
  Sigma,
  Pi,
  RotateCcw,
} from 'lucide-react';

interface LatexToolbarProps {
  onInsert: (snippet: string) => void;
  onAiFix: () => void;
  isAiFixing: boolean;
}

const LATEX_SHORTCUTS = [
  { label: 'Phân số', code: '\\frac{a}{b}', icon: '½', tooltip: 'Fraction \\frac{a}{b}' },
  { label: 'Căn bậc 2', code: '\\sqrt{x}', icon: '√', tooltip: 'Square Root \\sqrt{x}' },
  { label: 'Căn bậc n', code: '\\sqrt[n]{x}', icon: 'ⁿ√', tooltip: 'N-th Root \\sqrt[n]{x}' },
  { label: 'Tích phân', code: '\\int_{a}^{b} f(x) \\, dx', icon: '∫', tooltip: 'Definite Integral' },
  { label: 'Tổng xích-ma', code: '\\sum_{i=1}^{n} a_i', icon: 'Σ', tooltip: 'Summation' },
  { label: 'Giới hạn', code: '\\lim_{x \\to x_0} f(x)', icon: 'lim', tooltip: 'Limit' },
  { label: 'Ma trận 2x2', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', icon: '[..]', tooltip: '2x2 Matrix' },
  { label: 'Hệ phương trình', code: '\\begin{cases} x + y = 1 \\\\ 2x - y = 3 \\end{cases}', icon: '{', tooltip: 'System of Equations' },
  { label: 'Vectơ', code: '\\vec{u}', icon: '→', tooltip: 'Vector' },
  { label: 'Góc', code: '\\angle ABC', icon: '∠', tooltip: 'Angle' },
  { label: 'Alpha', code: '\\alpha', icon: 'α', tooltip: 'Greek Alpha' },
  { label: 'Beta', code: '\\beta', icon: 'β', tooltip: 'Greek Beta' },
  { label: 'Delta', code: '\\Delta', icon: 'Δ', tooltip: 'Greek Delta' },
  { label: 'Pi', code: '\\pi', icon: 'π', tooltip: 'Greek Pi' },
  { label: 'Vô cùng', code: '\\infty', icon: '∞', tooltip: 'Infinity' },
  { label: 'Tập số thực', code: '\\mathbb{R}', icon: 'ℝ', tooltip: 'Real numbers set' },
  { label: 'Thuộc', code: '\\in', icon: '∈', tooltip: 'Element of' },
  { label: 'Bảng MD', code: '\n| Cột 1 | Cột 2 | Cột 3 |\n| :--- | :---: | ---: |\n| Dữ liệu 1 | $x^2$ | $y$ |\n', icon: '⊞', tooltip: 'Markdown Table' },
];

export const LatexToolbar: React.FC<LatexToolbarProps> = ({ onInsert, onAiFix, isAiFixing }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1.5 flex items-center gap-1">
          <Pi className="w-3.5 h-3.5 text-blue-600" /> Toán:
        </span>
        {LATEX_SHORTCUTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(item.code)}
            title={item.tooltip}
            className="px-2 py-1 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 rounded transition-colors shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={onAiFix}
          disabled={isAiFixing}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
            isAiFixing
              ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-sm'
          }`}
          title="Tự động kiểm tra và sửa lỗi cú pháp LaTeX, ngoặc đóng/mở và căn chỉnh bảng biểu bằng AI"
        >
          {isAiFixing ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Đang tinh chỉnh...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sửa lỗi LaTeX với AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
