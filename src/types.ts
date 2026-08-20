export interface ProcessedPage {
  id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  totalPages: number;
  originalImage: string; // base64 or blob URL
  status: 'idle' | 'processing' | 'done' | 'error';
  markdownText: string;
  errorMessage?: string;
  processedAt?: number;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  pages: ProcessedPage[];
  activePageIndex: number;
  status: 'idle' | 'processing' | 'done' | 'error';
}

export interface ExportSettings {
  documentTitle: string;
  fontFamily: 'Times New Roman' | 'Calibri' | 'Arial' | 'Georgia';
  fontSizePt: number;
  lineSpacing: number; // 1.15, 1.5, 2.0
  accentColor: string; // hex
  includePageNumbers: boolean;
  includeCoverPage: boolean;
  pageBreakBetweenPages: boolean;
  authorName: string;
}

export type OcrMode = 'academic_exam' | 'handwritten_notes' | 'table_dense' | 'general_math';
