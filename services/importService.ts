import { Resume, WorkItem, Project, Education, Certification, Award, Language, Publication, Volunteering } from '../types';

// ========== CSV PARSER (RFC 4180) ==========

function parseCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"')            { inQuotes = false; }
      else                            { field += ch; }
    } else {
      if      (ch === '"')  { inQuotes = true; }
      else if (ch === ',')  { row.push(field); field = ''; }
      else if (ch === '\r') { /* skip */ }
      else if (ch === '\n') {
        row.push(field); field = '';
        if (row.some(f => f.trim())) rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
  }
  // flush last row
  row.push(field);
  if (row.some(f => f.trim())) rows.push(row);

  return rows;
}

// ========== CSV IMPORT ==========

function emptyResume(): Resume {
  return {
    full_name: '', email: '', phone: '', country: '',
    target_role_title: '', job_family: 'Software & IT', summary: '',
    work_experience: [], projects: [], education: [], certifications: [],
    skills_core: [], skills_tools: [], skills_soft: [],
    awards: [], publications: [], volunteering: [], languages: [],
  };
}

export function importFromCsv(text: string): Resume {
  const allRows = parseCSVRows(text);
  // Skip header row (SECTION, FIELD, VALUE)
  const dataRows = allRows.slice(1).filter(r => r.length >= 2);

  // Build section → [{field, value}] map
  const sectionEntries = new Map<string, { field: string; value: string }[]>();
  for (const row of dataRows) {
    const section = (row[0] || '').trim();
    const field   = (row[1] || '').trim();
    const value   = (row[2] || '').trim();
    if (!section || !field) continue;
    if (!sectionEntries.has(section)) sectionEntries.set(section, []);
    sectionEntries.get(section)!.push({ field, value });
  }

  const get = (section: string, field: string): string =>
    sectionEntries.get(section)?.find(e => e.field === field)?.value || '';

  const splitList = (s: string): string[] =>
    s ? s.split(', ').map(x => x.trim()).filter(Boolean) : [];

  const resume = emptyResume();

  // Contact
  resume.full_name        = get('Contact', 'Full Name');
  resume.email            = get('Contact', 'Email');
  resume.phone            = get('Contact', 'Phone');
  resume.city             = get('Contact', 'City')          || undefined;
  resume.state_region     = get('Contact', 'State/Region')  || undefined;
  resume.country          = get('Contact', 'Country');
  resume.linkedin_url     = get('Contact', 'LinkedIn')      || undefined;
  resume.portfolio_url    = get('Contact', 'Portfolio')     || undefined;
  resume.personal_site_url= get('Contact', 'Personal Site') || undefined;

  // Role
  resume.target_role_title = get('Role', 'Target Title');
  const seniority = get('Role', 'Seniority');
  if (seniority) resume.seniority_level = seniority as Resume['seniority_level'];
  const jobFamily = get('Role', 'Job Family');
  if (jobFamily) resume.job_family = jobFamily as Resume['job_family'];
  const keywords = get('Role', 'Keywords');
  if (keywords) resume.role_keywords = splitList(keywords);

  // Summary
  resume.summary = get('Summary', 'Summary');

  // Skills
  resume.skills_core  = splitList(get('Skills', 'Core'));
  resume.skills_tools = splitList(get('Skills', 'Tools'));
  resume.skills_soft  = splitList(get('Skills', 'Soft'));

  // Work Experience
  for (let i = 1; sectionEntries.has(`Experience ${i}`); i++) {
    const sec = `Experience ${i}`;
    const dates = get(sec, 'Dates');
    const [rawStart = '', rawEnd = ''] = dates.split(' – ').map(d => d.trim());
    const achievements: string[] = [];
    for (let j = 1; get(sec, `Achievement ${j}`); j++) {
      achievements.push(get(sec, `Achievement ${j}`));
    }
    const job: WorkItem = {
      title:      get(sec, 'Title'),
      employer:   get(sec, 'Employer'),
      start_date: rawStart,
      end_date:   rawEnd === 'Present' ? '' : rawEnd || undefined,
      location:   get(sec, 'Location') || undefined,
      achievements,
      tech_stack: splitList(get(sec, 'Tech Stack')),
    };
    resume.work_experience.push(job);
  }

  // Projects
  for (let i = 1; sectionEntries.has(`Project ${i}`); i++) {
    const sec = `Project ${i}`;
    const description: string[] = [];
    for (let j = 1; get(sec, `Point ${j}`); j++) {
      description.push(get(sec, `Point ${j}`));
    }
    const proj: Project = {
      name:       get(sec, 'Name'),
      link:       get(sec, 'URL') || undefined,
      description,
      tech_stack: splitList(get(sec, 'Tech Stack')),
    };
    resume.projects.push(proj);
  }

  // Education
  for (let i = 1; sectionEntries.has(`Education ${i}`); i++) {
    const sec = `Education ${i}`;
    const coursework = get(sec, 'Coursework');
    const edu: Education = {
      degree:                get(sec, 'Degree'),
      discipline:            get(sec, 'Discipline')  || undefined,
      institution:           get(sec, 'Institution') || undefined,
      graduation_date:       get(sec, 'Graduation')  || undefined,
      gpa:                   get(sec, 'GPA')          || undefined,
      coursework_highlights: coursework ? splitList(coursework) : undefined,
    };
    resume.education.push(edu);
  }

  // Certifications
  for (let i = 1; sectionEntries.has(`Certification ${i}`); i++) {
    const sec = `Certification ${i}`;
    const credId  = get(sec, 'Credential ID');
    const credUrl = get(sec, 'Credential URL');
    const showId  = get(sec, 'Show Credential ID');
    const showUrl = get(sec, 'Show Credential URL');
    const cert: Certification = {
      name:                get(sec, 'Name'),
      issuer:              get(sec, 'Issuer'),
      issue_date:          get(sec, 'Date'),
      expiry_date:         get(sec, 'Expiry Date') || undefined,
      credential_id:       credId  || undefined,
      credential_url:      credUrl || undefined,
      show_credential_id:  showId  ? showId === 'true'  : !!credId,
      show_credential_url: showUrl ? showUrl === 'true' : !!credUrl,
    };
    resume.certifications.push(cert);
  }

  // Awards
  for (let i = 1; sectionEntries.has(`Award ${i}`); i++) {
    const sec = `Award ${i}`;
    const award: Award = {
      name:        get(sec, 'Name')        || undefined,
      issuer:      get(sec, 'Issuer')      || undefined,
      date:        get(sec, 'Date')        || undefined,
      description: get(sec, 'Description')|| undefined,
    };
    resume.awards.push(award);
  }

  // Languages
  for (let i = 1; sectionEntries.has(`Language ${i}`); i++) {
    const sec = `Language ${i}`;
    const lang: Language = {
      language:    get(sec, 'Language'),
      proficiency: (get(sec, 'Proficiency') as Language['proficiency']) || undefined,
    };
    resume.languages.push(lang);
  }

  // Publications
  for (let i = 1; sectionEntries.has(`Publication ${i}`); i++) {
    const sec = `Publication ${i}`;
    const pub: Publication = {
      title:     get(sec, 'Title')     || undefined,
      venue:     get(sec, 'Venue')     || undefined,
      date:      get(sec, 'Date')      || undefined,
      link:      get(sec, 'URL')       || undefined,
      highlight: get(sec, 'Highlight') || undefined,
    };
    resume.publications.push(pub);
  }

  // Volunteering
  for (let i = 1; sectionEntries.has(`Volunteering ${i}`); i++) {
    const sec = `Volunteering ${i}`;
    const v: Volunteering = {
      name:         get(sec, 'Name')         || undefined,
      organization: get(sec, 'Organization') || undefined,
      date:         get(sec, 'Date')         || undefined,
      description:  get(sec, 'Description')  || undefined,
    };
    resume.volunteering.push(v);
  }

  // Preferences
  const workAuth = get('Preferences', 'Work Authorization');
  if (workAuth) resume.work_authorization = workAuth;
  const clearance = get('Preferences', 'Clearance');
  if (clearance) resume.clearance = clearance;
  const relocation = get('Preferences', 'Relocation');
  if (relocation) resume.relocation = relocation === 'true';
  const remotePref = get('Preferences', 'Remote Preference');
  if (remotePref) resume.remote_preference = remotePref as Resume['remote_preference'];

  return resume;
}

// ========== JSON IMPORT ==========

export function importFromJson(text: string): Resume {
  const parsed = JSON.parse(text);
  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Not a valid resume object.');
  }
  const resume = parsed as Resume;
  // Ensure required arrays exist (handles older exports missing new fields)
  resume.work_experience ??= [];
  resume.projects        ??= [];
  resume.education       ??= [];
  resume.certifications  ??= [];
  resume.skills_core     ??= [];
  resume.skills_tools    ??= [];
  resume.skills_soft     ??= [];
  resume.awards          ??= [];
  resume.publications    ??= [];
  resume.volunteering    ??= [];
  resume.languages       ??= [];
  return resume;
}

// ========== DISPATCH BY FILE EXTENSION ==========

export async function importFromFile(file: File): Promise<Resume> {
  const text = await file.text();
  const ext  = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'json') return importFromJson(text);
  if (ext === 'csv')  return importFromCsv(text);
  throw new Error(`Unsupported file type: .${ext}. Use .json or .csv.`);
}
