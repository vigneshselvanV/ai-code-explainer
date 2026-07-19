import { memo, useMemo, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { Terminal, Play } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';
import { LANGUAGES } from '../../constants';
import type { SupportedLanguage } from '../../types';

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage | '';
  loading: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: SupportedLanguage | '') => void;
  onAnalyze: () => void;
}

export const CodeEditor = memo(function CodeEditor({
  code,
  language,
  loading,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
}: CodeEditorProps) {
  const lineNumbers = useMemo(() => code.split('\n').map((_, i) => i + 1), [code]);

  const highlightCode = (src: string) => {
    if (!language) return src;
    const grammar = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(src, grammar, language);
  };

  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <section className="code-editor" aria-label="Code editor">
      {/* Toolbar */}
      <div className="code-editor__toolbar">
        <div className="code-editor__toolbar-left">
          <Terminal size={18} className="code-editor__toolbar-icon" />
          <span className="code-editor__toolbar-label">Editor</span>
        </div>
        <div className="code-editor__toolbar-right">
          <label htmlFor="language-select" className="sr-only">
            Programming language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={e => onLanguageChange(e.target.value as SupportedLanguage | '')}
            className={`code-editor__select ${!language ? 'code-editor__select--invalid' : ''}`}
          >
            <option value="" disabled>
              Select Language
            </option>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <CopyButton text={code} />
        </div>
      </div>

      {/* Editor Body */}
      <div className="code-editor__body">
        <div className="code-editor__line-numbers" aria-hidden="true" ref={lineNumbersRef}>
          {lineNumbers.map(n => (
            <div key={n} className="code-editor__line-number">
              {n}
            </div>
          ))}
        </div>
        <div className="code-editor__input-wrapper" onScroll={handleScroll}>
          <Editor
            value={code}
            onValueChange={onCodeChange}
            highlight={highlightCode}
            padding={24}
            placeholder="Paste your code here…"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              lineHeight: '21px',
              minHeight: '100%',
              minWidth: 'max-content',
            }}
            textareaClassName="code-editor__textarea"
            aria-label="Code input"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="code-editor__controls">

        <button
          onClick={onAnalyze}
          disabled={!code.trim() || !language || loading}
          className="analyze-button"
          aria-label={loading ? 'Analyzing code…' : 'Analyze code'}
        >
          {loading ? (
            <>
              <span className="analyze-button__spinner" aria-hidden="true" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Analyze Code</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
});
