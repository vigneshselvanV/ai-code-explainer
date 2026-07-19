// ==================== Core Data Types ====================

export interface LineExplanation {
  code: string;
  explanation: string;
  lineNumber: number;
}

export interface DryRunStep {
  step: number;
  lineNumber: number;
  description: string;
  variableChanges: string;
  outputProduced: string;
}

export interface MemoryVariable {
  name: string;
  value: string;
}

export interface MemoryStep {
  step: number;
  lineNumber: number;
  variables: MemoryVariable[];
}

export interface BugFix {
  error: string;
  fixedCode: string;
  explanation: string;
}

export interface ExplanationData {
  overview: string;
  lineByLine: LineExplanation[];
  output: string;
  keyConcepts: string;
  timeComplexity: string;
  spaceComplexity: string;
  dryRun: DryRunStep[];
  memoryVisualization: MemoryStep[];
  mermaidFlowchart: string;
  bugFixes?: BugFix;
}


// ==================== UI Types ====================

export type Theme = 'light' | 'dark';

export type SupportedLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'c'
  | 'cpp';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
