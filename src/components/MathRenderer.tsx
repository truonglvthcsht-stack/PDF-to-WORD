import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

interface MathRendererProps {
  content: string;
  fontFamily?: string;
  fontSizePt?: number;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  fontFamily = 'Times New Roman',
  fontSizePt = 12,
}) => {
  if (!content.trim()) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center">
        <p className="text-base font-medium">Chưa có nội dung văn bản để hiển thị.</p>
        <p className="text-xs text-slate-400 mt-1">
          Nhấn &quot;Bắt đầu OCR AI&quot; hoặc chọn một tài liệu mẫu để xem kết quả chuyển đổi công thức.
        </p>
      </div>
    );
  }

  return (
    <div
      className="math-rendered-container p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-full rounded-b-lg shadow-inner overflow-auto leading-relaxed"
      style={{
        fontFamily: fontFamily.includes('Times')
          ? '"Times New Roman", "Times", "Liberation Serif", serif'
          : fontFamily,
        fontSize: `${fontSizePt}pt`,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 border-b border-slate-200 dark:border-slate-800 pb-2 mt-4 mb-3 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400 mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5 text-blue-700 dark:text-blue-300">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-3 leading-relaxed text-slate-800 dark:text-slate-200">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 pl-2 text-slate-800 dark:text-slate-200">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 pl-2 text-slate-800 dark:text-slate-200">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-1.5 my-3 bg-blue-50/50 dark:bg-blue-950/30 text-slate-700 dark:text-slate-300 italic rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
              {children}
            </td>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-md overflow-x-auto text-xs font-mono my-2">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 rounded font-mono text-xs">
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-5 border-t border-slate-200 dark:border-slate-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
