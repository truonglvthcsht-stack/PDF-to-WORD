export interface SampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  previewSvg: string;
  defaultMarkdown: string;
}

export const SAMPLE_DATASETS: SampleItem[] = [
  {
    id: 'sample-thpt-exam',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Toán 2025',
    category: 'Đề Thi & Học Thuật',
    badge: 'Đề Thi THPT QG',
    description: 'Chứa câu hỏi trắc nghiệm hàm số, tích phân, hình học không gian Oxyz và số phức với công thức chuẩn LaTeX.',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="white">
      <rect width="600" height="850" fill="#fdfdfd" stroke="#cbd5e1" stroke-width="2"/>
      <text x="300" y="50" font-family="Times New Roman, serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">BỘ GIÁO DỤC VÀ ĐÀO TẠO</text>
      <text x="300" y="75" font-family="Times New Roman, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#1e3a8a">ĐỀ THI THỬ TỐT NGHIỆP THPT NĂM 2025</text>
      <text x="300" y="98" font-family="Times New Roman, serif" font-size="14" font-style="italic" text-anchor="middle" fill="#475569">Môn: TOÁN - Thời gian làm bài: 90 phút</text>
      <line x1="180" y1="110" x2="420" y2="110" stroke="#0f172a" stroke-width="1.5"/>

      <text x="40" y="160" font-family="Times New Roman, serif" font-size="15" font-weight="bold" fill="#0f172a">Câu 1.</text>
      <text x="95" y="160" font-family="Times New Roman, serif" font-size="14" fill="#1e293b">Cho hàm số y = f(x) có bảng xét dấu đạo hàm như sau:</text>
      
      <!-- Table preview -->
      <rect x="50" y="180" width="500" height="70" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
      <line x1="50" y1="215" x2="550" y2="215" stroke="#64748b" stroke-width="1"/>
      <line x1="120" y1="180" x2="120" y2="250" stroke="#64748b" stroke-width="1"/>
      <text x="75" y="202" font-family="Times New Roman" font-size="14" font-style="italic" fill="#0f172a">x</text>
      <text x="140" y="202" font-family="Times New Roman" font-size="13" fill="#0f172a">-∞</text>
      <text x="240" y="202" font-family="Times New Roman" font-size="13" fill="#0f172a">-1</text>
      <text x="350" y="202" font-family="Times New Roman" font-size="13" fill="#0f172a">2</text>
      <text x="490" y="202" font-family="Times New Roman" font-size="13" fill="#0f172a">+∞</text>
      
      <text x="70" y="238" font-family="Times New Roman" font-size="14" font-style="italic" fill="#0f172a">f'(x)</text>
      <text x="180" y="238" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#2563eb">+</text>
      <text x="240" y="238" font-family="Times New Roman" font-size="13" fill="#0f172a">0</text>
      <text x="295" y="238" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#ef4444">-</text>
      <text x="350" y="238" font-family="Times New Roman" font-size="13" fill="#0f172a">0</text>
      <text x="430" y="238" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#2563eb">+</text>

      <text x="40" y="280" font-family="Times New Roman" font-size="14" fill="#0f172a">Hàm số đã cho đạt cực đại tại điểm:</text>
      <text x="60" y="310" font-family="Times New Roman" font-size="14" fill="#0f172a">A. x = 2.</text>
      <text x="200" y="310" font-family="Times New Roman" font-size="14" fill="#0f172a">B. x = -1.</text>
      <text x="340" y="310" font-family="Times New Roman" font-size="14" fill="#0f172a">C. x = 0.</text>
      <text x="460" y="310" font-family="Times New Roman" font-size="14" fill="#0f172a">D. x = 1.</text>

      <text x="40" y="370" font-family="Times New Roman, serif" font-size="15" font-weight="bold" fill="#0f172a">Câu 2.</text>
      <text x="95" y="370" font-family="Times New Roman, serif" font-size="14" fill="#1e293b">Tính tích phân: I = ∫ (2x + 1) e^x dx từ 0 đến 1</text>
      <text x="60" y="410" font-family="Times New Roman" font-size="14" fill="#0f172a">A. I = e + 1.</text>
      <text x="200" y="410" font-family="Times New Roman" font-size="14" fill="#0f172a">B. I = 2e - 1.</text>
      <text x="340" y="410" font-family="Times New Roman" font-size="14" fill="#0f172a">C. I = e + 2.</text>
      <text x="460" y="410" font-family="Times New Roman" font-size="14" fill="#0f172a">D. I = 3e - 2.</text>

      <text x="40" y="470" font-family="Times New Roman, serif" font-size="15" font-weight="bold" fill="#0f172a">Câu 3.</text>
      <text x="95" y="470" font-family="Times New Roman, serif" font-size="14" fill="#1e293b">Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 2z - 3 = 0. Khoảng cách từ</text>
      <text x="40" y="495" font-family="Times New Roman, serif" font-size="14" fill="#1e293b">điểm M(1; 2; 3) đến mặt phẳng (P) bằng:</text>
      <text x="60" y="530" font-family="Times New Roman" font-size="14" fill="#0f172a">A. d = 1.</text>
      <text x="200" y="530" font-family="Times New Roman" font-size="14" fill="#0f172a">B. d = 2.</text>
      <text x="340" y="530" font-family="Times New Roman" font-size="14" fill="#0f172a">C. d = 4/3.</text>
      <text x="460" y="530" font-family="Times New Roman" font-size="14" fill="#0f172a">D. d = 3.</text>
      
      <text x="300" y="800" font-family="Times New Roman" font-size="12" fill="#94a3b8" text-anchor="middle">--- Trang 1/1 ---</text>
    </svg>`,
    defaultMarkdown: `# BỘ GIÁO DỤC VÀ ĐÀO TẠO
## ĐỀ THI THỬ TỐT NGHIỆP THPT NĂM 2025
*Môn: TOÁN - Thời gian làm bài: 90 phút*

---

### Câu 1:
Cho hàm số $y = f(x)$ xác định trên $\\mathbb{R} \\setminus \\{0\\}$ có bảng xét dấu đạo hàm như sau:

| $x$ | $-\\infty$ | | $-1$ | | $2$ | | $+\\infty$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f'(x)$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |

Hàm số đã cho đạt cực đại tại điểm:
- **A.** $x = 2$
- **B.** $x = -1$
- **C.** $x = 0$
- **D.** $x = 1$

> **Lời giải:**
> Dựa vào bảng xét dấu, $f'(x)$ đổi dấu từ dương sang âm khi qua điểm $x = -1$. Do đó hàm số đạt cực đại tại $x = -1$.
> **Đáp án đúng:** **B**

---

### Câu 2:
Tính tích phân $I = \\int_{0}^{1} (2x + 1) e^x \\, dx$.

$$
I = \\left[ (2x + 1)e^x \\right]_{0}^{1} - \\int_{0}^{1} 2e^x \\, dx = 3e - 1 - 2(e - 1) = e + 1
$$

- **A.** $I = e + 1$
- **B.** $I = 2e - 1$
- **C.** $I = e + 2$
- **D.** $I = 3e - 2$

> **Đáp án đúng:** **A**

---

### Câu 3:
Trong không gian $Oxyz$, cho mặt phẳng $(P): 2x - y + 2z - 3 = 0$. Khoảng cách từ điểm $M(1; 2; 3)$ đến mặt phẳng $(P)$ bằng:

$$
d(M, (P)) = \\frac{|2(1) - (2) + 2(3) - 3|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|2 - 2 + 6 - 3|}{\\sqrt{9}} = \\frac{3}{3} = 1
$$

- **A.** $d = 1$
- **B.** $d = 2$
- **C.** $d = \\frac{4}{3}$
- **D.** $d = 3$

> **Đáp án đúng:** **A**
`,
  },
  {
    id: 'sample-advanced-calculus',
    title: 'Giải Tích Cao Cấp & Ma Trận Đại Số Tuyến Tính',
    category: 'Đại Học & Nghiên Cứu',
    badge: 'Calculus & Linear Algebra',
    description: 'Chứa hệ phương trình vi phân, chuỗi Taylor/Fourier, tích phân bội và ma trận nghịch đảo.',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="white">
      <rect width="600" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <text x="300" y="55" font-family="Times New Roman" font-size="20" font-weight="bold" text-anchor="middle" fill="#0f172a">ADVANCED CALCULUS &amp; LINEAR ALGEBRA</text>
      <text x="300" y="80" font-family="Times New Roman" font-size="14" font-style="italic" text-anchor="middle" fill="#64748b">Final Examination - Semester I</text>
      <line x1="100" y1="100" x2="500" y2="100" stroke="#e2e8f0" stroke-width="2"/>

      <text x="50" y="140" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#1e3a8a">Problem 1. Eigenvalues and Diagonalization</text>
      <text x="50" y="170" font-family="Times New Roman" font-size="14" fill="#334155">Let the matrix A be defined as:</text>
      <text x="250" y="210" font-family="Courier New" font-size="16" font-weight="bold" fill="#0f172a">A = [ 4  1 ]</text>
      <text x="286" y="235" font-family="Courier New" font-size="16" font-weight="bold" fill="#0f172a">[ 2  3 ]</text>
      <text x="50" y="280" font-family="Times New Roman" font-size="14" fill="#334155">a) Find the characteristic equation det(A - λI) = 0.</text>
      <text x="50" y="310" font-family="Times New Roman" font-size="14" fill="#334155">b) Compute eigenvalues λ1, λ2 and corresponding eigenvectors v1, v2.</text>

      <text x="50" y="370" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#1e3a8a">Problem 2. Multivariable Double Integral</text>
      <text x="50" y="400" font-family="Times New Roman" font-size="14" fill="#334155">Evaluate the double integral over the disk D = {(x,y) : x² + y² ≤ R²}:</text>
      <text x="180" y="440" font-family="Times New Roman" font-size="16" font-style="italic" fill="#0f172a">∬_D exp(-(x² + y²)) dx dy</text>

      <text x="50" y="500" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#1e3a8a">Problem 3. Differential Equation</text>
      <text x="50" y="530" font-family="Times New Roman" font-size="14" fill="#334155">Solve the second-order homogeneous ODE with initial conditions:</text>
      <text x="180" y="570" font-family="Times New Roman" font-size="16" font-style="italic" fill="#0f172a">y'' + 4y' + 13y = 0,   y(0) = 1, y'(0) = -2</text>
    </svg>`,
    defaultMarkdown: `# Advanced Mathematics & Linear Algebra
## Final Examination — Problem Set

### Problem 1: Eigenvalues and Diagonalization
Given the square matrix $A \\in \\mathbb{R}^{2 \\times 2}$:

$$
A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}
$$

1. Determine the characteristic polynomial:
$$
P(\\lambda) = \\det(A - \\lambda I) = \\det \\begin{pmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{pmatrix} = (4 - \\lambda)(3 - \\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = 0
$$

2. Solving $P(\\lambda) = 0$ yields the eigenvalues:
$$
\\lambda_1 = 5, \\quad \\lambda_2 = 2
$$

3. The corresponding normalized eigenvectors are:
$$
\\vec{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}, \\quad \\vec{v}_2 = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}
$$

---

### Problem 2: Double Gaussian Integral in Polar Coordinates
Evaluate the surface integral over the circular domain $D = \\{ (x, y) \\in \\mathbb{R}^2 \\mid x^2 + y^2 \\le R^2 \\}$:

$$
I = \\iint_D e^{-(x^2 + y^2)} \\, dx\\,dy
$$

Transforming to polar coordinates $x = r\\cos\\theta, y = r\\sin\\theta$ with Jacobian $J = r$:

$$
I = \\int_{0}^{2\\pi} \\! d\\theta \\int_{0}^{R} r e^{-r^2} \\, dr = 2\\pi \\left[ -\\frac{1}{2} e^{-r^2} \\right]_{0}^{R} = \\pi \\left( 1 - e^{-R^2} \\right)
$$

As $R \\to \\infty$, we obtain the classical Gaussian result: $\\lim_{R \\to \\infty} I = \\pi$.

---

### Problem 3: Second-Order Cauchy Initial Value Problem
Solve the homogeneous linear differential equation:

$$
\\frac{d^2 y}{dt^2} + 4 \\frac{dy}{dt} + 13y = 0, \\quad y(0) = 1, \\; y'(0) = -2
$$

Characteristic roots: $r^2 + 4r + 13 = 0 \\implies r = -2 \\pm 3i$.
General solution:
$$
y(t) = e^{-2t} \\left( C_1 \\cos(3t) + C_2 \\sin(3t) \\right)
$$
Applying initial conditions:
- $y(0) = C_1 = 1$
- $y'(0) = -2(1) + 3C_2 = -2 \\implies C_2 = 0$

$$
\\mathbf{y(t) = e^{-2t} \\cos(3t)}
$$
`,
  },
  {
    id: 'sample-handwritten-physics',
    title: 'Ghi Chú Công Thức Vật Lý & Toán Viết Tay',
    category: 'Chữ Viết Tay & Ghi Chú',
    badge: 'Handwritten Notes',
    description: 'Chuyển đổi bài giảng viết tay: Phương trình Maxwell, Định luật cơ học lượng tử Schrödinger và năng lượng dao động.',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="#fffef7">
      <rect width="600" height="850" fill="#fffdfa" stroke="#e2e8f0" stroke-width="2"/>
      <!-- Grid lined paper effect -->
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="600" height="850" fill="url(#grid)" />
      
      <text x="60" y="70" font-family="Comic Sans MS, cursive" font-size="22" font-weight="bold" fill="#1e40af">Quantum Mechanics &amp; Electrodynamics Notes</text>
      <text x="60" y="100" font-family="Comic Sans MS, cursive" font-size="14" fill="#64748b">Lecture 14: Schrödinger Wave Equation</text>

      <text x="60" y="160" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">1. Time-dependent Schrödinger Eq:</text>
      <text x="100" y="210" font-family="Comic Sans MS, cursive" font-size="20" font-weight="bold" fill="#1e3a8a">i ħ (∂Ψ/∂t) = - (ħ² / 2m) ∇²Ψ + V(r) Ψ</text>
      
      <text x="60" y="290" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">2. Energy quantization for 1D Infinite Well:</text>
      <text x="100" y="340" font-family="Comic Sans MS, cursive" font-size="18" fill="#0f172a">E_n = (n² π² ħ²) / (2 m L²),   n = 1, 2, 3...</text>
      
      <text x="60" y="420" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">3. Maxwell's Equations in Differential Form:</text>
      <text x="100" y="460" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">∇ · E = ρ / ε₀</text>
      <text x="100" y="495" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">∇ · B = 0</text>
      <text x="100" y="530" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">∇ × E = - ∂B / ∂t</text>
      <text x="100" y="565" font-family="Comic Sans MS, cursive" font-size="16" fill="#0f172a">∇ × B = μ₀ J + μ₀ ε₀ (∂E / ∂t)</text>
    </svg>`,
    defaultMarkdown: `# Ghi Chú Cơ Học Lượng Tử & Điện Từ Trường (Handwritten Notes)
*Bài giảng số 14: Phương trình sóng Schrödinger & Hệ phương trình Maxwell*

---

### 1. Phương trình Schrödinger phụ thuộc thời gian (Time-Dependent Wave Equation)
Đối với hạt có khối lượng $m$ chuyển động trong thế năng $V(\\vec{r}, t)$:

$$
i\\hbar \\frac{\\partial \\Psi(\\vec{r}, t)}{\\partial t} = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\vec{r}, t) \\right) \\Psi(\\vec{r}, t)
$$

Trong đó:
- $\\hbar = \\frac{h}{2\\pi} \\approx 1.0545718 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$ (hằng số Planck thu gọn).
- $\\Psi(\\vec{r}, t)$ là hàm sóng trạng thái lượng tử.
- $\\nabla^2 = \\frac{\\partial^2}{\\partial x^2} + \\frac{\\partial^2}{\\partial y^2} + \\frac{\\partial^2}{\\partial z^2}$ là toán tử Laplace.

---

### 2. Mức năng lượng giếng thế sâu vô hạn 1 chiều (1D Infinite Potential Well)
Với giếng thế có bề rộng $L$, điều kiện biên $\\Psi(0) = \\Psi(L) = 0$:

$$
E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m L^2} = \\frac{n^2 h^2}{8 m L^2}, \\quad (n = 1, 2, 3, \\dots)
$$

Hàm sóng chuẩn hóa tương ứng:
$$
\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left( \\frac{n\\pi x}{L} \\right)
$$

---

### 3. Hệ Phương Trình Maxwell Dạng Vi Phân
Mô tả toàn diện trường điện từ cổ điển trong môi trường liên tục:

| Định luật vật lý | Dạng vi phân Vector | Ý nghĩa vật lý |
| :--- | :--- | :--- |
| **Gauss cho điện trường** | $\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}$ | Điện tích là nguồn của điện trường |
| **Gauss cho từ trường** | $\\nabla \\cdot \\vec{B} = 0$ | Không tồn tại đơn cực từ |
| **Faraday cảm ứng** | $\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}$ | Từ trường biến thiên sinh điện trường xoáy |
| **Ampère - Maxwell** | $\\nabla \\times \\vec{B} = \\mu_0 \\vec{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}$ | Dòng điện và điện trường biến thiên sinh từ trường |
`,
  },
];
