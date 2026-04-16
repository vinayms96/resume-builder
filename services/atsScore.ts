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

// Curated set of recognizable professional/tech keywords across all job families.
// Only JD tokens that appear in this set (or in the resume itself) are counted —
// everything else (boilerplate, grammar, company info) is ignored regardless of JD format.
const TECH_KEYWORDS = new Set([
  // Languages
  'python','javascript','typescript','java','scala','kotlin','ruby','golang','rust','swift',
  'php','perl','bash','shell','powershell','sql','nosql','graphql','html','css','sass','less',
  'r','matlab','julia','groovy','haskell','elixir','clojure',
  // Testing & QA
  'selenium','cypress','playwright','pytest','junit','testng','mocha','jest','jasmine',
  'cucumber','behave','robotframework','appium','espresso','xcuitest','testcafe',
  'webdriverio','postman','soapui','karate','rest','api','soap','grpc',
  'automation','manual','regression','integration','functional','performance','load',
  'stress','security','penetration','accessibility','exploratory','smoke','sanity',
  'e2e','bdd','tdd','atdd','shift','left','contract','mutation',
  // Data & Analytics
  'pandas','numpy','scipy','matplotlib','seaborn','spark','hadoop','kafka','airflow',
  'dbt','tableau','powerbi','looker','metabase','superset','databricks','snowflake',
  'redshift','bigquery','hive','presto','trino','flink','beam','etl','elt','pipeline',
  'warehouse','lakehouse','datalake','analytics','reporting','dashboard',
  'validation','quality','reconciliation','lineage','profiling',
  // Frameworks & Libraries
  'react','angular','vue','nextjs','nuxtjs','svelte','django','flask','fastapi','spring',
  'express','rails','laravel','dotnet','nodejs','nestjs','graphene','celery','redis',
  'lodash','rxjs','webpack','vite','rollup','babel','storybook','tailwind','bootstrap',
  // Cloud & DevOps
  'aws','azure','gcp','kubernetes','docker','terraform','ansible','puppet','chef',
  'jenkins','github','gitlab','bitbucket','circleci','travisci','argocd','helm',
  'prometheus','grafana','datadog','splunk','elk','cloudwatch','lambda','serverless',
  'microservices','containers','devops','sre','devsecops','ci','cd','cicd',
  // Databases
  'postgresql','mysql','mongodb','redis','cassandra','dynamodb','elasticsearch',
  'oracle','mssql','sqlite','firestore','supabase','neo4j','couchdb',
  // Methodologies & Practices
  'agile','scrum','kanban','waterfall','lean','safe','xp','devops','sre',
  'sdlc','sprint','standup','retrospective','backlog','jira','confluence',
  'git','github','gitlab','version','control','code','review','pull','request',
  // Tools & Platforms
  'linux','unix','windows','macos','bash','vim','vscode','intellij','eclipse',
  'slack','teams','zoom','notion','trello','asana','figma','sketch',
  'postman','insomnia','swagger','openapi','sonarqube','checkmarx','snyk',
  // Soft / Domain Skills
  'leadership','communication','collaboration','mentoring','coaching','ownership',
  'stakeholder','cross','functional','analytical','problem','solving',
  'scalable','reliable','maintainable','observable','resilient',
]);

// Abbreviation expansions — both directions handled
const ABBREV_MAP: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python',
  cicd: 'cicd', ci: 'ci', cd: 'cd',
  sql: 'sql', api: 'api', ui: 'ui', ux: 'ux',
  ml: 'ml', ai: 'ai', db: 'db',
  e2e: 'e2e', oop: 'oop',
  aws: 'aws', gcp: 'gcp', etl: 'etl',
};

function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  text.toLowerCase().split(/[\W_]+/).forEach(tok => {
    if (!tok || /^\d+$/.test(tok) || tok.length < 2) return;
    tokens.add(tok);
    if (ABBREV_MAP[tok]) tokens.add(ABBREV_MAP[tok]);
  });
  return tokens;
}

export interface JDMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

const KW_GROUPS: Record<string, Set<string>> = {
  'Testing Tools': new Set(['selenium','cypress','playwright','jest','mocha','jasmine','junit','testng','pytest','cucumber','appium','webdriverio','testcafe','robotframework','karate','postman','soapui']),
  'Languages': new Set(['python','javascript','typescript','java','kotlin','scala','golang','ruby','swift','php','rust','bash','shell','sql','graphql','html','css','r','groovy','perl']),
  'Cloud & DevOps': new Set(['aws','azure','gcp','kubernetes','docker','terraform','ansible','jenkins','github','gitlab','circleci','argocd','helm','prometheus','grafana','datadog','serverless','lambda']),
  'Frameworks': new Set(['react','angular','vue','nextjs','django','flask','fastapi','spring','express','rails','laravel','dotnet','nodejs','nestjs']),
  'Databases': new Set(['postgresql','mysql','mongodb','redis','cassandra','dynamodb','elasticsearch','oracle','mssql','firestore','neo4j']),
  'Methodologies': new Set(['agile','scrum','kanban','bdd','tdd','atdd','devops','sre','cicd','e2e','regression','automation','manual','performance','load','api','rest','soap','grpc']),
};

function generateSuggestions(missing: string[]): string[] {
  const suggestions: string[] = [];
  const grouped: Record<string, string[]> = {};

  for (const kw of missing) {
    for (const [group, set] of Object.entries(KW_GROUPS)) {
      if (set.has(kw)) {
        grouped[group] = grouped[group] ?? [];
        grouped[group].push(kw);
        break;
      }
    }
  }

  for (const [group, kws] of Object.entries(grouped)) {
    const sample = kws.slice(0, 4).join(', ');
    if (group === 'Testing Tools')
      suggestions.push(`Add missing test tools to Skills: ${sample}`);
    else if (group === 'Languages')
      suggestions.push(`Include language proficiency: ${sample}`);
    else if (group === 'Cloud & DevOps')
      suggestions.push(`Highlight cloud/DevOps experience: ${sample}`);
    else if (group === 'Methodologies')
      suggestions.push(`Use JD methodology keywords in summary/bullets: ${sample}`);
    else
      suggestions.push(`Add to Skills or projects: ${sample} (${group})`);
  }

  if (missing.length > 5 && suggestions.length < 3)
    suggestions.push('Mirror exact JD terminology in your summary and achievement bullets');
  if (missing.length > 10)
    suggestions.push('Consider a targeted summary paragraph that echoes JD language directly');

  return suggestions.slice(0, 5);
}

export function computeJDMatchScore(resume: Resume, jd: string): JDMatchResult {
  if (!jd.trim()) return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: [] };

  const allJdTokens = tokenize(jd);
  if (allJdTokens.size === 0) return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: [] };

  const resumeParts: string[] = [
    resume.summary ?? '',
    resume.target_role_title ?? '',
    ...(resume.skills_core ?? []),
    ...(resume.skills_tools ?? []),
    ...(resume.skills_soft ?? []),
    ...(resume.work_experience ?? []).map(j =>
      `${j.title ?? ''} ${j.employer ?? ''} ${(j.achievements ?? []).join(' ')} ${(j.tech_stack ?? []).join(' ')}`
    ),
    ...(resume.certifications ?? []).map(c => c.name ?? ''),
    ...(resume.projects ?? []).flatMap(p => [p.name ?? '', ...(p.description ?? []), ...(p.tech_stack ?? [])]),
    ...(resume.education ?? []).map(e => `${e.degree ?? ''} ${e.institution ?? ''}`),
  ];

  const resumeTokens = tokenize(resumeParts.join(' '));

  const meaningfulJdTokens = [...allJdTokens].filter(
    t => TECH_KEYWORDS.has(t) || resumeTokens.has(t)
  );

  if (meaningfulJdTokens.length === 0) return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: [] };

  const matchedKeywords = meaningfulJdTokens.filter(t => resumeTokens.has(t));
  const missingKeywords = meaningfulJdTokens.filter(t => !resumeTokens.has(t));
  const score = Math.round((matchedKeywords.length / meaningfulJdTokens.length) * 100);

  return {
    score,
    matchedKeywords: matchedKeywords.sort(),
    missingKeywords: missingKeywords.sort(),
    suggestions: generateSuggestions(missingKeywords),
  };
}
