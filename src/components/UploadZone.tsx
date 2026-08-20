import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Zap,
  BookOpen,
  PenTool,
  Grid,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { OcrMode, UploadedFileItem, ProcessedPage } from '../types';
import { renderPdfToImages } from '../lib/pdfHelper';
import { SAMPLE_DATASETS, SampleItem } from '../data/samples';

interface UploadZoneProps {
  onFilesAdded: (newFiles: UploadedFileItem[]) => void;
  selectedMode: OcrMode;
  onModeChange: (mode: OcrMode) => void;
  onLoadSample: (sample: SampleItem) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesAdded,
  selectedMode,
  onModeChange,
  onLoadSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;

    try {
      setIsProcessingFiles(true);
      const newItems: UploadedFileItem[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgress(`Đang chuẩn bị tệp ${i + 1}/${fileList.length}: ${file.name}...`);

        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          // Render PDF to image pages
          const pageImages = await renderPdfToImages(file);
          const pages: ProcessedPage[] = pageImages.map((imgUrl, pageIdx) => ({
            id: `page-${fileId}-${pageIdx + 1}`,
            fileId,
            fileName: file.name,
            pageNumber: pageIdx + 1,
            totalPages: pageImages.length,
            originalImage: imgUrl,
            status: 'idle',
            markdownText: '',
          }));

          newItems.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: 'pdf',
            pages,
            activePageIndex: 0,
            status: 'idle',
          });
        } else {
          // Read image as Data URL
          const imgUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          const pages: ProcessedPage[] = [
            {
              id: `page-${fileId}-1`,
              fileId,
              fileName: file.name,
              pageNumber: 1,
              totalPages: 1,
              originalImage: imgUrl,
              status: 'idle',
              markdownText: '',
            },
          ];

          newItems.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type || 'image',
            pages,
            activePageIndex: 0,
            status: 'idle',
          });
        }
      }

      if (newItems.length > 0) {
        onFilesAdded(newItems);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      alert(`Lỗi đọc tệp: ${err.message || 'Không thể xử lý tệp được chọn'}`);
    } finally {
      setIsProcessingFiles(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFileList(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.005]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/bmp"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
            <Upload className="w-7 h-7 stroke-[1.75]" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Kéo thả tài liệu PDF hoặc Ảnh vào đây, hoặc{' '}
              <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">chọn từ máy tính</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hỗ trợ tệp PDF đa trang, PNG, JPG, JPEG, WEBP (Tự động nhận diện công thức toán, đề thi, bài tập)
            </p>
          </div>

          {isProcessingFiles && (
            <div className="mt-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium animate-pulse flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>{uploadProgress || 'Đang tách trang và dựng bản xem trước...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* OCR Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Chế độ nhận diện AI:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {[
            { id: 'academic_exam', label: 'Đề thi & Học thuật', icon: BookOpen },
            { id: 'handwritten_notes', label: 'Chữ viết tay', icon: PenTool },
            { id: 'table_dense', label: 'Bảng & Ma trận', icon: Grid },
            { id: 'general_math', label: 'Công thức chung', icon: Zap },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id as OcrMode)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sample Presets Quick Load */}
      <div className="p-3 bg-slate-50/80 dark:bg-slate-900/40 rounded-lg border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Dữ liệu mẫu dùng thử ngay (1-Click Test):
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLE_DATASETS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onLoadSample(sample)}
              className="p-2.5 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {sample.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-medium">
                    Nạp mẫu &rarr;
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {sample.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
