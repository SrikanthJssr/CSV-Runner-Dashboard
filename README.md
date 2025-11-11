# 🏃 CSV Runner Dashboard (Next.js + shadcn/ui)

A modern Glassmorphic Runner Analytics Dashboard built with Next.js 14, Tailwind CSS, shadcn/ui, and Recharts.
Users can upload a CSV file containing columns — date, person, and miles run — to visualize daily and per-person running activity, track metrics, and export reports.

## 🧩 1. Project Overview

This project was developed as part of the Full Stack Development Internship Assignment to demonstrate the ability to:

- Parse and validate CSV data

- Handle real-time visualization using charts

- Build a responsive, accessible, and modern dashboard using Next.js + shadcn/ui

### 🏁 Challenge Objective

Build a dashboard that:

- Lets users upload CSV files with columns:
  date, person, and miles run

- Validates header correctness and handles parsing errors gracefully.

- Displays computed metrics like total, average, minimum, and maximum miles.

- Visualizes data using charts for both overall and per-person performance.

- Provides clean UI/UX, error handling, and file export features.



## 💡 2. Assumptions

To keep the app focused and stable, the following assumptions were made:

- The CSV file must contain the headers date, person, and miles run.

- Header names are case-insensitive and allow variations like Miles_Run or milesRun.

- miles run values must be numeric; non-numeric rows are skipped.

- The app runs fully on the client-side — no backend or database.

- The design prioritizes accessibility, dark/light mode, and modern UI clarity.


## ⚙️ 3. Prerequisites

Make sure you have the following installed locally before running:

| Tool | Version | Purpose |
|------|----------|----------|
| **Node.js** | ≥ 18.x | Run Next.js |
| **npm** | ≥ 9.x | Manage dependencies |
| **Git** | latest | For version control |
| **Browser** | Chrome / Edge / Firefox | For testing dashboard |


No database or environment keys are required for this project.





## 🧰 4. Setup Instructions

Follow these steps to set up and run the project locally:

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SrikanthJssr/csv-runner-dashboard.git
cd csv-runner-dashboard

2️⃣ Install Dependencies
npm install

3️⃣ Run in Development Mode
npm run dev

Then open:
👉 http://localhost:3000

4️⃣ Build for Production
npm run build
npm start
```
## 🧾 5. Sample CSV + Verification

Use the following sample CSV for quick testing and validation:

```csv
date,person,miles run
2025-01-01,John,3.5
2025-01-02,Jane,4.8
2025-01-03,John,5.2
2025-01-03,Mark,6.0
2025-01-04,Jane,2.9

```
### Verification Checklist
- Action	Expected Behavior
- Upload valid CSV	Data is parsed, charts render
- Upload invalid CSV	Clear error shown: “Missing headers: …”
- Clear Data	All records reset
- Export CSV	Downloads current dataset
- Export PDF	Downloads formatted report
- Toggle Dark Mode	Smooth color transition
- Resize window	Responsive charts & layout


## 🌈 6. Features & Limitations

### ✅ Features Implemented

- 🧾 **CSV Parsing** via [`papaparse`](https://www.papaparse.com/)  
- 📊 **Real-time Charts** (Line + Bar) using [`recharts`](https://recharts.org/)  
- 🧠 **Error Validation** for incorrect or missing headers  
- 📈 **Metrics Dashboard:** total, average, min, and max miles  
- 🌗 **Dark / Light Mode** toggle with [`next-themes`](https://github.com/pacocoursey/next-themes)  
- 💎 **Glassmorphic UI:** gradient cards, frosted blur, and hover effects  
- 📱 **Responsive Design** across all screen sizes  
- 📤 **PDF + CSV Export** using [`jsPDF`](https://github.com/parallax/jsPDF) and `autoTable`  

---

### ⚠️ Known Limitations

- 🚫 No backend persistence — data resets on page reload  
- 🐢 Large CSV files (> 5 MB) may parse slowly in-browser  
- 🔍 Advanced filtering (e.g., date range) not yet implemented  

---

### 💭 Future Improvements

- 👤 Add login and cloud sync for saved CSVs  
- 🔢 Add filtering by date or person  
- ⏱️ Integrate average pace and distance tracking  
- 📲 Improve mobile layout and accessibility further  





## ⚙️ 7. State & Data Flow

The app follows a **simple client-side state flow** using React Hooks to manage data and UI updates.  
No backend or API calls are required — everything runs directly in the browser.  

---

### 🔄 Data Flow Overview

```text
CSV File Upload
      ↓
Parse data with PapaParse
      ↓
Store parsed data in useState()
      ↓
Compute metrics using useMemo()
      ↓
Render charts & tables dynamically
```

## ♿ 8. Accessibility & UI Design

Accessibility and clean UI were prioritized throughout the project.  
The interface follows **WCAG guidelines** for readability, keyboard focus, and color contrast.

---

### ✅ Techniques Used

- 🎨 **Color Contrast:** All text and background combinations meet accessibility contrast standards.  
- ⌨️ **Keyboard Navigation:** Every button and upload input is fully tabbable and focusable.  
- 🔘 **Focus Indicators:** Tailwind’s `focus:ring` utilities highlight focus states clearly.  
- 🔤 **Typography:** Legible Inter font with balanced line-height and spacing for long sessions.  
- 🌀 **Animations:** Smooth transitions using **Framer Motion** for natural visual flow.  
- 🧊 **Glassmorphism:** Subtle transparency and backdrop blur applied to cards and containers for a modern aesthetic.  

---

### 🎨 Visual Style Guide

| Element | Design Style |
|----------|---------------|
| **Cards** | Frosted-glass background with blur and soft shadow |
| **Buttons** | Gradient fills (`from-blue-500` → `to-indigo-600`) with hover glow |
| **Charts** | Soft grid lines, rounded bars, responsive layout |
| **Background** | Gradient blend from deep teal → navy (`#0f2027 → #203a43 → #2c5364`) |
| **Transitions** | Subtle hover scaling and shadow animation |
| **Dark Mode** | Smooth color inversion via `next-themes` |

---

### 🌟 UI Philosophy

> “Good design is invisible — the focus should remain on the data.”

The dashboard uses **clarity over clutter**, maintaining consistency across components with the shadcn/ui system, ensuring:
- Reusable, composable React components  
- Scalable color and spacing tokens  
- Mobile-first responsiveness  
