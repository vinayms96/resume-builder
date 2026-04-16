import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { Resume } from '../types';

// ========== PDF EXPORT ==========
// Uses iframe + browser print for native A4 pagination.
// The browser handles break-inside/break-after CSS natively — no pixel-slice issues.

export const exportAsPdf = async (containerId: string): Promise<void> => {
  const container = document.getElementById(containerId);
  if (!container) {
    alert('Error: Could not find resume content to export. Make sure a template is selected.');
    return;
  }

  try {
    // Collect all styles (works in both Vite dev <style> and prod <link> modes)
    const stylesHtml = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-99999px;left:-99999px;width:794px;height:1px;border:0;';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentDocument;
    if (!frameDoc) { document.body.removeChild(iframe); return; }

    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
${stylesHtml}
<style>
  @page { size: A4; margin: 1.4cm; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h2 { break-after: avoid; page-break-after: avoid; }
  h3 { break-after: avoid; page-break-after: avoid; }
  [data-no-break] { break-inside: avoid; page-break-inside: avoid; }
  ul, li { break-inside: avoid; page-break-inside: avoid; }
  section { break-before: auto; }
</style>
</head>
<body>
<div>${container.innerHTML}</div>
</body>
</html>`);
    frameDoc.close();

    // Allow time for all styles to apply before printing
    await new Promise(resolve => setTimeout(resolve, 800));

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up iframe after print dialog closes
    setTimeout(() => { try { document.body.removeChild(iframe); } catch { /* already removed */ } }, 3000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF.');
  }
};


// ========== DOCX EXPORT ==========

const sectionTitle = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, size: 24, bold: true, allCaps: true })],
    spacing: { before: 240, after: 120 },
    border: { bottom: { color: 'auto', space: 1, style: 'single', size: 6 } },
  });

export const exportAsDocx = (data: Resume): void => {
  const children: Paragraph[] = [];

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: data.full_name || 'Your Name', bold: true, size: 44 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
  }));
  if (data.target_role_title) {
    children.push(new Paragraph({
      children: [new TextRun({ text: data.target_role_title, size: 24, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }));
  }
  const contactParts = [data.email, data.phone, [data.city, data.country].filter(Boolean).join(', ')].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 18 })],
      alignment: AlignmentType.CENTER,
    }));
  }
  if (data.linkedin_url) {
    children.push(new Paragraph({
      children: [new TextRun({ text: `LinkedIn: ${data.linkedin_url}`, size: 18 })],
      alignment: AlignmentType.CENTER,
    }));
  }
  if (data.portfolio_url) {
    children.push(new Paragraph({
      children: [new TextRun({ text: `Portfolio: ${data.portfolio_url}`, size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }));
  }

  // Summary
  if (data.summary) {
    children.push(sectionTitle('Professional Summary'));
    children.push(new Paragraph({ children: [new TextRun({ text: data.summary, size: 20 })] }));
  }

  // Skills
  const allSkills = [...(data.skills_core || []), ...(data.skills_tools || []), ...(data.skills_soft || [])];
  if (allSkills.length > 0) {
    children.push(sectionTitle('Skills'));
    if (data.skills_core?.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Core: ', bold: true, size: 20 }), new TextRun({ text: data.skills_core.join(', '), size: 20 })] }));
    }
    if (data.skills_tools?.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Tools: ', bold: true, size: 20 }), new TextRun({ text: data.skills_tools.join(', '), size: 20 })] }));
    }
    if (data.skills_soft?.length > 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Soft Skills: ', bold: true, size: 20 }), new TextRun({ text: data.skills_soft.join(', '), size: 20 })] }));
    }
  }

  // Experience
  if (data.work_experience?.length > 0) {
    children.push(sectionTitle('Work Experience'));
    data.work_experience.forEach((job, i) => {
      if (i > 0) {
        children.push(new Paragraph({
          border: { top: { color: 'D1D5DB', space: 6, style: 'single', size: 4 } },
          spacing: { before: 120, after: 0 },
          children: [],
        }));
      }
      children.push(new Paragraph({
        children: [
          new TextRun({ text: job.title, bold: true, size: 22 }),
          new TextRun({ text: `\t${job.start_date} – ${job.end_date || 'Present'}`, size: 20 }),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: [job.employer, job.location].filter(Boolean).join(', '), italics: true, size: 20 })],
        spacing: { after: 180 },
      }));
      job.achievements?.filter(a => a.trim()).forEach(ach => {
        children.push(new Paragraph({ children: [new TextRun({ text: ach, size: 20 })], bullet: { level: 0 }, spacing: { after: 80 } }));
      });
      if (job.tech_stack?.length > 0) {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'Tech: ', bold: true, size: 20 }), new TextRun({ text: job.tech_stack.join(', '), size: 20 })],
          spacing: { before: 80, after: 80 },
        }));
      }
    });
  }

  // Projects
  if (data.projects?.length > 0) {
    children.push(sectionTitle('Projects'));
    data.projects.forEach((proj, i) => {
      if (i > 0) {
        children.push(new Paragraph({
          border: { top: { color: 'D1D5DB', space: 6, style: 'single', size: 4 } },
          spacing: { before: 120, after: 0 },
          children: [],
        }));
      }
      children.push(new Paragraph({
        children: [
          new TextRun({ text: proj.name, bold: true, size: 22 }),
        ],
      }));
      if (proj.link) {
        children.push(new Paragraph({
          children: [new TextRun({ text: `Portfolio: ${proj.link}`, size: 18, color: '6B7280' })],
          spacing: { after: 160 },
        }));
      }
      proj.description?.forEach(d => {
        children.push(new Paragraph({ children: [new TextRun({ text: d, size: 20 })], bullet: { level: 0 } }));
      });
      if (proj.tech_stack?.length > 0) {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'Tech: ', bold: true, size: 20 }), new TextRun({ text: proj.tech_stack.join(', '), size: 20 })],
          spacing: { before: 160, after: 80 },
        }));
      }
    });
  }

  // Education
  if (data.education?.length > 0) {
    children.push(sectionTitle('Education'));
    data.education.forEach(edu => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: [edu.degree, edu.discipline].filter(Boolean).join(', '), bold: true, size: 22 }),
          new TextRun({ text: `\t${edu.graduation_date || ''}`, size: 20 }),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: edu.institution || '', italics: true, size: 20 })],
        spacing: { after: 80 },
      }));
      if (edu.gpa) {
        children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20 })] }));
      }
    });
  }

  // Certifications
  if (data.certifications?.length > 0) {
    children.push(sectionTitle('Certifications'));
    data.certifications.forEach(cert => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: cert.name, bold: true, size: 22 }),
          new TextRun({ text: ` — ${cert.issuer}`, size: 20 }),
          new TextRun({ text: `\t${cert.issue_date}`, size: 20 }),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      }));
    });
  }

  // Awards
  if (data.awards?.length > 0) {
    children.push(sectionTitle('Awards & Honors'));
    data.awards.forEach(award => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: award.name || '', bold: true, size: 22 }),
          award.issuer ? new TextRun({ text: ` — ${award.issuer}`, size: 20 }) : new TextRun(''),
          award.date ? new TextRun({ text: `\t${award.date}`, size: 20 }) : new TextRun(''),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
      }));
      if (award.description) {
        children.push(new Paragraph({ children: [new TextRun({ text: award.description, size: 20 })], spacing: { after: 60 } }));
      }
    });
  }

  // Languages
  if (data.languages?.length > 0) {
    children.push(sectionTitle('Languages'));
    children.push(new Paragraph({
      children: [new TextRun({
        text: data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · '),
        size: 20,
      })],
    }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) },
          margin: { top: convertInchesToTwip(0.75), right: convertInchesToTwip(0.75), bottom: convertInchesToTwip(0.75), left: convertInchesToTwip(0.75) },
        },
      },
      children,
    }],
  });

  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};


// ========== CSV EXPORT ==========

export const exportAsCsv = (data: Resume): void => {
  const esc = (s?: string | null) => {
    if (!s) return '';
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows: string[][] = [['SECTION', 'FIELD', 'VALUE']];

  rows.push(['Contact', 'Full Name', esc(data.full_name)]);
  rows.push(['Contact', 'Email', esc(data.email)]);
  rows.push(['Contact', 'Phone', esc(data.phone)]);
  rows.push(['Contact', 'City', esc(data.city)]);
  rows.push(['Contact', 'State/Region', esc(data.state_region)]);
  rows.push(['Contact', 'Country', esc(data.country)]);
  rows.push(['Contact', 'LinkedIn', esc(data.linkedin_url)]);
  rows.push(['Contact', 'Portfolio', esc(data.portfolio_url)]);
  rows.push(['Contact', 'Personal Site', esc(data.personal_site_url)]);

  rows.push(['Role', 'Target Title', esc(data.target_role_title)]);
  rows.push(['Role', 'Seniority', esc(data.seniority_level)]);
  rows.push(['Role', 'Job Family', esc(data.job_family)]);
  if (data.role_keywords?.length) rows.push(['Role', 'Keywords', esc(data.role_keywords.join(', '))]);

  rows.push(['Summary', 'Summary', esc(data.summary)]);

  rows.push(['Skills', 'Core', esc(data.skills_core.join(', '))]);
  rows.push(['Skills', 'Tools', esc(data.skills_tools.join(', '))]);
  rows.push(['Skills', 'Soft', esc(data.skills_soft.join(', '))]);

  data.work_experience?.forEach((job, i) => {
    rows.push([`Experience ${i + 1}`, 'Title', esc(job.title)]);
    rows.push([`Experience ${i + 1}`, 'Employer', esc(job.employer)]);
    rows.push([`Experience ${i + 1}`, 'Location', esc(job.location)]);
    rows.push([`Experience ${i + 1}`, 'Dates', `${esc(job.start_date)} – ${esc(job.end_date || 'Present')}`]);
    job.achievements?.forEach((a, j) => rows.push([`Experience ${i + 1}`, `Achievement ${j + 1}`, esc(a)]));
    rows.push([`Experience ${i + 1}`, 'Tech Stack', esc(job.tech_stack?.join(', '))]);
  });

  data.projects?.forEach((proj, i) => {
    rows.push([`Project ${i + 1}`, 'Name', esc(proj.name)]);
    rows.push([`Project ${i + 1}`, 'URL', esc(proj.link)]);
    proj.description?.forEach((d, j) => rows.push([`Project ${i + 1}`, `Point ${j + 1}`, esc(d)]));
    rows.push([`Project ${i + 1}`, 'Tech Stack', esc(proj.tech_stack?.join(', '))]);
  });

  data.education?.forEach((edu, i) => {
    rows.push([`Education ${i + 1}`, 'Degree', esc(edu.degree)]);
    rows.push([`Education ${i + 1}`, 'Discipline', esc(edu.discipline)]);
    rows.push([`Education ${i + 1}`, 'Institution', esc(edu.institution)]);
    rows.push([`Education ${i + 1}`, 'Graduation', esc(edu.graduation_date)]);
    rows.push([`Education ${i + 1}`, 'GPA', esc(edu.gpa)]);
    if (edu.coursework_highlights?.length) rows.push([`Education ${i + 1}`, 'Coursework', esc(edu.coursework_highlights.join(', '))]);
  });

  data.certifications?.forEach((cert, i) => {
    rows.push([`Certification ${i + 1}`, 'Name', esc(cert.name)]);
    rows.push([`Certification ${i + 1}`, 'Issuer', esc(cert.issuer)]);
    rows.push([`Certification ${i + 1}`, 'Date', esc(cert.issue_date)]);
    if (cert.expiry_date)    rows.push([`Certification ${i + 1}`, 'Expiry Date', esc(cert.expiry_date)]);
    if (cert.credential_id)  rows.push([`Certification ${i + 1}`, 'Credential ID', esc(cert.credential_id)]);
    if (cert.credential_id)  rows.push([`Certification ${i + 1}`, 'Show Credential ID', cert.show_credential_id ? 'true' : 'false']);
    if (cert.credential_url) rows.push([`Certification ${i + 1}`, 'Credential URL', esc(cert.credential_url)]);
    if (cert.credential_url) rows.push([`Certification ${i + 1}`, 'Show Credential URL', cert.show_credential_url ? 'true' : 'false']);
  });

  data.awards?.forEach((a, i) => {
    rows.push([`Award ${i + 1}`, 'Name', esc(a.name)]);
    rows.push([`Award ${i + 1}`, 'Issuer', esc(a.issuer)]);
    rows.push([`Award ${i + 1}`, 'Date', esc(a.date)]);
    rows.push([`Award ${i + 1}`, 'Description', esc(a.description)]);
  });

  data.languages?.forEach((l, i) => {
    rows.push([`Language ${i + 1}`, 'Language', esc(l.language)]);
    rows.push([`Language ${i + 1}`, 'Proficiency', esc(l.proficiency)]);
  });

  data.publications?.forEach((pub, i) => {
    rows.push([`Publication ${i + 1}`, 'Title', esc(pub.title)]);
    rows.push([`Publication ${i + 1}`, 'Venue', esc(pub.venue)]);
    rows.push([`Publication ${i + 1}`, 'Date', esc(pub.date)]);
    if (pub.link)      rows.push([`Publication ${i + 1}`, 'URL', esc(pub.link)]);
    if (pub.highlight) rows.push([`Publication ${i + 1}`, 'Highlight', esc(pub.highlight)]);
  });

  data.volunteering?.forEach((v, i) => {
    rows.push([`Volunteering ${i + 1}`, 'Name', esc(v.name)]);
    rows.push([`Volunteering ${i + 1}`, 'Organization', esc(v.organization)]);
    rows.push([`Volunteering ${i + 1}`, 'Date', esc(v.date)]);
    if (v.description) rows.push([`Volunteering ${i + 1}`, 'Description', esc(v.description)]);
  });

  if (data.work_authorization) rows.push(['Preferences', 'Work Authorization', esc(data.work_authorization)]);
  if (data.clearance)          rows.push(['Preferences', 'Clearance', esc(data.clearance)]);
  if (data.relocation != null) rows.push(['Preferences', 'Relocation', data.relocation ? 'true' : 'false']);
  if (data.remote_preference)  rows.push(['Preferences', 'Remote Preference', esc(data.remote_preference)]);

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'resume_data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
};

// ========== JSON EXPORT ==========

export const exportAsJson = (data: Resume): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const name = data.full_name?.trim().replace(/\s+/g, '_') || 'resume';
  a.download = `${name}_resume.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
};
