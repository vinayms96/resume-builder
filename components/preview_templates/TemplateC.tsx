import React from 'react';
import { Resume } from '../../types';

const BULLET_RE = /^[\s\u2022\u2023\u25E6\u2043\u2219\-\*–—▪▸►✓]+\s*/;

function renderAchievements(achievements: string[], liClass: string, paraClass: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let pending: string[] = [];
  const firstBlankIdx = achievements.findIndex(a => !a.trim());

  const flushBullets = (key: number) => {
    if (pending.length === 0) return;
    nodes.push(
      <ul key={key} className="list-disc list-outside pl-4 space-y-1.5">
        {pending.map((b, i) => <li key={i} className={liClass}>{b}</li>)}
      </ul>
    );
    pending = [];
  };
  achievements.forEach((ach, i) => {
    if (!ach.trim()) { flushBullets(i); return; }
    const hasBulletChar = BULLET_RE.test(ach);
    const isParagraph = !hasBulletChar && firstBlankIdx !== -1 && i < firstBlankIdx;
    if (isParagraph) {
      flushBullets(i);
      nodes.push(<p key={i} className={paraClass}>{ach}</p>);
    } else {
      pending.push(hasBulletChar ? ach.replace(BULLET_RE, '') : ach);
    }
  });
  flushBullets(achievements.length);
  return nodes;
}

// Maps proficiency string → number of filled dots (out of 4)
// Basic=1, Conversational=2, Professional=3, Native=4
const proficiencyDots = (prof: string): number => {
  const p = (prof || '').toLowerCase();
  if (p.includes('native') || p.includes('fluent')) return 4;
  if (p.includes('professional') || p.includes('proficient') || p.includes('advanced') || p.includes('c1') || p.includes('c2')) return 3;
  if (p.includes('conversational') || p.includes('intermediate') || p.includes('b1') || p.includes('b2')) return 2;
  if (p.includes('basic') || p.includes('element') || p.includes('a1') || p.includes('a2')) return 1;
  return 2;
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2
    className="text-xs font-black uppercase tracking-widest text-gray-900 pb-0.5 mb-2 leading-none"
    style={{ borderBottom: '2px solid #EA580C' }}
  >
    {title}
  </h2>
);

// Inline SVG icons — kept tiny (w-3 h-3) for contact row
const PhoneIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LinkIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const PinIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const CalIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

// Template C: Modern Two-Column — orange+blue accent, skills pills, language dots, avatar
const TemplateC: React.FC<{ data: Resume }> = ({ data }) => {
  const initials = (data.full_name || 'YN')
    .split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
  const allSkills = [
    ...(data.skills_core || []),
    ...(data.skills_tools || []),
    ...(data.skills_soft || []),
  ];

  return (
    <div className="text-sm text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex justify-between mb-1" style={{ alignItems: 'stretch' }}>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900 leading-tight">
            {data.full_name || 'Your Name'}
          </h1>
          {data.target_role_title && (
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#EA580C' }}>
              {data.target_role_title}
            </p>
          )}
          {/* Contact row — phone, email, location */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-xs text-gray-600">
            {data.phone && (
              <span className="flex items-center gap-1"><PhoneIcon />{data.phone}</span>
            )}
            {data.email && (
              <span className="flex items-center gap-1"><MailIcon />{data.email}</span>
            )}
            {(data.city || data.country) && (
              <span className="flex items-center gap-1">
                <PinIcon />{[data.city, data.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          {/* Links row — linkedin + portfolio on separate line */}
          {(data.linkedin_url || data.portfolio_url) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-600">
              {data.linkedin_url && (
                <span className="flex items-center gap-1" style={{ wordBreak: 'break-all' }}>
                  <LinkIcon />{data.linkedin_url}
                </span>
              )}
              {data.portfolio_url && (
                <span className="flex items-center gap-1" style={{ wordBreak: 'break-all' }}>
                  <GlobeIcon />{data.portfolio_url}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Avatar — centered in stretched header height */}
        <div className="ml-4 flex-shrink-0 flex items-center" style={{ alignSelf: 'stretch' }}>
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={data.full_name}
              style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }}
            />
          ) : (
            <div
              className="flex items-center justify-center text-white font-black"
              style={{ width: 110, height: 110, borderRadius: '50%',
                       background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                       fontSize: 28, letterSpacing: '-0.5px' }}
            >
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Orange rule */}
      <div className="mb-4 mt-2" style={{ height: 2, background: '#EA580C' }} />

      {/* ── Two-column body ─────────────────────────────── */}
      <div className="flex gap-5">

        {/* Left column — Summary, Experience, Education */}
        <div className="flex-1 min-w-0 space-y-4">

          {data.summary && (
            <section>
              <SectionHeader title="Summary" />
              <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
            </section>
          )}

          {data.work_experience?.length > 0 && (
            <section>
              <SectionHeader title="Experience" />
              <div className="space-y-4">
                {data.work_experience.map((job, i) => (
                  <div key={i} data-no-break="true" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <h3 className="font-bold text-sm text-gray-900 leading-snug">{job.title}</h3>
                    <p className="text-xs font-semibold" style={{ color: '#EA580C' }}>{job.employer}</p>
                    <p className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 mb-1.5">
                      <span className="flex items-center gap-1">
                        <CalIcon />
                        {[job.start_date, job.end_date || 'Present'].filter(Boolean).join(' – ')}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <PinIcon />{job.location}
                        </span>
                      )}
                    </p>
                    {job.achievements?.length > 0 && (
                      <div>
                        {renderAchievements(job.achievements, 'text-xs text-gray-700', 'text-xs text-gray-700 mb-1')}
                      </div>
                    )}
                    {job.tech_stack?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        <span className="font-semibold">Tech:</span> {job.tech_stack.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education?.length > 0 && (
            <section>
              <SectionHeader title="Education" />
              <div className="space-y-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-xs text-gray-900">
                      {[edu.degree, edu.discipline].filter(Boolean).join(', ')}
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: '#EA580C' }}>{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.graduation_date}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.volunteering?.length > 0 && (
            <section>
              <SectionHeader title="Volunteering" />
              <div className="space-y-2">
                {data.volunteering.map((v, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-xs text-gray-900">{v.name}</h3>
                    {v.organization && <p className="text-xs font-semibold" style={{ color: '#EA580C' }}>{v.organization}</p>}
                    {v.date && <p className="text-xs text-gray-400">{v.date}</p>}
                    {v.description && <p className="text-xs text-gray-700 mt-0.5">{v.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column — Achievements, Languages, Skills, Projects, Certs */}
        <div className="flex-shrink-0 space-y-4" style={{ width: 220 }}>

          {data.awards?.length > 0 && (
            <section>
              <SectionHeader title="Key Achievements" />
              <div className="space-y-3">
                {data.awards.map((award, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-gray-900 leading-snug">{award.name}</p>
                    {award.issuer && <p className="text-xs text-gray-400 italic">{award.issuer}</p>}
                    {award.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{award.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages?.length > 0 && (
            <section>
              <SectionHeader title="Languages" />
              <div className="space-y-2">
                {data.languages.map((l, i) => {
                  const dots = proficiencyDots(l.proficiency || '');
                  return (
                    <div key={i}>
                      <p className="text-xs font-semibold text-gray-800">{l.language}</p>
                      {l.proficiency && <p className="text-xs text-gray-500">{l.proficiency}</p>}
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4].map(d => (
                          <div
                            key={d}
                            style={{
                              width: 14, height: 5, borderRadius: 3,
                              background: d <= dots ? '#2563EB' : '#E5E7EB',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {allSkills.length > 0 && (
            <section>
              <SectionHeader title="Skills" />
              <div className="flex flex-wrap gap-1">
                {allSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs text-gray-700 leading-none"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: 4,
                      padding: '2px 6px',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.projects?.length > 0 && (
            <section>
              <SectionHeader title="Projects" />
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <div key={i} data-no-break="true" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <p className="text-xs font-bold text-gray-900">{proj.name}</p>
                    {proj.link && (
                      <p className="text-xs mt-0.5" style={{ color: '#EA580C', wordBreak: 'break-all' }}>{proj.link}</p>
                    )}
                    {proj.description?.length > 0 && (
                      <ul className="list-disc list-outside pl-3 mt-1 space-y-1">
                        {proj.description.map((d, j) => (
                          <li key={j} className="text-xs text-gray-700">{d}</li>
                        ))}
                      </ul>
                    )}
                    {proj.tech_stack?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-semibold">Tech:</span> {proj.tech_stack.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications?.length > 0 && (
            <section>
              <SectionHeader title="Certifications" />
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-xs text-gray-500">
                      {cert.issuer}{cert.issue_date ? ` · ${cert.issue_date}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateC;
