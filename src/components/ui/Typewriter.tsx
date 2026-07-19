import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  /** Delay before typing starts (ms) */
  delay?: number;
  /** Speed per character (ms) */
  speed?: number;
  className?: string;
}

export function Typewriter({
  text,
  delay = 0,
  speed = 15,
  className = '',
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    setDisplayedText('');

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayedText(text.substring(0, index));
        if (index >= text.length && interval) clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed]);

  return <span className={className}>{displayedText}</span>;
}
