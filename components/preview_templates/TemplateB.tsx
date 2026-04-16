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

interface TemplateProps {
  data: Resume;
}

// Template B: Tech Impact — modern single column with indigo accent on section headers
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-indigo-200 pb-0 mb-2.5 leading-none">
    {title}
  </h2>
);

const TemplateB: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="text-sm font-sans text-gray-900 leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header className="mb-5 pb-2 border-b-2 border-indigo-600">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {data.full_name || 'Your Name'}
        </h1>
        {data.target_role_title && (
          <p className="text-sm font-medium text-indigo-600 mt-0.5">{data.target_role_title}</p>
        )}
        <p className="text-xs text-gray-500 mt-1.5">
          {[data.email, data.phone, [data.city, data.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
        </p>
        {data.linkedin_url && (
          <p className="text-xs text-gray-500 mt-0.5" style={{ wordBreak: 'break-all' }}>LinkedIn: {data.linkedin_url}</p>
        )}
        {data.portfolio_url && (
          <p className="text-xs text-gray-500 mb-2" style={{ wordBreak: 'break-all' }}>Portfolio: {data.portfolio_url}</p>
        )}
      </header>

      {/* All sections with uniform spacing */}
      <div className="space-y-5">
        {/* Summary */}
        {data.summary && (
          <section>
            <SectionHeader title="Summary" />
            <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {(data.skills_core?.length > 0 || data.skills_tools?.length > 0 || data.skills_soft?.length > 0) && (
          <section>
            <SectionHeader title="Technical Skills" />
            <div className="text-xs space-y-1 text-gray-800">
              {data.skills_core?.length > 0 && (
                <p><span className="font-semibold">Core:</span> {data.skills_core.join(', ')}</p>
              )}
              {data.skills_tools?.length > 0 && (
                <p><span className="font-semibold">Tools &amp; Platforms:</span> {data.skills_tools.join(', ')}</p>
              )}
              {data.skills_soft?.length > 0 && (
                <p><span className="font-semibold">Soft Skills:</span> {data.skills_soft.join(', ')}</p>
              )}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.work_experience?.length > 0 && (
          <section>
            <SectionHeader title="Work Experience" />
            <div className="divide-y divide-indigo-200">
              {data.work_experience.map((job, i) => (
                <div key={i} data-no-break="true" className={i > 0 ? 'pt-3' : 'pb-1'} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sm text-gray-900">{job.title || 'Job Title'}</h3>
                    <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">
                      {[job.start_date, job.end_date || 'Present'].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    {[job.employer, job.location].filter(Boolean).join(' · ')}
                  </p>
                  {job.achievements?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {renderAchievements(job.achievements, 'text-xs text-gray-700', 'text-xs text-gray-700 mb-1')}
                    </div>
                  )}
                  {job.tech_stack?.length > 0 && (
                    <p className="text-xs text-gray-800 mt-1">
                      <span className="font-bold">Tech:</span> {job.tech_stack.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <SectionHeader title="Projects" />
            <div className="divide-y divide-indigo-100">
              {data.projects.map((proj, i) => (
                <div key={i} data-no-break="true" className={i > 0 ? 'pt-3' : 'pb-1'} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div>
                    <h3 className="font-semibold text-xs text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <p className="text-xs text-indigo-600 mt-0.5" style={{ wordBreak: 'break-all' }}>{proj.link}</p>
                    )}
                  </div>
                  {proj.description?.length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-2.5 space-y-0.5">
                      {proj.description.map((d, j) => (
                        <li key={j} className="text-xs text-gray-700">{d}</li>
                      ))}
                    </ul>
                  )}
                  {proj.tech_stack?.length > 0 && (
                    <p className="text-xs text-gray-800 mt-2.5 mb-1">
                      <span className="font-bold">Tech:</span> {proj.tech_stack.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <SectionHeader title="Education" />
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-xs text-gray-900">
                      {[edu.degree, edu.discipline].filter(Boolean).join(', ')}
                    </h3>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">{edu.graduation_date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <section>
            <SectionHeader title="Certifications" />
            <div className="space-y-1.5">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-medium text-xs text-gray-900">{cert.name}</span>
                      <span className="text-xs text-gray-500"> — {cert.issuer}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">{cert.issue_date}</span>
                  </div>
                  {cert.show_credential_id && cert.credential_id && (
                    <p className="text-xs text-gray-700 mt-0.5" style={{ wordBreak: 'break-all' }}>ID: {cert.credential_id}</p>
                  )}
                  {cert.show_credential_url && cert.credential_url && (
                    <p className="text-xs text-indigo-600 mt-0.5" style={{ wordBreak: 'break-all' }}>{cert.credential_url}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {data.awards?.length > 0 && (
          <section>
            <SectionHeader title="Awards & Honors" />
            <div className="space-y-1.5">
              {data.awards.map((award, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-xs text-gray-900">{award.name}</span>
                    {award.issuer && <span className="text-xs text-gray-500"> — {award.issuer}</span>}
                    {award.description && <p className="text-xs text-gray-600 mt-0.5">{award.description}</p>}
                  </div>
                  {award.date && <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">{award.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <section>
            <SectionHeader title="Languages" />
            <p className="text-xs text-gray-700">
              {data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · ')}
            </p>
          </section>
        )}

        {/* Volunteering */}
        {data.volunteering?.length > 0 && (
          <section>
            <SectionHeader title="Volunteering" />
            <div className="space-y-2">
              {data.volunteering.map((v, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-xs text-gray-900">{v.name}</h3>
                    {v.date && <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">{v.date}</span>}
                  </div>
                  {v.organization && <p className="text-xs text-gray-600 italic">{v.organization}</p>}
                  {v.description && <p className="text-xs text-gray-700 mt-0.5">{v.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateB;
