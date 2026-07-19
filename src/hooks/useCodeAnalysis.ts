import { useState, useEffect, useCallback } from 'react';
import type { ExplanationData } from '../types';
import { SYSTEM_INSTRUCTION, LOADING_STEPS } from '../constants';

export function useCodeAnalysis() {
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Cycle through loading step messages while loading
  useEffect(() => {
    if (!loading) return;
    setLoadingStepIdx(0);
    const interval = setInterval(() => {
      setLoadingStepIdx(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const analyze = useCallback(
    async (
      code: string,
      language: string,
    ): Promise<ExplanationData | null> => {
      if (!code.trim()) return null;

      setLoading(true);
      setExplanation(null);
      setError(null);

      try {
        const debugPrompt = 'ON (If the code has errors, explain the error, show the corrected code, and explain the fix in the bugFixes field)';
        const teachPrompt = 'ON (Explain like a programming teacher. Include simple explanations, emojis, examples, and beginner tips)';

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION },
              {
                role: 'user',
                content: [
                  `Explain the following ${language} code.`,
                  '',
                  `Code:\n\`\`\`${language}\n${code}\n\`\`\``,
                  '',
                  `Debug Mode: ${debugPrompt}`,
                  `Teach Me Mode: ${teachPrompt}`,
                  '',
                  'Please respond strictly in JSON following the required schema.',
                ].join('\n'),
              },
            ],
          }),
        });

        if (!response.ok) {
          const errData: { error?: string } = await response.json().catch(() => ({}));
          throw new Error(errData.error || `API Error: ${response.status}`);
        }

        const data: { choices?: { message?: { content?: string } }[] } =
          await response.json();
        let text = data.choices?.[0]?.message?.content ?? '{}';

        // Strip markdown code-block wrappers the model may add
        text = text.trim();
        if (text.startsWith('```json')) text = text.slice(7);
        else if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        text = text.trim();

        // Extract the outermost JSON object in case the model added conversational text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          text = jsonMatch[0];
        }

        let parsed: ExplanationData;
        try {
          parsed = JSON.parse(text) as ExplanationData;
        } catch (e) {
          console.error("Failed to parse LLM response:", text);
          throw new Error("The AI returned a malformed response. Please try clicking Analyze again.");
        }

        // Utility to fix double-escaped literal \n characters from LLM
        const unescapeNewlines = (obj: any): any => {
          if (typeof obj === 'string') {
            return obj.replace(/\\n/g, '\n');
          }
          if (Array.isArray(obj)) {
            return obj.map(unescapeNewlines);
          }
          if (obj !== null && typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
              newObj[key] = unescapeNewlines(obj[key]);
            }
            return newObj;
          }
          return obj;
        };

        const finalParsed = unescapeNewlines(parsed);
        
        if (!finalParsed?.overview || !Array.isArray(finalParsed?.lineByLine)) {
          throw new Error('The AI returned an invalid response format. Please try again.');
        }

        setExplanation(finalParsed);
        return finalParsed;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    explanation,
    loading,
    loadingStepIdx,
    error,
    analyze,
    setExplanation,
    setError,
  } as const;
}
