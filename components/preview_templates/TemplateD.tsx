import React from 'react';
import { Resume } from '../../types';
import { renderAchievements } from '../../utils/renderAchievements';

const BLUE = '#1a5c96';

interface TemplateProps {
  data: Resume;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-3" style={{ borderBottom: `2px solid ${BLUE}` }}>
    <h2 style={{
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: BLUE,
      paddingBottom: '3px',
      marginBottom: 0,
    }}>
      {title}
    </h2>
  </div>
);

const TemplateD: React.FC<TemplateProps> = ({ data }) => {
  const allSkills = [
    ...(data.skills_core || []),
    ...(data.skills_tools || []),
    ...(data.skills_soft || []),
  ];

  const contactLine = [
    data.city && data.country ? `${data.city}, ${data.country}` : (data.city || data.country || ''),
    data.phone,
    data.email,
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: '"Calibri", "Segoe UI", Arial, sans-serif', fontSize: '12px', color: '#2d2d2d', lineHeight: '1.45' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: BLUE, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: '3px' }}>
            {data.full_name || 'Your Name'}
          </h1>
          {data.target_role_title && (
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#555', marginBottom: '6px', letterSpacing: '0.02em' }}>
              {data.target_role_title}
            </p>
          )}
          {contactLine.length > 0 && (
            <p style={{ fontSize: '10.5px', color: '#666', lineHeight: '1.6' }}>
              {contactLine.join('  ·  ')}
            </p>
          )}
          {data.linkedin_url && (
            <p style={{ fontSize: '10.5px', color: '#666', lineHeight: '1.6' }}>
              <span style={{ fontWeight: 600 }}>LinkedIn: </span>{data.linkedin_url}
            </p>
          )}
          {data.portfolio_url && (
            <p style={{ fontSize: '10.5px', color: '#666', lineHeight: '1.6' }}>
              <span style={{ fontWeight: 600 }}>Portfolio: </span>{data.portfolio_url}
            </p>
          )}
        </div>
        {data.avatar_url && (
          <img
            src={data.avatar_url}
            alt="Profile"
            style={{ width: '72px', height: '72px', borderRadius: '4px', objectFit: 'cover', marginLeft: '20px', flexShrink: 0 }}
          />
        )}
      </header>

      {/* ── Summary ────────────────────────────────────────────────────── */}
      {data.summary && (
        <section className="mb-5">
          <SectionHeader title="Summary" />
          <p style={{ fontSize: '11.5px', color: '#333', lineHeight: '1.55' }}>{data.summary}</p>
        </section>
      )}

      {/* ── Work Experience ────────────────────────────────────────────── */}
      {data.work_experience?.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Professional Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.work_experience.map((job, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#1a1a1a' }}>{job.title}</span>
                  <span style={{ fontSize: '10.5px', color: '#666', flexShrink: 0, marginLeft: '8px' }}>
                    {job.start_date} — {job.end_date || 'Present'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#555', marginBottom: '5px', fontStyle: 'italic' }}>
                  {[job.employer, job.location].filter(Boolean).join(', ')}
                </p>
                {job.achievements?.filter(a => a.trim()).length > 0 && (
                  <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.5' }}>
                    {renderAchievements(job.achievements, 'text-xs', 'text-xs mb-1')}
                  </div>
                )}
                {job.tech_stack?.length > 0 && (
                  <p style={{ fontSize: '10.5px', color: '#666', marginTop: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Tech: </span>{job.tech_stack.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Technical Skills ───────────────────────────────────────────── */}
      {allSkills.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Technical Skills" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px 12px' }}>
            {allSkills.map((skill, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#333' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: BLUE, flexShrink: 0, display: 'inline-block' }} />
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ───────────────────────────────────────────────────── */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Projects" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#1a1a1a' }}>{proj.name}</span>
                  {proj.link && (
                    <span style={{ fontSize: '10px', color: BLUE, flexShrink: 0, marginLeft: '8px' }}>{proj.link}</span>
                  )}
                </div>
                {proj.description?.filter(d => d.trim()).length > 0 && (
                  <ul style={{ paddingLeft: '14px', margin: '4px 0 0', listStyleType: 'disc' }}>
                    {proj.description.filter(d => d.trim()).map((d, j) => (
                      <li key={j} style={{ fontSize: '11px', color: '#333', marginBottom: '2px', lineHeight: '1.5' }}>{d}</li>
                    ))}
                  </ul>
                )}
                {proj.tech_stack?.length > 0 && (
                  <p style={{ fontSize: '10.5px', color: '#666', marginTop: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Tech: </span>{proj.tech_stack.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Certifications ─────────────────────────────────────────────── */}
      {data.certifications?.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Certifications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {data.certifications.map((cert, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '11.5px' }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: '11px', color: '#555' }}> — {cert.issuer}</span>}
                  {cert.show_credential_id && cert.credential_id && (
                    <span style={{ fontSize: '10px', color: '#555', display: 'block' }}>ID: {cert.credential_id}</span>
                  )}
                  {cert.show_credential_url && cert.credential_url && (
                    <span style={{ fontSize: '10px', color: BLUE, display: 'block' }}>{cert.credential_url}</span>
                  )}
                </div>
                <span style={{ fontSize: '10.5px', color: '#666', flexShrink: 0, marginLeft: '8px' }}>{cert.issue_date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education ──────────────────────────────────────────────────── */}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Education" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.education.map((edu, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#1a1a1a' }}>
                    {[edu.degree, edu.discipline].filter(Boolean).join(', ')}
                  </span>
                  {edu.graduation_date && (
                    <span style={{ fontSize: '10.5px', color: '#666', flexShrink: 0, marginLeft: '8px' }}>
                      {edu.graduation_date}
                    </span>
                  )}
                </div>
                {edu.institution && (
                  <p style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', marginTop: '1px' }}>{edu.institution}</p>
                )}
                {edu.gpa && (
                  <p style={{ fontSize: '10.5px', color: '#666', marginTop: '1px' }}>GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Additional Information ─────────────────────────────────────── */}
      {(data.languages?.length > 0 || data.awards?.length > 0 || data.volunteering?.length > 0) && (
        <section className="mb-5">
          <SectionHeader title="Additional Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {data.languages?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                <span style={{ fontWeight: 600, minWidth: '90px', color: '#444' }}>Languages:</span>
                <span style={{ color: '#333' }}>
                  {data.languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', ')}
                </span>
              </div>
            )}
            {data.awards?.filter(a => a.name).map((award, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                <span style={{ fontWeight: 600, minWidth: '90px', color: '#444' }}>
                  {i === 0 ? 'Awards:' : ''}
                </span>
                <span style={{ color: '#333' }}>
                  {award.name}{award.issuer ? `, ${award.issuer}` : ''}{award.date ? ` (${award.date})` : ''}
                </span>
              </div>
            ))}
            {data.volunteering?.filter(v => v.name).map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                <span style={{ fontWeight: 600, minWidth: '90px', color: '#444' }}>
                  {i === 0 ? 'Volunteering:' : ''}
                </span>
                <span style={{ color: '#333' }}>
                  {v.name}{v.organization ? `, ${v.organization}` : ''}{v.date ? ` (${v.date})` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default TemplateD;
