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
      // Fix literal escaped sequences from LLM JSON strings
      cleanChart = cleanChart.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      cleanChart = cleanChart.trim();

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
