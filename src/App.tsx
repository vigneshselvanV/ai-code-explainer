import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Sparkles, GraduationCap, Bug, ListTree, GitGraph, StepForward, Gauge } from 'lucide-react';

import { useTheme } from './hooks/useTheme';
import { useCodeAnalysis } from './hooks/useCodeAnalysis';
import { useToastState, ToastContext } from './hooks/useToast';

import { Navbar } from './components/layout/Navbar';
import { CodeEditor } from './components/editor/CodeEditor';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Typewriter } from './components/ui/Typewriter';

import { LOADING_STEPS } from './constants';
import type { SupportedLanguage, ExplanationData } from './types';

const PREVIEW_FEATURES = [
  { text: 'Teacher & Debugger', icon: <GraduationCap size={16} className="preview-card__icon" /> },
  { text: 'Corrected Code', icon: <Bug size={16} className="preview-card__icon" /> },
  { text: 'Line-by-Line Breakdown', icon: <ListTree size={16} className="preview-card__icon" /> },
  { text: 'Mermaid Flowcharts', icon: <GitGraph size={16} className="preview-card__icon" /> },
  { text: 'Step Debugger', icon: <StepForward size={16} className="preview-card__icon" /> },
  { text: 'Big-O Complexity', icon: <Gauge size={16} className="preview-card__icon" /> }
];

const ExplanationView = lazy(
  () => import('./components/explanation/ExplanationView'),
);

// ==================== Explanation Panel ====================

function ExplanationPanel({
  explanation,
  loading,
  loadingStepIdx,
  error,
  language,
  code,
}: {
  explanation: ExplanationData | null;
  loading: boolean;
  loadingStepIdx: number;
  error: string | null;
  language: string;
  code: string;
}) {
  return (
    <aside className="explanation-panel" aria-label="AI Explanation">
      <div className="explanation-panel__header">
        <Sparkles size={20} className="explanation-panel__icon" />
        <h2 className="explanation-panel__title">AI Explanation</h2>
      </div>

      <div className="explanation-panel__content">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="explanation-panel__loading"
            >
              <div className="loading-spinner" aria-hidden="true">
                <div className="loading-spinner__ring" />
                <Sparkles size={28} className="loading-spinner__icon" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStepIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="loading-spinner__text"
                  role="status"
                >
                  {LOADING_STEPS[loadingStepIdx]}
                </motion.p>
              </AnimatePresence>
              <div className="loading-spinner__progress">
                <motion.div
                  className="loading-spinner__bar"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="explanation-panel__error"
              role="alert"
            >
              <div className="explanation-panel__error-icon">⚠️</div>
              <h3>Analysis Failed</h3>
              <p>{error}</p>
            </motion.div>
          ) : explanation ? (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Suspense
                fallback={
                  <p className="loading-spinner__text">Loading results…</p>
                }
              >
                <ExplanationView
                  data={explanation}
                  language={language}
                  code={code}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="explanation-panel__empty"
            >
              <div className="explanation-panel__empty-icon">🧠</div>
              <h3>
                <Typewriter text="Ready to analyze your code" delay={100} />
              </h3>
              <p>
                <Typewriter
                  text="Paste code in the editor and click Analyze"
                  delay={1500}
                />
              </p>
              
              <div className="explanation-panel__previews">
                {PREVIEW_FEATURES.map((feature, i) => (
                  <motion.div 
                    key={feature.text}
                    className="explanation-panel__preview-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.65, y: 0 }}
                    transition={{ delay: 2 + (i * 0.07), duration: 0.5 }}
                  >
                    {feature.icon}
                    <div className="preview-card__text">{feature.text}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

// ==================== App Content ====================

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const {
    explanation,
    loading,
    loadingStepIdx,
    error,
    analyze,
    setExplanation,
  } = useCodeAnalysis();
  const toastState = useToastState();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage | ''>('');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );

  // Responsive breakpoint listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup old history data from browser storage
  useEffect(() => {
    localStorage.removeItem('ai-code-history-v3');
  }, []);

  const handleAnalyze = useCallback(async () => {
    const result = await analyze(code, language);
    if (result) {
      toastState.addToast({ type: 'success', message: 'Analysis complete!' });
    } else {
      toastState.addToast({
        type: 'error',
        message: 'Analysis failed. See the panel for details.',
      });
    }
  }, [code, language, analyze, toastState]);


  // Shared props
  const editorProps = {
    code,
    language,
    loading,
    onCodeChange: setCode,
    onLanguageChange: setLanguage,
    onAnalyze: handleAnalyze,
  } as const;

  const explanationProps = {
    explanation,
    loading,
    loadingStepIdx,
    error,
    language,
    code,
  } as const;

  return (
    <ToastContext.Provider value={toastState}>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="app__body" id="main-content">
          {isMobile ? (
            /* ── Mobile: stacked vertical layout ── */
            <div className="app__mobile-layout">
              <CodeEditor {...editorProps} />
              <ExplanationPanel {...explanationProps} />
            </div>
          ) : (
            /* ── Desktop: resizable panels ── */
            <PanelGroup orientation="horizontal" className="app__panels">
              <Panel
                defaultSize={50}
                minSize={25}
              >
                <CodeEditor {...editorProps} />
              </Panel>

              <PanelResizeHandle className="resize-handle" />

              <Panel defaultSize={50} minSize={25}>
                <ExplanationPanel {...explanationProps} />
              </Panel>
            </PanelGroup>
          )}
        </div>

        <ToastContainer toasts={toastState.toasts} onRemove={toastState.removeToast} />
      </div>
    </ToastContext.Provider>
  );
}

// ==================== Root Export ====================

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
