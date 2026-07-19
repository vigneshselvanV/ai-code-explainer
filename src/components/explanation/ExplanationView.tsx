import { motion } from 'motion/react';
import {
  BookOpen,
  List,
  TerminalSquare,
  Lightbulb,
  Zap,
  Activity,
  GitCommit,
  Bug,
} from 'lucide-react';
import Prism from 'prismjs';

import { CopyButton } from '../ui/CopyButton';
import { Typewriter } from '../ui/Typewriter';
import { StepDebugger } from './StepDebugger';
import { MermaidDiagram } from '../ui/MermaidDiagram';
import type { ExplanationData } from '../../types';

interface ExplanationViewProps {
  data: ExplanationData;
  language: string;
  code: string;
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

function ExplanationView({ data, language, code }: ExplanationViewProps) {
  return (
    <div className="explanation-view">
      {/* Overview */}
      <motion.section
        {...fade(0.1)}
        className="explanation-section explanation-section--overview"
        aria-labelledby="overview-heading"
      >
        <h3 id="overview-heading" className="explanation-section__heading">
          <BookOpen size={20} /> Program Overview
        </h3>
        <p className="explanation-section__body">
          <Typewriter text={data.overview} delay={200} />
        </p>
      </motion.section>

      {/* Bug Fixes (conditional) */}
      {data.bugFixes?.error && (
        <motion.section
          {...fade(0.15)}
          className="explanation-section explanation-section--error"
          aria-labelledby="bugs-heading"
        >
          <h3 id="bugs-heading" className="explanation-section__heading">
            <Bug size={20} /> Bug Detected
          </h3>
          <p className="explanation-section__body">{data.bugFixes.error}</p>

          <h4 className="explanation-section__subheading">Corrected Code</h4>
          <div className="explanation-section__code-block">
            <pre>{data.bugFixes.fixedCode}</pre>
            <CopyButton
              text={data.bugFixes.fixedCode}
              className="explanation-section__copy"
            />
          </div>

          <h4 className="explanation-section__subheading">Explanation</h4>
          <p className="explanation-section__body">{data.bugFixes.explanation}</p>
        </motion.section>
      )}

      {/* Line-by-Line */}
      <motion.section
        {...fade(0.2)}
        className="explanation-section explanation-section--lines"
        aria-labelledby="lines-heading"
      >
        <h3 id="lines-heading" className="explanation-section__heading">
          <List size={20} /> Line-by-Line Explanation
        </h3>
        <div className="line-explanations">
          {data.lineByLine.map((item, idx) => (
            <div key={idx} className="line-explanation">
              <div className="line-explanation__code">
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      item.code,
                      Prism.languages[language] || Prism.languages.javascript,
                      language,
                    ),
                  }}
                />
                <CopyButton text={item.code} className="line-explanation__copy" />
              </div>
              <p className="line-explanation__text">{item.explanation}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Expected Output */}
      <motion.section
        {...fade(0.3)}
        className="explanation-section explanation-section--output"
        aria-labelledby="output-heading"
      >
        <div className="explanation-section__heading-row">
          <h3 id="output-heading" className="explanation-section__heading">
            <TerminalSquare size={20} /> Expected Output
          </h3>
          <CopyButton text={data.output} />
        </div>
        <pre className="explanation-section__output">{data.output}</pre>
      </motion.section>

      {/* Key Concepts */}
      <motion.section
        {...fade(0.4)}
        className="explanation-section explanation-section--concepts"
        aria-labelledby="concepts-heading"
      >
        <h3 id="concepts-heading" className="explanation-section__heading">
          <Lightbulb size={20} /> Key Concepts
        </h3>
        <p className="explanation-section__body">{data.keyConcepts}</p>
      </motion.section>

      {/* Complexity */}
      <motion.section
        {...fade(0.5)}
        className="explanation-section explanation-section--complexity"
        aria-labelledby="complexity-heading"
      >
        <h3 id="complexity-heading" className="sr-only">
          Complexity Analysis
        </h3>
        <div className="complexity-grid">
          <div className="complexity-card">
            <h4 className="complexity-card__heading">
              <Zap size={18} /> Time Complexity
            </h4>
            <p className="complexity-card__body">{data.timeComplexity}</p>
          </div>
          <div className="complexity-card">
            <h4 className="complexity-card__heading">
              <Activity size={18} /> Space Complexity
            </h4>
            <p className="complexity-card__body">{data.spaceComplexity}</p>
          </div>
        </div>
      </motion.section>

      {/* Step Debugger */}
      <motion.section {...fade(0.6)} aria-labelledby="debugger-heading">
        <h3 id="debugger-heading" className="sr-only">
          Step-by-Step Debugger
        </h3>
        <StepDebugger data={data} language={language} code={code} />
      </motion.section>

      {/* Flowchart */}
      <motion.section
        {...fade(0.7)}
        className="explanation-section explanation-section--flowchart"
        aria-labelledby="flowchart-heading"
      >
        <div className="explanation-section__heading-row">
          <h3 id="flowchart-heading" className="explanation-section__heading">
            <GitCommit size={20} /> Execution Flowchart
          </h3>
          <CopyButton text={data.mermaidFlowchart} />
        </div>
        <MermaidDiagram chart={data.mermaidFlowchart} />
      </motion.section>
    </div>
  );
}

// Default export for React.lazy() code-splitting
export default ExplanationView;
