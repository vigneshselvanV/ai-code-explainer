import { useState, useEffect, useId } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    if (!chart?.trim()) {
      setError('No flowchart data available');
      return;
    }

    let cancelled = false;

    const renderChart = async () => {
      // Dynamic import for code-splitting — mermaid is ~500KB
      const { default: mermaid } = await import('mermaid');

      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'strict',
        fontFamily: '"Inter", sans-serif',
      });

      // Strip markdown code-block wrappers if present
      let cleanChart = chart.trim();
      cleanChart = cleanChart.replace(/^```[a-zA-Z]*\s*[\r\n]+/, '');
      cleanChart = cleanChart.replace(/[\r\n]+```$/, '');
      cleanChart = cleanChart.replace(/\\n/g, '\n').replace(/\\"/g, '"');

      // Sanitize 1: Remove unescaped newlines inside node labels ["..."]
      let inString = false;
      let sanitized = '';
      for (let i = 0; i < cleanChart.length; i++) {
        const char = cleanChart[i];
        if (char === '"' && cleanChart[i - 1] !== '\\') inString = !inString;
        if (inString && (char === '\n' || char === '\r')) sanitized += ' ';
        else sanitized += char;
      }
      cleanChart = sanitized;

      // Sanitize 2: Auto-close missing brackets at the end of lines
      // Small LLMs often forget to close nodes like `A[Label` or `B{Condition` before a newline
      let lines = cleanChart.split('\n');
      lines = lines.map(line => {
        let l = line.trimEnd();
        // Count brackets/braces to see if there's an imbalance on this specific line
        const openSquare = (l.match(/\[/g) || []).length;
        const closeSquare = (l.match(/\]/g) || []).length;
        const openCurly = (l.match(/\{/g) || []).length;
        const closeCurly = (l.match(/\}/g) || []).length;
        
        // If there is an open bracket but no close bracket, close it
        if (openSquare > closeSquare && !l.endsWith(']')) {
           // check if it has quotes
           const openQuotes = (l.match(/"/g) || []).length;
           if (openQuotes % 2 !== 0) l += '"'; // close quote first
           l += ']';
        } else if (openCurly > closeCurly && !l.endsWith('}')) {
           const openQuotes = (l.match(/"/g) || []).length;
           if (openQuotes % 2 !== 0) l += '"'; // close quote first
           l += '}';
        }
        return l;
      });
      cleanChart = lines.join('\n').trim();

      const id = `mermaid-${uniqueId}-${Date.now()}`;

      try {
        const { svg: rendered } = await mermaid.render(id, cleanChart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to render flowchart');
          setSvg('');
        }
      }
    };

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, uniqueId]);

  if (error) {
    return (
      <div className="mermaid-error">
        <p className="mermaid-error__message">{error}</p>
        {chart && <pre className="mermaid-error__source">{chart}</pre>}
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
      aria-label="Code execution flowchart"
    />
  );
}
