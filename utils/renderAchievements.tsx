import React from 'react';

// Matches bullet chars only at the very start of a line
export const BULLET_RE = /^[\s]*[\u2022\u2023\u25E6\u2043\u2219\-\*▪▸►✓]+\s*/;

type ParsedLine = { type: 'bullet'; text: string } | { type: 'para'; text: string };

export function renderAchievements(
  achievements: string[],
  liClass: string,
  paraClass: string,
): React.ReactNode[] {
  // Step 1: parse each non-blank line into typed tokens
  const parsed: ParsedLine[] = achievements
    .filter(a => a.trim())
    .map(a =>
      BULLET_RE.test(a)
        ? { type: 'bullet', text: a.replace(BULLET_RE, '') }
        : { type: 'para',   text: a },
    );

  // Step 2: group consecutive bullets into <ul> blocks
  const nodes: React.ReactNode[] = [];
  let idx = 0;
  let key = 0;

  while (idx < parsed.length) {
    if (parsed[idx].type === 'bullet') {
      const bullets: string[] = [];
      while (idx < parsed.length && parsed[idx].type === 'bullet') {
        bullets.push((parsed[idx] as { type: 'bullet'; text: string }).text);
        idx++;
      }
      nodes.push(
        <ul key={key++} className="list-disc list-outside pl-4 space-y-1.5">
          {bullets.map((b, j) => <li key={j} className={liClass}>{b}</li>)}
        </ul>,
      );
    } else {
      nodes.push(<p key={key++} className={paraClass}>{(parsed[idx] as { type: 'para'; text: string }).text}</p>);
      idx++;
    }
  }

  return nodes;
}
