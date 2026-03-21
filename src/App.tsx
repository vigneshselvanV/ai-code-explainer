import { useState, useEffect, useMemo } from 'react';

import { Moon, Sun, Code2, Sparkles, Terminal, History, Clock, ChevronRight, Play, Search, BookOpen, List, TerminalSquare, Lightbulb, Zap, Activity, GitCommit, Copy, Check, Database, Bug, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Group, Panel, Separator } from 'react-resizable-panels';
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

import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: '"Inter", sans-serif',
});

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!chart || chart.trim() === '') {
      setSvg(`<div class="text-gray-500 italic">No flowchart data available.</div>`);
      return;
    }

    // Strip markdown code block syntax if present
    let cleanChart = chart.trim();
    cleanChart = cleanChart.replace(/^```[a-zA-Z]*\s*[\r\n]+/, '');
    cleanChart = cleanChart.replace(/[\r\n]+```$/, '');
    cleanChart = cleanChart.trim();

    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    try {
      mermaid.render(id, cleanChart).then((result) => {
        setSvg(result.svg);
      }).catch(e => {
        console.error("Mermaid rendering error", e);
        // Fallback to a simple error chart
        const errorChart = `graph TD\nError["Failed to render flowchart"]\nSyntax["Check syntax"]\nError --> Syntax`;
        mermaid.render(`${id}-error`, errorChart).then(res => {
          setSvg(`${res.svg}<div class="mt-4 text-red-500 mb-2 text-sm font-medium">Original Syntax:</div><pre class="text-xs text-gray-800 dark:text-gray-200 overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">${cleanChart}</pre>`);
        }).catch(() => {
          setSvg(`<div class="text-red-500 mb-2">Failed to render flowchart. Please check the generated syntax.</div><pre class="text-xs text-gray-800 dark:text-gray-200 overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">${cleanChart}</pre>`);
        });
      });
    } catch (e) {
      console.error("Mermaid sync rendering error", e);
      setSvg(`<div class="text-red-500 mb-2">Failed to render flowchart. Please check the generated syntax.</div><pre class="text-xs text-gray-800 dark:text-gray-200 overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">${cleanChart}</pre>`);
    }
  }, [chart]);

  return (
    <div
      className="flex justify-center overflow-auto p-4 bg-white dark:bg-gray-900 rounded-xl"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const AuthModal = ({ isOpen, onClose, mode, setMode, onLogin }: { isOpen: boolean, onClose: () => void, mode: 'login' | 'signup', setMode: (mode: 'login' | 'signup') => void, onLogin: (username: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] text-white shadow-lg shadow-[var(--primary-from)]/30">
                  <Code2 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-from)] focus:border-transparent transition-all outline-none"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-from)] focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold shadow-lg shadow-[var(--primary-from)]/25 transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[var(--primary-from)] to-[var(--primary-to)]"
              >
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-[var(--primary-from)] hover:text-[var(--primary-to)] transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



const SYSTEM_INSTRUCTION = `You are an AI Coding Assistant and Visual Debugger.
Given any code input from the user, perform the following actions:
1. Parse the code and identify all functions, loops, and conditional statements.
2. Generate a real-time flowchart diagram representing the code's execution path using Mermaid.js syntax (graph TD).
3. Animate variable memory states for each line of execution: Show how variables are created, updated, and deleted.
4. Provide an algorithm visualization for any algorithm present (sorting, searching, recursion, etc.).
5. Detect syntax errors, logical bugs, or potential runtime issues and suggest corrections.
6. Allow step-by-step debugging with tooltip explanations of each line and variable.

You MUST respond strictly in the following JSON schema format:
{
  "overview": "Short summary of the program overview",
  "lineByLine": [{ "code": "exact code line", "explanation": "what it does", "lineNumber": 1 }],
  "output": "Expected Console Output",
  "keyConcepts": "Core concepts",
  "timeComplexity": "O(N) explanation",
  "spaceComplexity": "O(1) explanation",
  "dryRun": [{ "step": 1, "lineNumber": 1, "description": "action", "variableChanges": "i becomes 0", "outputProduced": "" }],
  "memoryVisualization": [{ "step": 1, "lineNumber": 1, "variables": [{ "name": "x", "value": "1" }] }],
  "bugFixes": { "error": "msg", "fixedCode": "code", "explanation": "text" },
  "mermaidFlowchart": "graph TD\\n  A-->B\\n  B-->C"
}
Make sure mermaidFlowchart uses graph TD syntax and is a strict single string with \n for newlines.
Use emojis like 📘, 🔍, 📊, ⚡, 🧠, 🟢, 🔹, 🚀, 💡, 🛠, 🐞, 🧑‍🏫 where appropriate.`;

type ExplanationData = {
  overview: string;
  lineByLine: { code: string; explanation: string; lineNumber: number }[];
  output: string;
  keyConcepts: string;
  timeComplexity: string;
  spaceComplexity: string;
  dryRun: { step: number; lineNumber: number; description: string; variableChanges: string; outputProduced: string }[];
  memoryVisualization: { step: number; lineNumber: number; variables: { name: string; value: string }[] }[];
  mermaidFlowchart: string;
  bugFixes?: { error: string; fixedCode: string; explanation: string };
};

type HistoryItem = {
  id: string;
  code: string;
  explanation: ExplanationData;
  timestamp: number;
};

const LOADING_STEPS = [
  "🔍 Scanning code structure...",
  "🧠 Understanding logic...",
  "⚡ Generating explanation...",
  "📊 Creating visual diagrams..."
];

const Typewriter = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      timeout = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timeout);
      }, 15);
    };

    const initialDelay = setTimeout(startTyping, delay * 1000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(timeout);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

const CopyButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
};

const StepDebugger = ({ data, language, code }: { data: ExplanationData, language: string, code: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const maxSteps = Math.max(data.dryRun?.length || 0, data.memoryVisualization?.length || 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  if (maxSteps === 0) return null;

  const dryRunStep = data.dryRun?.[currentStep];
  const memoryStep = data.memoryVisualization?.[currentStep];
  const codeLines = code.split('\n');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 font-medium text-sm ${isPlaying ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0 || isPlaying}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Prev
          </button>
          <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300 px-2">
            Step {currentStep + 1} / {maxSteps}
          </span>
          <button
            onClick={() => setCurrentStep(prev => Math.min(maxSteps - 1, prev + 1))}
            disabled={currentStep === maxSteps - 1 || isPlaying}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(0)}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code View */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
            Code Execution
          </div>
          <div className="p-4 overflow-auto font-mono text-sm space-y-1 max-h-[300px]">
            {codeLines.map((line, idx) => {
              const isCurrentLine = dryRunStep?.lineNumber === idx + 1 || memoryStep?.lineNumber === idx + 1;
              return (
                <div
                  key={idx}
                  className={`flex gap-4 px-2 py-0.5 rounded ${isCurrentLine ? 'bg-blue-100 dark:bg-blue-900/40 border-l-2 border-blue-500' : 'opacity-70'}`}
                >
                  <span className="text-gray-400 select-none w-6 text-right">{idx + 1}</span>
                  <span
                    className="whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: Prism.highlight(line, Prism.languages[language] || Prism.languages.javascript, language) }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* State View */}
        <div className="flex flex-col gap-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 p-4 flex-1">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Activity size={16} /> Action
            </h4>
            <p className="text-amber-900 dark:text-amber-100 text-sm">{dryRunStep?.description || 'No action'}</p>

            {dryRunStep?.variableChanges && (
              <div className="mt-3">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 text-xs uppercase tracking-wider">Changes</h4>
                <p className="text-emerald-700 dark:text-emerald-400 text-sm font-mono bg-emerald-100/50 dark:bg-emerald-900/30 p-2 rounded">{dryRunStep.variableChanges}</p>
              </div>
            )}

            {dryRunStep?.outputProduced && (
              <div className="mt-3">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 text-xs uppercase tracking-wider">Output</h4>
                <p className="text-blue-700 dark:text-blue-400 text-sm font-mono bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded">{dryRunStep.outputProduced}</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-4 flex-1">
            <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
              <Database size={16} /> Memory State
            </h4>
            {memoryStep?.variables && memoryStep.variables.length > 0 ? (
              <div className="space-y-2">
                {memoryStep.variables.map((v, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 p-2 rounded border border-indigo-100 dark:border-indigo-800/30">
                    <span className="font-mono text-sm text-indigo-900 dark:text-indigo-100">{v.name}</span>
                    <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{v.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-indigo-900/50 dark:text-indigo-100/50 italic">No variables in memory</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExplanationView = ({ data, language, code }: { data: ExplanationData, language: string, code: string }) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Overview - Blue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
          <BookOpen className="text-blue-600 dark:text-blue-400" /> 📘 Program Overview
        </h3>
        <p className="text-blue-900 dark:text-blue-100 leading-relaxed">
          <Typewriter text={data.overview} delay={0.2} />
        </p>
      </motion.div>

      {/* Bug Fixes - Red (Conditional) */}
      {data.bugFixes && data.bugFixes.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 shadow-sm"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-800 dark:text-red-300 mb-3">
            <Bug className="text-red-600 dark:text-red-400" /> 🐞 Bug Detected
          </h3>
          <p className="text-red-900 dark:text-red-100 leading-relaxed mb-4">{data.bugFixes.error}</p>

          <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">Corrected Code:</h4>
          <div className="relative group mb-4">
            <pre className="font-mono text-sm text-red-900 dark:text-red-100 bg-white/60 dark:bg-gray-900/60 p-4 rounded-xl border border-red-100 dark:border-red-800/30 whitespace-pre-wrap">
              {data.bugFixes.fixedCode}
            </pre>
            <CopyButton text={data.bugFixes.fixedCode} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-black/50" />
          </div>

          <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">Fix Explanation:</h4>
          <p className="text-red-900 dark:text-red-100 leading-relaxed">{data.bugFixes.explanation}</p>
        </motion.div>
      )}

      {/* Line by Line - Green */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
          <List className="text-emerald-600 dark:text-emerald-400" /> 🔍 Line-by-Line Explanation
        </h3>
        <div className="space-y-3">
          {data.lineByLine.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-emerald-100 dark:border-emerald-800/30">
              <div className="sm:w-1/3 relative group">
                <code
                  className="block font-mono text-sm bg-emerald-100/50 dark:bg-emerald-900/30 p-3 rounded-lg break-all"
                  dangerouslySetInnerHTML={{ __html: Prism.highlight(item.code, Prism.languages[language] || Prism.languages.javascript, language) }}
                />
                <CopyButton text={item.code} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-black/50" />
              </div>
              <p className="sm:w-2/3 text-emerald-900 dark:text-emerald-100 text-sm flex items-center">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Output - Light Green */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-xl font-bold text-teal-800 dark:text-teal-300">
            <TerminalSquare className="text-teal-600 dark:text-teal-400" /> 📊 Expected Output
          </h3>
          <CopyButton text={data.output} />
        </div>
        <pre className="font-mono text-sm text-teal-900 dark:text-teal-100 bg-white/60 dark:bg-gray-900/60 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 whitespace-pre-wrap">
          {data.output}
        </pre>
      </motion.div>

      {/* Key Concepts - Purple */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">
          <Lightbulb className="text-purple-600 dark:text-purple-400" /> 🧠 Key Concepts
        </h3>
        <p className="text-purple-900 dark:text-purple-100 leading-relaxed">{data.keyConcepts}</p>
      </motion.div>

      {/* Complexity - Orange */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-xl font-bold text-orange-800 dark:text-orange-300 mb-2">
            <Zap className="text-orange-600 dark:text-orange-400" /> ⚡ Time Complexity
          </h3>
          <p className="text-orange-900 dark:text-orange-100 leading-relaxed">{data.timeComplexity}</p>
        </div>
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-xl font-bold text-orange-800 dark:text-orange-300 mb-2">
            <Activity className="text-orange-600 dark:text-orange-400" /> 💾 Space Complexity
          </h3>
          <p className="text-orange-900 dark:text-orange-100 leading-relaxed">{data.spaceComplexity}</p>
        </div>
      </motion.div>

      {/* Step Debugger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      >
        <StepDebugger data={data} language={language} code={code} />
      </motion.div>

      {/* Flowchart - Gray/Default */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
            <GitCommit className="text-gray-600 dark:text-gray-400" /> 🛠️ Execution Flowchart
          </h3>
          <CopyButton text={data.mermaidFlowchart} />
        </div>
        <MermaidDiagram chart={data.mermaidFlowchart} />
      </motion.div>

    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [teachMeMode, setTeachMeMode] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ username: string } | null>(null);

  const [language, setLanguage] = useState('python');

  // Initialize theme and history from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const savedHistory = localStorage.getItem('ai-code-history-v2');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Apply theme changes to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save history changes
  useEffect(() => {
    localStorage.setItem('ai-code-history-v2', JSON.stringify(history));
  }, [history]);

  // Multi-step loading animation
  useEffect(() => {
    if (loading) {
      setLoadingStepIdx(0);
      const interval = setInterval(() => {
        setLoadingStepIdx(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setExplanation(null);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: SYSTEM_INSTRUCTION
            },
            {
              role: "user",
              content: `Explain the following code.\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nDebug Mode: ${debugMode ? 'ON (If the code has errors, explain the error, show the corrected code, and explain the fix in the bugFixes field)' : 'OFF'}\nTeach Me Mode: ${teachMeMode ? 'ON (Explain like a programming teacher. Include simple explanations, emojis, examples, and beginner tips)' : 'OFF'}\n\nPlease respond strictly in JSON computing the required schema.`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        let errorBody = '';
        try {
          const errJson = await response.json();
          errorBody = errJson.error?.message || JSON.stringify(errJson);
        } catch (e) {
          try {
            errorBody = await response.text();
          } catch (e2) {}
        }
        throw new Error(`OpenRouter API Error ${response.status}: ${errorBody || response.statusText}`);
      }
      
      const jsonResponse = await response.json();
      let text = jsonResponse.choices?.[0]?.message?.content || '{}';
      
      // Strip potential markdown code block wrappers
      text = text.trim();
      if (text.startsWith('```json')) text = text.slice(7);
      else if (text.startsWith('```')) text = text.slice(3);
      if (text.endsWith('```')) text = text.slice(0, -3);
      text = text.trim();

      let parsedData;
      try {
        parsedData = JSON.parse(text) as ExplanationData;
      } catch (err) {
        throw new Error('The AI failed to format its response as JSON. Try analyzing again.');
      }
      
      if (!parsedData || !parsedData.overview || !Array.isArray(parsedData.lineByLine)) {
        throw new Error('The AI model returned incorrect data format. Please try again.');
      }

      setExplanation(parsedData);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        code,
        explanation: parsedData,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (error: any) {
      console.error('Explanation Error:', error);
      alert(`❌ Error: ${error.message || 'Failed to generate explanation. Please try again or check the console.'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCode(item.code);
    setExplanation(item.explanation);
  };

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden relative">

      {/* Floating Gradient Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] opacity-20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[var(--secondary-from)] to-[var(--secondary-to)] opacity-20 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <header
        className="h-16 shrink-0 flex items-center justify-between px-6 shadow-sm z-30 relative"
        style={{
          backgroundColor: 'var(--card)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--card-border)'
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryOpen(prev => !prev)}
            className="p-2.5 rounded-full transition-all hover:scale-110 shadow-sm mr-2"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
            aria-label="Toggle history"
          >
            <History size={20} />
          </button>
          <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] text-white shadow-lg shadow-[var(--primary-from)]/30">
            <Code2 size={24} />
          </div>
          <h1 className="font-bold text-xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-from)] to-[var(--secondary-to)]">
            AI Coding Tutor & Code Visualizer
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 mr-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hi, <span className="font-bold text-[var(--primary-from)]">{user.username}</span>
              </span>
              <button
                onClick={() => setUser(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[var(--primary-from)] to-[var(--primary-to)] rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Sign up
              </button>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all hover:scale-110 shadow-sm relative overflow-hidden"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--text)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={(username) => setUser({ username })}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden w-full max-w-[1920px] mx-auto p-4 relative">
        <Group orientation="horizontal" className="gap-2">
          {isHistoryOpen && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col">
                <aside
                  className="flex-1 flex flex-col overflow-hidden rounded-3xl shadow-lg"
                  style={{
                    backgroundColor: 'var(--sidebar)',
                    backdropFilter: 'var(--glass-blur)',
                    WebkitBackdropFilter: 'var(--glass-blur)',
                    border: '1px solid var(--card-border)'
                  }}
                >
                  <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <div className="flex items-center gap-2">
                      <History size={18} style={{ color: 'var(--primary-from)' }} />
                      <h2 className="font-semibold">Chat History</h2>
                    </div>
                    <button
                      onClick={() => setIsHistoryOpen(false)}
                      className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                      <p className="text-sm text-center mt-10" style={{ color: 'var(--muted)' }}>No history yet.</p>
                    ) : (
                      history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            loadHistoryItem(item);
                          }}
                          className="w-full text-left p-4 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--card-border)' }}
                        >
                          <div className="text-xs mb-2 flex items-center justify-between" style={{ color: 'var(--muted)' }}>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary-from)' }} />
                          </div>
                          <pre className="text-xs line-clamp-3 overflow-hidden font-mono whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{item.code}</pre>
                        </button>
                      ))
                    )}
                  </div>
                </aside>
              </Panel>
              <Separator className="ResizeHandle" />
            </>
          )}

          {/* Middle Panel: Code Input */}
          <Panel defaultSize={isHistoryOpen ? 40 : 50} minSize={20} className="flex flex-col">
            <main className="flex-1 flex flex-col h-full space-y-4">
              <div
                className="rounded-3xl shadow-lg flex flex-col flex-1 overflow-hidden"
                style={{
                  backgroundColor: 'var(--card)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1px solid var(--card-border)'
                }}
              >
                <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--sidebar)', borderBottom: '1px solid var(--card-border)' }}>
                  <div className="flex items-center gap-2">
                    <Terminal size={18} style={{ color: 'var(--secondary-from)' }} />
                    <span className="text-sm font-medium">Code Editor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 outline-none text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-[var(--primary-from)] transition-all font-medium cursor-pointer"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                    </select>
                    <CopyButton text={code} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto flex" style={{ backgroundColor: 'var(--code-bg)' }}>
                  <div
                    className="py-6 px-3 text-right select-none font-mono text-[14px] leading-[21px] opacity-40 border-r border-gray-200 dark:border-gray-700 shrink-0"
                    style={{ minWidth: '2.5rem', color: 'var(--text)', paddingTop: '24px' }}
                  >
                    {code.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <Editor
                      value={code}
                      onValueChange={code => setCode(code)}
                      highlight={code => {
                        const lang = Prism.languages[language] || Prism.languages.javascript;
                        return Prism.highlight(code, lang, language);
                      }}
                      padding={24}
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 14,
                        lineHeight: 1.5,
                        minHeight: '100%',
                        color: 'var(--text)'
                      }}
                      textareaClassName="focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 shrink-0 px-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${debugMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${debugMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={debugMode} onChange={e => setDebugMode(e.target.checked)} className="sr-only" />
                  <span className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors"><Bug size={16} /> Debug My Code</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${teachMeMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${teachMeMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={teachMeMode} onChange={e => setTeachMeMode(e.target.checked)} className="sr-only" />
                  <span className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors"><BookOpen size={16} /> Teach Me Mode</span>
                </label>
              </div>

              <div className="flex justify-center shrink-0">
                <button
                  onClick={handleAnalyze}
                  disabled={!code.trim() || loading}
                  className="group relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-[var(--primary-from)]/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary-from)] via-[var(--secondary-from)] to-[var(--primary-to)] animate-gradient-x"></span>
                  <span className="relative flex items-center gap-2 px-8 py-4 rounded-full transition-all bg-[var(--bg)] group-hover:bg-opacity-0 group-hover:text-white" style={{ color: 'var(--text)' }}>
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="font-semibold">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} className="fill-current" />
                        <span className="font-semibold">Analyze Code</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </main>
          </Panel>

          <Separator className="ResizeHandle" />

          {/* Right Panel: AI Explanation Output */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col">
            <aside
              className="flex-1 flex flex-col overflow-hidden rounded-3xl shadow-lg"
              style={{
                backgroundColor: 'var(--card)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: '1px solid var(--card-border)'
              }}
            >
              <div className="px-6 py-5 flex items-center gap-2 shrink-0" style={{ backgroundColor: 'var(--sidebar)', borderBottom: '1px solid var(--card-border)' }}>
                <Sparkles size={20} style={{ color: 'var(--primary-from)' }} />
                <h2 className="font-semibold">AI Explanation</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-8"
                    >
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-4 opacity-20" style={{ borderColor: 'var(--primary-from)' }}></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary-from)', borderTopColor: 'transparent' }}></div>
                        <Sparkles className="absolute inset-0 m-auto animate-pulse" size={32} style={{ color: 'var(--primary-from)' }} />
                      </div>

                      <div className="w-full max-w-xs space-y-4 text-center">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={loadingStepIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-lg font-medium"
                            style={{ color: 'var(--text)' }}
                          >
                            {LOADING_STEPS[loadingStepIdx]}
                          </motion.p>
                        </AnimatePresence>
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-border)' }}>
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary-from)] to-[var(--secondary-from)]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : explanation ? (
                    <motion.div
                      key="explanation"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <ExplanationView data={explanation} language={language} code={code} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center"
                      style={{ color: 'var(--muted)' }}
                    >
                      <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>🧠</div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        <Typewriter text="AI is ready to analyze your code" delay={0.1} />
                      </h3>
                      <p className="text-md text-gray-500 dark:text-gray-400">
                        <Typewriter text="Paste code and click Analyze" delay={1.5} />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>
          </Panel>
        </Group>
      </div>
    </div>
  );
}
