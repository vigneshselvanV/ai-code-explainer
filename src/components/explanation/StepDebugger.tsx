import { useState, useEffect, memo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Activity,
  Database,
} from 'lucide-react';
import Prism from 'prismjs';
import type { ExplanationData } from '../../types';

interface StepDebuggerProps {
  data: ExplanationData;
  language: string;
  code: string;
}

export const StepDebugger = memo(function StepDebugger({
  data,
  language,
  code,
}: StepDebuggerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxSteps = Math.max(
    data.dryRun?.length ?? 0,
    data.memoryVisualization?.length ?? 0,
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= maxSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  if (maxSteps === 0) return null;

  const dryRunStep = data.dryRun?.[currentStep];
  const memoryStep = data.memoryVisualization?.[currentStep];
  const codeLines = code.split('\n');

  return (
    <div className="step-debugger" role="region" aria-label="Step-by-step debugger">
      {/* Controls */}
      <div className="step-debugger__controls">
        <div className="step-debugger__buttons">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className={`step-debugger__btn ${isPlaying ? 'step-debugger__btn--pause' : 'step-debugger__btn--play'}`}
            aria-label={isPlaying ? 'Pause execution' : 'Play execution'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
            disabled={currentStep === 0 || isPlaying}
            className="step-debugger__btn step-debugger__btn--nav"
            aria-label="Previous step"
          >
            <SkipBack size={16} />
          </button>
          <span className="step-debugger__counter" aria-live="polite">
            Step {currentStep + 1} / {maxSteps}
          </span>
          <button
            onClick={() => setCurrentStep(p => Math.min(maxSteps - 1, p + 1))}
            disabled={currentStep === maxSteps - 1 || isPlaying}
            className="step-debugger__btn step-debugger__btn--nav"
            aria-label="Next step"
          >
            <SkipForward size={16} />
          </button>
        </div>
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="step-debugger__btn step-debugger__btn--reset"
          aria-label="Reset debugger"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Content Grid */}
      <div className="step-debugger__content">
        {/* Code View */}
        <div className="step-debugger__code-view">
          <div className="step-debugger__code-header">Code Execution</div>
          <div
            className="step-debugger__code-body"
            role="log"
            aria-label="Code execution trace"
          >
            {codeLines.map((line, idx) => {
              const isActive =
                dryRunStep?.lineNumber === idx + 1 ||
                memoryStep?.lineNumber === idx + 1;
              return (
                <div
                  key={idx}
                  className={`step-debugger__line ${isActive ? 'step-debugger__line--active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="step-debugger__line-num">{idx + 1}</span>
                  <span
                    className="step-debugger__line-code"
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        line,
                        Prism.languages[language] || Prism.languages.javascript,
                        language,
                      ),
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* State View */}
        <div className="step-debugger__state-view">
          {/* Action Card */}
          <div className="step-debugger__action-card">
            <h4 className="step-debugger__card-heading">
              <Activity size={16} /> Action
            </h4>
            <p className="step-debugger__card-body">
              {dryRunStep?.description || 'No action'}
            </p>
            {dryRunStep?.variableChanges && (
              <div className="step-debugger__changes">
                <h5 className="step-debugger__changes-label">Changes</h5>
                <code className="step-debugger__changes-value">
                  {dryRunStep.variableChanges}
                </code>
              </div>
            )}
            {dryRunStep?.outputProduced && (
              <div className="step-debugger__output">
                <h5 className="step-debugger__output-label">Output</h5>
                <code className="step-debugger__output-value">
                  {dryRunStep.outputProduced}
                </code>
              </div>
            )}
          </div>

          {/* Memory Card */}
          <div className="step-debugger__memory-card">
            <h4 className="step-debugger__card-heading">
              <Database size={16} /> Memory State
            </h4>
            {memoryStep?.variables?.length ? (
              <div className="step-debugger__variables">
                {memoryStep.variables.map((v, i) => (
                  <div key={i} className="step-debugger__variable">
                    <span className="step-debugger__var-name">{v.name}</span>
                    <span className="step-debugger__var-value">{v.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="step-debugger__empty">No variables in memory</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
