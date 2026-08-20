import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large JSON payload for base64 images and PDF files
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint: AI OCR for Math Documents, Exams, and Handwriting
app.post("/api/ocr", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", mode = "academic_exam", customPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No imageBase64 data provided" });
    }

    const ai = getGeminiClient();

    // Clean base64 string if it has data URL prefix
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

    let systemPrompt = `You are a world-class Academic OCR and Mathematical Document Transcription Expert.
Your mission is to transcribe the provided image/document into precise, beautifully structured Markdown with 100% accurate LaTeX math formulas.

SPECIFIC RULES:
1. HEADINGS & STRUCTURE:
   - Preserve all titles, section numbers (e.g., "# ĐỀ THI...", "## Phần I: Câu hỏi trắc nghiệm", "### Câu 1:", "Problem 1:").
   - Preserve ordered/bulleted lists, question options (A. B. C. D.), and answer choices.
   - Preserve bold (**text**), italic (*text*), and underlined or emphasized terms.

2. MATHEMATICAL FORMULAS (CRITICAL):
   - ALL mathematical expressions must be written in standard LaTeX.
   - For inline math within a sentence, wrap in single dollar signs: $formula$ (e.g. $f(x) = x^2 + 2x - 3$, $\\alpha = 45^\\circ$, $x \\in \\mathbb{R}$).
   - For standalone or major display equations, wrap in double dollar signs on their own block:
     $$
     \\int_{0}^{\\pi} \\sin^2(x) dx = \\frac{\\pi}{2}
     $$
   - Common notations to use accurately:
     * Fractions: \\frac{a}{b}
     * Square roots & nth roots: \\sqrt{x}, \\sqrt[n]{x}
     * Powers & Subscripts: x_1^2, a_{n+1}
     * Integrals, Summations, Limits: \\int_{a}^{b}, \\sum_{i=1}^{n}, \\lim_{x \\to x_0}
     * Matrices & Systems of equations: \\begin{pmatrix}...\\end{pmatrix}, \\begin{cases}...\\end{cases}
     * Greek letters: \\alpha, \\beta, \\gamma, \\Delta, \\pi, \\theta, \\lambda, \\omega, etc.
     * Vectors & geometry: \\vec{u}, \\overrightarrow{AB}, \\angle ABC, \\Delta ABC
     * Set symbols: \\in, \\notin, \\subset, \\cup, \\cap, \\mathbb{R}, \\mathbb{N}, \\mathbb{Z}

3. TABLES:
   - Convert all data tables, variation tables (bảng biến thiên), truth tables, or score sheets into clean Markdown tables.

4. HANDWRITING & SKETCHES:
   - If there is handwritten math or text, decipher it carefully and transcribe as accurate LaTeX/text.

5. OUTPUT FORMAT:
   - Return ONLY the clean Markdown content with embedded LaTeX.
   - Do NOT wrap the entire response in extra \`\`\`markdown code fences unless needed for a code snippet.
   - Do NOT add chatty conversational introductions or conclusions.`;

    if (mode === "handwritten_notes") {
      systemPrompt += `\nSPECIAL FOCUS: The document contains handwritten notes and derivations. Pay extra attention to superscripts, subscripts, variable names (e.g. t vs +, x vs \\times), and multi-step derivations.`;
    } else if (mode === "table_dense") {
      systemPrompt += `\nSPECIAL FOCUS: High density of tables, matrices, and tabular columns. Format each table cleanly with Markdown alignment.`;
    }

    if (customPrompt) {
      systemPrompt += `\nAdditional User Request: ${customPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64,
            },
          },
          {
            text: "Transcribe this mathematical document into Markdown with exact LaTeX formulas following all the instructions.",
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    const markdownText = response.text || "";

    res.json({
      success: true,
      text: markdownText,
    });
  } catch (error: any) {
    console.error("OCR error:", error);
    res.status(500).json({
      error: error.message || "Failed to process image with Gemini OCR",
    });
  }
});

// Endpoint: AI LaTeX & Math Fixer / Formatter
app.post("/api/fix-latex", async (req, res) => {
  try {
    const { content, instruction } = req.body;

    if (!content) {
      return res.status(400).json({ error: "No content provided to fix" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          text: `You are an expert LaTeX and academic document proofreader.
Fix any broken LaTeX syntax, unclosed dollar signs, syntax errors, mismatched brackets, table formatting, or missing symbols in the following Markdown + LaTeX text.
User request: ${instruction || "Fix all LaTeX errors and improve formatting without changing mathematical meaning."}

Source text:
${content}

Return ONLY the corrected Markdown content.`,
        },
      ],
      config: {
        temperature: 0.1,
      },
    });

    res.json({
      success: true,
      fixedText: response.text || content,
    });
  } catch (error: any) {
    console.error("Fix LaTeX error:", error);
    res.status(500).json({
      error: error.message || "Failed to refine LaTeX document",
    });
  }
});

// Setup Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Math-to-Word Pro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
