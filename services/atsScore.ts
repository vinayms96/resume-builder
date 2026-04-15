import { Resume } from '../types';

export interface ATSCategory {
  label: string;
  score: number;
  max: number;
  tips: string[];
}

export interface ATSResult {
  total: number;
  max: 100;
  grade: 'poor' | 'fair' | 'good' | 'strong';
  color: string;
  categories: ATSCategory[];
}

// Common ATS action verbs — quantified achievements score higher
const ACTION_VERBS = [
  'achieved','built','created','delivered','designed','developed','drove','enabled',
  'engineered','established','grew','implemented','improved','increased','launched',
  'led','managed','optimized','reduced','scaled','shipped','streamlined','transformed',
];

// Regex to detect numbers/percentages/dollar amounts in achievements (quantified results)
const QUANTIFIED_RE = /\d+(%|\+|x|k|m|\s*(percent|times|users|customers|hours|minutes|days|weeks|months|years|million|billion|thousand))/i;

function hasQuantifiedAchievement(achievements: string[]): boolean {
  return achievements.some(a => QUANTIFIED_RE.test(a));
}

function hasActionVerb(achievements: string[]): boolean {
  return achievements.some(a =>
    ACTION_VERBS.some(v => a.toLowerCase().startsWith(v) || a.toLowerCase().includes(` ${v} `))
  );
}

export function computeATSScore(resume: Resume): ATSResult {
  const categories: ATSCategory[] = [];

  // ── 1. Contact & Identity (20 pts) ────────────────────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    if (resume.full_name)       score += 5; else tips.push('Add your full name');
    if (resume.email)            score += 5; else tips.push('Add an email address');
    if (resume.phone)            score += 4; else tips.push('Add a phone number');
    if (resume.city || resume.country) score += 3; else tips.push('Add your location');
    if (resume.linkedin_url)     score += 3; else tips.push('Add LinkedIn URL');
    categories.push({ label: 'Contact Info', score, max: 20, tips });
  }

  // ── 2. Professional Summary (10 pts) ──────────────────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    if (resume.summary) {
      score += 4;
      const wordCount = resume.summary.trim().split(/\s+/).length;
      if (wordCount >= 40)  score += 3; else tips.push('Expand summary to 40+ words');
      if (wordCount >= 80)  score += 3; else if (wordCount >= 40) tips.push('Expand to 80+ words for stronger impact');
    } else {
      tips.push('Add a professional summary — many ATS systems weight this heavily');
    }
    categories.push({ label: 'Summary', score, max: 10, tips });
  }

  // ── 3. Work Experience (30 pts) ────────────────────────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    const jobs = resume.work_experience || [];
    if (jobs.length === 0) {
      tips.push('Add at least one work experience entry');
    } else {
      score += Math.min(jobs.length, 3) * 4;           // up to 12pts for 3+ jobs
      const allAch = jobs.flatMap(j => j.achievements || []);
      if (allAch.length > 0) {
        score += 6;
        if (hasActionVerb(allAch))           score += 4; else tips.push('Start bullets with action verbs (Led, Built, Improved…)');
        if (hasQuantifiedAchievement(allAch)) score += 5; else tips.push('Add numbers/metrics to achievements (e.g. "reduced load time by 40%")');
      } else {
        tips.push('Add bullet-point achievements under each role');
      }
      const hasAllDates = jobs.every(j => j.start_date);
      if (hasAllDates)  score += 3; else tips.push('Add start/end dates to all roles');
    }
    categories.push({ label: 'Work Experience', score, max: 30, tips });
  }

  // ── 4. Skills (15 pts) ─────────────────────────────────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    const core  = resume.skills_core  || [];
    const tools = resume.skills_tools || [];
    const soft  = resume.skills_soft  || [];
    if (core.length > 0)   score += 4; else tips.push('Add core technical skills');
    if (core.length >= 5)  score += 3; else if (core.length > 0) tips.push('List at least 5 core skills for better keyword coverage');
    if (tools.length > 0)  score += 4; else tips.push('Add tools & platforms (IDEs, cloud, frameworks)');
    if (soft.length > 0)   score += 2; else tips.push('Add soft skills');
    if (core.length + tools.length >= 10) score += 2;
    categories.push({ label: 'Skills', score, max: 15, tips });
  }

  // ── 5. Education (10 pts) ──────────────────────────────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    const edu = resume.education || [];
    if (edu.length === 0) {
      tips.push('Add education history');
    } else {
      score += 6;
      if (edu.some(e => e.graduation_date)) score += 2; else tips.push('Add graduation dates');
      if (edu.some(e => e.degree))           score += 2; else tips.push('Add degree type (B.Sc., M.Eng., etc.)');
    }
    categories.push({ label: 'Education', score, max: 10, tips });
  }

  // ── 6. Extras — Certs, Projects, Keywords (15 pts) ────────────────────────
  {
    let score = 0;
    const tips: string[] = [];
    if ((resume.certifications || []).length > 0) score += 5; else tips.push('Add certifications (ATS parses these for credential keywords)');
    if ((resume.projects      || []).length > 0)  score += 5; else tips.push('Add projects to expand keyword surface');
    if (resume.target_role_title)                 score += 3; else tips.push('Set your target role title — helps keyword alignment');
    if ((resume.languages     || []).length > 0)  score += 2;
    categories.push({ label: 'Extras & Keywords', score, max: 15, tips });
  }

  const total = Math.min(100, categories.reduce((s, c) => s + c.score, 0));

  let grade: ATSResult['grade'];
  let color: string;
  if (total >= 85)      { grade = 'strong'; color = '#059669'; }
  else if (total >= 65) { grade = 'good';   color = '#2563EB'; }
  else if (total >= 40) { grade = 'fair';   color = '#D97706'; }
  else                  { grade = 'poor';   color = '#DC2626'; }

  return { total, max: 100, grade, color, categories };
}

// ── JD Keyword Match Score ─────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','as','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','must','can',
  'this','that','these','those','it','its','we','our','you','your','they','their',
  'i','my','he','his','she','her','not','no','so','if','then','than','when','who',
]);

// Common abbreviation expansions — resume shorthand → full term
const ABBREV_MAP: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python',
  qa: 'quality assurance', ci: 'continuous integration', cd: 'continuous delivery',
  cicd: 'continuous integration continuous delivery',
  sql: 'structured query language', api: 'application programming interface',
  ui: 'user interface', ux: 'user experience', ml: 'machine learning',
  ai: 'artificial intelligence', db: 'database', fe: 'frontend', be: 'backend',
  e2e: 'end to end', oop: 'object oriented programming',
};

function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  text.toLowerCase().split(/\W+/).forEach(tok => {
    if (!tok || tok.length < 2 || STOP_WORDS.has(tok)) return;
    tokens.add(tok);
    if (ABBREV_MAP[tok]) tokens.add(ABBREV_MAP[tok]);
  });
  return tokens;
}

export function computeJDMatchScore(resume: Resume, jd: string): number {
  if (!jd.trim()) return 0;

  const jdTokens = tokenize(jd);
  if (jdTokens.size === 0) return 0;

  const resumeParts: string[] = [
    resume.summary ?? '',
    resume.target_role_title ?? '',
    ...(resume.skills_core ?? []),
    ...(resume.skills_tools ?? []),
    ...(resume.skills_soft ?? []),
    ...(resume.work_experience ?? []).map(j => `${j.title ?? ''} ${j.employer ?? ''} ${(j.achievements ?? []).join(' ')}`),
    ...(resume.certifications ?? []).map(c => c.name ?? ''),
    ...(resume.projects ?? []).flatMap(p => [p.name ?? '', ...(p.description ?? [])]),
    ...(resume.education ?? []).map(e => `${e.degree ?? ''} ${e.institution ?? ''}`),
  ];

  const resumeTokens = tokenize(resumeParts.join(' '));
  const matched = [...jdTokens].filter(t => resumeTokens.has(t)).length;
  return Math.round((matched / jdTokens.size) * 100);
}
