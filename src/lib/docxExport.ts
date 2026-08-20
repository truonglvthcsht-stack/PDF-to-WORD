import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  ShadingType,
} from 'docx';
import { ExportSettings } from '../types';

/**
 * Parses inline formatting (bold, italic, inline math $...$, code) into TextRun[]
 */
function parseInlineRuns(text: string, fontName: string, baseSizeHalfPt: number): TextRun[] {
  const runs: TextRun[] = [];

  // Tokenize string for math ($...$), bold (**...**), italic (*...*), code (`...`)
  // Regex matches:
  // 1. Math: \$([^$]+)\$
  // 2. Bold: \*\*([^*]+)\*\*
  // 3. Italic: \*([^*]+)\*
  // 4. Code: `([^`]+)`
  const tokenRegex = /(\$[^$]+\$|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      // Inline LaTeX Math Formula
      const mathContent = part.slice(1, -1);
      runs.push(
        new TextRun({
          text: ` ${mathContent} `,
          font: 'Cambria Math',
          italics: true,
          size: baseSizeHalfPt,
          color: '1E3A8A', // Sophisticated academic navy
        })
      );
    } else if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      // Bold text
      runs.push(
        new TextRun({
          text: part.slice(2, -2),
          bold: true,
          font: fontName,
          size: baseSizeHalfPt,
        })
      );
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      // Italic text
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          italics: true,
          font: fontName,
          size: baseSizeHalfPt,
        })
      );
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      // Inline code
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          font: 'Consolas',
          size: baseSizeHalfPt - 2,
          shading: {
            type: ShadingType.CLEAR,
            fill: 'F1F5F9',
          },
        })
      );
    } else {
      // Normal text
      runs.push(
        new TextRun({
          text: part,
          font: fontName,
          size: baseSizeHalfPt,
        })
      );
    }
  }

  return runs.length > 0
    ? runs
    : [
        new TextRun({
          text,
          font: fontName,
          size: baseSizeHalfPt,
        }),
      ];
}

/**
 * Converts a markdown table text block into a Word Table
 */
function createDocxTable(tableLines: string[], fontName: string, baseSizeHalfPt: number): Table {
  const rows: TableRow[] = [];

  // Filter out separator lines like |---|---|
  const contentLines = tableLines.filter((l) => !l.match(/^\|?\s*[-:]+\s*\|[\s-:|]*$/));

  contentLines.forEach((line, rowIndex) => {
    const rawCells = line
      .split('|')
      .map((c) => c.trim())
      .filter((c, idx, arr) => {
        // Drop empty outer boundaries from | cell1 | cell2 |
        if ((idx === 0 || idx === arr.length - 1) && c === '') return false;
        return true;
      });

    if (rawCells.length === 0) return;

    const isHeader = rowIndex === 0;

    const cells = rawCells.map((cellText) => {
      const runs = parseInlineRuns(cellText, fontName, baseSizeHalfPt);
      if (isHeader) {
        runs.forEach((r) => {
          // @ts-expect-error docx property override
          r.bold = true;
        });
      }

      return new TableCell({
        children: [
          new Paragraph({
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: runs,
            spacing: { before: 80, after: 80 },
          }),
        ],
        shading: isHeader
          ? {
              type: ShadingType.CLEAR,
              fill: 'F1F5F9',
            }
          : undefined,
        margins: {
          top: 100,
          bottom: 100,
          left: 150,
          right: 150,
        },
      });
    });

    rows.push(new TableRow({ children: cells }));
  });

  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
}

/**
 * Converts a single Markdown/LaTeX page or document into docx elements
 */
function parseMarkdownToDocxElements(
  markdown: string,
  settings: ExportSettings
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const lines = markdown.split('\n');
  const baseSizeHalfPt = settings.fontSizePt * 2; // docx uses half-points (12pt = 24)
  const fontName = settings.fontFamily;

  let inBlockMath = false;
  let blockMathBuffer: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  const flushBlockMath = () => {
    if (blockMathBuffer.length > 0) {
      const formula = blockMathBuffer.join(' ').trim();
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 180 },
          children: [
            new TextRun({
              text: formula,
              font: 'Cambria Math',
              size: baseSizeHalfPt + 2,
              bold: true,
              color: '1E40AF',
            }),
          ],
        })
      );
      blockMathBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      try {
        const table = createDocxTable(tableBuffer, fontName, baseSizeHalfPt);
        elements.push(table);
        // Add spacing after table
        elements.push(
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [],
          })
        );
      } catch (err) {
        console.error('Error generating table in Word doc:', err);
      }
      tableBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for block math start/end $$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      // Single line block math $$ formula $$
      flushTable();
      const formula = trimmed.slice(2, -2).trim();
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 180 },
          children: [
            new TextRun({
              text: formula,
              font: 'Cambria Math',
              size: baseSizeHalfPt + 2,
              bold: true,
              color: '1E40AF',
            }),
          ],
        })
      );
      continue;
    }

    if (trimmed.startsWith('$$')) {
      flushTable();
      if (!inBlockMath) {
        inBlockMath = true;
        const rest = trimmed.slice(2).trim();
        if (rest) blockMathBuffer.push(rest);
      } else {
        inBlockMath = false;
        flushBlockMath();
      }
      continue;
    }

    if (inBlockMath) {
      if (trimmed.endsWith('$$')) {
        inBlockMath = false;
        const rest = trimmed.slice(0, -2).trim();
        if (rest) blockMathBuffer.push(rest);
        flushBlockMath();
      } else {
        blockMathBuffer.push(trimmed);
      }
      continue;
    }

    // Check for Markdown Table line
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableBuffer.push(trimmed);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          spacing: { before: 300, after: 150 },
          children: [
            new TextRun({
              text: trimmed.replace(/^#\s+/, ''),
              bold: true,
              font: fontName,
              size: baseSizeHalfPt + 8,
              color: '1E3A8A',
            }),
          ],
        })
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: trimmed.replace(/^##\s+/, ''),
              bold: true,
              font: fontName,
              size: baseSizeHalfPt + 4,
              color: '1E40AF',
            }),
          ],
        })
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 100 },
          children: [
            new TextRun({
              text: trimmed.replace(/^###\s+/, ''),
              bold: true,
              font: fontName,
              size: baseSizeHalfPt + 2,
              color: '2563EB',
            }),
          ],
        })
      );
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        new Paragraph({
          spacing: { before: 150, after: 150 },
          border: {
            bottom: {
              color: 'CBD5E1',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          children: [],
        })
      );
      continue;
    }

    // Empty line
    if (!trimmed) {
      elements.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [],
        })
      );
      continue;
    }

    // Bullet list (- item, * item)
    if (trimmed.match(/^[-*]\s+/)) {
      const listContent = trimmed.replace(/^[-*]\s+/, '');
      const runs = parseInlineRuns(listContent, fontName, baseSizeHalfPt);
      elements.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
          children: runs,
        })
      );
      continue;
    }

    // Numbered list (1. item, a) item)
    const numMatch = trimmed.match(/^(\d+\.|\w\))\s+(.*)/);
    if (numMatch) {
      const prefix = numMatch[1];
      const listContent = numMatch[2];
      const runs = parseInlineRuns(listContent, fontName, baseSizeHalfPt);
      elements.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: `${prefix} `,
              bold: true,
              font: fontName,
              size: baseSizeHalfPt,
            }),
            ...runs,
          ],
        })
      );
      continue;
    }

    // Regular paragraph
    const runs = parseInlineRuns(rawLine, fontName, baseSizeHalfPt);
    elements.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: runs,
      })
    );
  }

  // Final flushes
  flushTable();
  flushBlockMath();

  return elements;
}

/**
 * Builds and downloads a full Microsoft Word (.docx) document from an array of Markdown page contents
 */
export async function exportToDocx(
  pagesContent: string[],
  settings: ExportSettings,
  fileName = 'Math_Converted_Document.docx'
): Promise<Blob> {
  const allElements: (Paragraph | Table)[] = [];

  // Optional Document Header Title
  if (settings.documentTitle) {
    allElements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: settings.documentTitle,
            bold: true,
            font: settings.fontFamily,
            size: settings.fontSizePt * 2 + 10,
            color: '0F172A',
          }),
        ],
      })
    );

    if (settings.authorName) {
      allElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 300 },
          children: [
            new TextRun({
              text: `Tác giả / Người thực hiện: ${settings.authorName}`,
              italics: true,
              font: settings.fontFamily,
              size: settings.fontSizePt * 2 - 2,
              color: '64748B',
            }),
          ],
        })
      );
    }
  }

  // Process each page
  pagesContent.forEach((content, idx) => {
    if (!content.trim()) return;

    if (idx > 0 && settings.pageBreakBetweenPages) {
      allElements.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    const pageElements = parseMarkdownToDocxElements(content, settings);
    allElements.push(...pageElements);
  });

  // Construct Word Document
  const doc = new Document({
    title: settings.documentTitle || 'Math Document',
    creator: settings.authorName || 'Math-to-Word Pro',
    description: 'Converted from PDF/Image by Math-to-Word Pro AI OCR',
    styles: {
      default: {
        document: {
          run: {
            font: settings.fontFamily,
            size: settings.fontSizePt * 2,
          },
          paragraph: {
            spacing: {
              line: Math.round(settings.lineSpacing * 240),
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: settings.documentTitle || 'Math-to-Word Pro Converter',
                    font: settings.fontFamily,
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Trang ',
                    font: settings.fontFamily,
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: settings.fontFamily,
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    text: ' / ',
                    font: settings.fontFamily,
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: settings.fontFamily,
                    size: 18,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        children: allElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return blob;
}
