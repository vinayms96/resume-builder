import React, { useState } from 'react';
import { Resume } from '../types';
import { loadResume, saveResume } from '../services/storage';

interface DevToolsProps {
  onRestore: (data: Resume) => void;
}

type Tab = 'view' | 'restore';

const DevTools: React.FC<DevToolsProps> = ({ onRestore }) => {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState<Tab>('view');
  const [json, setJson]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [viewError, setViewError] = useState('');
  const [pasteInput, setPasteInput] = useState('');
  const [restoreState, setRestoreState] = useState<'idle' | 'success' | 'error'>('idle');
  const [restoreMsg, setRestoreMsg]     = useState('');

  const handleOpen = async () => {
    setViewError('');
    setJson('');
    setCopied(false);
    setPasteInput('');
    setRestoreState('idle');
    setRestoreMsg('');
    setTab('view');
    try {
      const data = await loadResume();
      setJson(JSON.stringify(data, null, 2));
    } catch (e) {
      setViewError(String(e));
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPasteInput('');
    setRestoreState('idle');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestore = async () => {
    setRestoreState('idle');
    setRestoreMsg('');
    try {
      const parsed = JSON.parse(pasteInput) as Resume;
      // Basic sanity check
      if (typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Not a valid resume object.');
      await saveResume(parsed);
      onRestore(parsed);
      setRestoreState('success');
      setRestoreMsg('Data restored successfully. Your resume has been updated.');
    } catch (e) {
      setRestoreState('error');
      setRestoreMsg(e instanceof SyntaxError ? 'Invalid JSON — check for missing brackets or quotes.' : String(e));
    }
  };

  const tabStyle = (t: Tab) => ({
    padding: '6px 14px',
    fontSize: '11px',
    fontFamily: 'monospace',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
    background: tab === t ? '#1E293B' : 'transparent',
    color: tab === t ? '#E2E8F0' : '#94A3B8',
    transition: 'all 150ms',
  });

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={handleOpen}
        title="View Raw JSON"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold shadow-lg transition-all cursor-pointer"
        style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
      >
        <span style={{ fontSize: '11px', letterSpacing: '-1px' }}>{'{}'}</span> Raw JSON
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div
            className="flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: '680px', maxHeight: '80vh',
              background: '#0F172A',
              border: '1px solid #1E293B',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid #1E293B' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold" style={{ color: '#22D3EE' }}>Raw JSON</span>
                {/* Tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: '#0B1120' }}>
                  <button style={tabStyle('view')}  onClick={() => setTab('view')}>View</button>
                  <button style={tabStyle('restore')} onClick={() => setTab('restore')}>Restore</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tab === 'view' && (
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 text-xs font-mono rounded-md cursor-pointer transition-all"
                    style={{ background: copied ? '#166534' : '#1E293B', color: copied ? '#86EFAC' : '#94A3B8', border: '1px solid #334155' }}
                  >
                    {copied ? '✓ copied' : 'copy'}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-2.5 py-1 text-xs font-mono rounded-md cursor-pointer transition-all"
                  style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5" style={{ fontFamily: 'monospace', minHeight: '300px' }}>
              {tab === 'view' ? (
                viewError ? (
                  <p className="text-xs" style={{ color: '#F87171' }}>{viewError}</p>
                ) : (
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all" style={{ color: '#CBD5E1' }}>
                    {json || 'No data found.'}
                  </pre>
                )
              ) : (
                <div className="flex flex-col gap-3 h-full">
                  <p className="text-xs" style={{ color: '#94A3B8' }}>
                    Paste previously copied JSON below to restore your resume data.
                  </p>
                  <textarea
                    value={pasteInput}
                    onChange={e => { setPasteInput(e.target.value); setRestoreState('idle'); }}
                    placeholder={'{\n  "full_name": "...",\n  ...\n}'}
                    className="flex-1 w-full resize-none text-xs leading-relaxed rounded-lg p-3"
                    style={{
                      minHeight: '220px',
                      background: '#0B1120',
                      color: '#CBD5E1',
                      border: `1px solid ${restoreState === 'error' ? '#F87171' : restoreState === 'success' ? '#86EFAC' : '#334155'}`,
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                  {restoreState !== 'idle' && (
                    <p className="text-xs" style={{ color: restoreState === 'success' ? '#86EFAC' : '#F87171' }}>
                      {restoreMsg}
                    </p>
                  )}
                  <button
                    onClick={handleRestore}
                    disabled={!pasteInput.trim()}
                    className="px-4 py-2 text-xs font-mono font-semibold rounded-lg cursor-pointer transition-all self-end"
                    style={{
                      background: pasteInput.trim() ? '#22D3EE' : '#1E293B',
                      color: pasteInput.trim() ? '#0F172A' : '#334155',
                      border: '1px solid transparent',
                      opacity: pasteInput.trim() ? 1 : 0.5,
                    }}
                  >
                    Restore Data
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 flex items-center gap-3"
              style={{ borderTop: '1px solid #1E293B' }}>
              <span className="text-xs font-mono" style={{ color: '#64748B' }}>
                {tab === 'view' ? 'read-only · your browser storage' : 'paste valid JSON to overwrite current data'}
              </span>
              <span className="ml-auto text-xs font-mono" style={{ color: '#64748B' }}>dev only</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTools;
