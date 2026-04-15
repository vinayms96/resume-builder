# Resume Builder

An ATS-friendly resume builder with real-time preview, multiple templates, and job description match scoring. Built with React + TypeScript + Vite.

**Live demo:** [vinayms96.github.io/resume-builder](https://vinayms96.github.io/resume-builder)

---

## Features

- **3 resume templates** — Classic ATS, Tech Impact, Modern Pro (with photo)
- **Real-time preview** — updates as you type
- **Profile Score** — completeness heuristic across all resume sections
- **ATS Match Score** — paste a job description to get keyword match percentage
- **Export** — PDF (print-ready), DOCX (Word), CSV
- **Encrypted local storage** — resume data stored with AES-GCM 256-bit encryption
- **Sample data** — load a sample resume to preview templates instantly
- **Profile photo upload** — resize + crop, used in Modern Pro template
- **Dev tools** — raw JSON viewer + restore panel (dev mode only)

## Templates

| Template | Best for |
|----------|----------|
| Classic ATS | Traditional roles — healthcare, legal, finance, education |
| Tech Impact | Engineering, data, software roles |
| Modern Pro | Design, product, creative roles — supports profile photo |

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Web Crypto API (AES-GCM encryption)
- jsPDF + html2canvas (PDF export)
- docx (Word export)

## Run Locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/vinayms96/resume-builder.git
cd resume-builder
npm install
npm run dev
```

App runs at `http://localhost:3000`

## License

[MIT](LICENSE)
