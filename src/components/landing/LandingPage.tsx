import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Code2, Bug, Search, Layout, Play, ArrowRight, Github, Moon, Sun, Cpu, Linkedin } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './LandingPage.css';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [demoState, setDemoState] = useState<'analyzing' | 'held'>('analyzing');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDemoState('held');
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    
    const runCycle = () => {
      setDemoState('analyzing');
      timeout = setTimeout(() => {
        setDemoState('held');
        timeout = setTimeout(runCycle, 6000); // Hold result for 6s
      }, 7000); // Analyze for 7s
    };
    
    runCycle();
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav__left">
          <div className="landing-nav__logo">
            <Sparkles size={20} />
          </div>
          <span className="landing-nav__title">AI Code Explainer</span>
        </div>
        <div className="landing-nav__right">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="landing-nav__icon-link">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/vigneshselvan-v/" target="_blank" rel="noopener noreferrer" className="landing-nav__icon-link" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <button onClick={toggleTheme} className="landing-nav__icon-link" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="/#/app" className="landing-nav__cta">
            Launch App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="landing-hero__bg"></div>
        <div className="landing-hero__content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="landing-hero__title"
          >
            Paste code. Get taught, debugged, and understood — instantly.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="landing-hero__subtitle"
          >
            A unified dual-pane workspace acting as your programming teacher and automated debugger in one pass.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="landing-hero__actions"
          >
            <a href="/#/app" className="landing-btn landing-btn--primary">
              Launch the App <ArrowRight size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="landing-btn landing-btn--secondary">
              <Github size={18} /> View Source
            </a>
          </motion.div>
        </div>

        {/* Hero Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="landing-mockup"
        >
          <div className="landing-mockup__header">
            <div className="landing-mockup__dots">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="landing-mockup__body">
            <div className="landing-mockup__editor">
              <pre><code><span className="token keyword">def</span> <span className="token function">get_evens</span><span className="token punctuation">(</span>arr<span className="token punctuation">):</span>
    <span className="token keyword">return</span> <span className="token punctuation">[</span>n <span className="token keyword">for</span> n <span className="token keyword">in</span> arr <span className="token keyword">if</span> n <span className="token operator">%</span> <span className="token number">2</span> <span className="token operator">==</span> <span className="token number">0</span><span className="token punctuation">]</span>

<span className="token function">print</span><span className="token punctuation">(</span>get_evens<span className="token punctuation">([</span><span className="token number">1</span><span className="token punctuation">,</span> <span className="token number">2</span><span className="token punctuation">,</span> <span className="token number">3</span><span className="token punctuation">,</span> <span className="token number">4</span><span className="token punctuation">,</span> <span className="token number">5</span><span className="token punctuation">,</span> <span className="token number">6</span><span className="token punctuation">]))</span></code></pre>
            </div>
            <div className="landing-mockup__panel">
              <AnimatePresence mode="wait">
                {demoState === 'analyzing' ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="landing-mockup__state"
                  >
                    <div className="landing-mockup__analyzing">
                      <Sparkles size={16} className="landing-mockup__spinner" />
                      <span>Analyzing Python logic...</span>
                    </div>
                    <div className="landing-mockup__skeletons">
                      <div className="skeleton-bar" style={{ width: '85%' }}></div>
                      <div className="skeleton-bar" style={{ width: '65%' }}></div>
                      <div className="skeleton-bar" style={{ width: '90%' }}></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="held"
                    className="landing-mockup__state landing-mockup__state--result"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.4 } }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.08 } },
                      hidden: {}
                    }}
                  >
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="demo-overview">
                      <Sparkles size={16} className="demo-icon demo-icon--primary" />
                      <p>Filters even numbers using a list comprehension.</p>
                    </motion.div>
                    
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="demo-complexity">
                      <Cpu size={14} className="demo-icon" />
                      <span>O(n) time &middot; O(n) space</span>
                    </motion.div>
                    
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="demo-line-note">
                      <div className="demo-line-badge">Line 2</div>
                      <p>keeps only values where <code>n % 2 == 0</code></p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Problem -> Solution */}
      <section className="landing-strip">
        <div className="landing-strip__content">
          <p>
            There is a massive gap between <strong>"code that runs"</strong> and <strong>"code you actually understand."</strong><br/>
            Generic AI chats lose context. This tool gives you a structured, purpose-built dashboard for total code comprehension.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need to master your codebase</h2>
        
        <div className="landing-grid">
          <div className="landing-card">
            <div className="landing-card__icon"><Code2 size={24} /></div>
            <h3>Editor Intelligence</h3>
            <p>Real-time Prism.js syntax highlighting across 9 languages. Synchronized scroll sidebar keeps line numbers perfectly locked, even on massive files.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card__icon"><Terminal size={24} /></div>
            <h3>Teacher + Debugger Mode</h3>
            <p>A unified LLM pass that delivers plain-English explanations while actively hunting for syntax errors and edge cases. No need to toggle modes.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card__icon"><Bug size={24} /></div>
            <h3>Corrected Code Blocks</h3>
            <p>When bugs are found, the AI doesn't just explain them—it outputs a beautifully formatted, copy-pasteable block of corrected code.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card__icon"><Layout size={24} /></div>
            <h3>Line-by-Line Breakdown</h3>
            <p>A structured data table that dissects the logic line-by-line, placing explanations directly next to the actual code snippets for easy reading.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card__icon"><Search size={24} /></div>
            <h3>Output Prediction</h3>
            <p>The analyzer simulates code execution in the cloud and predicts exactly what the script will print or return when compiled.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card__icon"><Play size={24} /></div>
            <h3>Mermaid Flowcharts</h3>
            <p>Automatically generates dynamic, visual logic flowcharts using Mermaid.js with strict HTML node enforcement to prevent rendering crashes.</p>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="landing-arch">
        <div className="landing-arch__content">
          <h2 className="landing-section-title">Engineered for Reliability</h2>
          <p className="landing-arch__desc">
            Built with strict TypeScript and React 19. The backend API layer enforces structured JSON contracts from Google Gemini and OpenRouter LLMs, parsing reliable output straight into a resizable split-pane dashboard.
          </p>
          <div className="landing-arch__badges">
            <span className="landing-badge"><Cpu size={16}/> React 19</span>
            <span className="landing-badge"><Cpu size={16}/> Vite</span>
            <span className="landing-badge"><Cpu size={16}/> TypeScript</span>
            <span className="landing-badge"><Cpu size={16}/> Framer Motion</span>
            <span className="landing-badge"><Cpu size={16}/> Mermaid.js</span>
            <span className="landing-badge"><Cpu size={16}/> Prism.js</span>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="landing-audience">
        <div className="landing-audience__card">
          <h3>For Students & Beginners</h3>
          <p>Translate complex, intimidating syntax into plain English. Learn best practices and see exactly how your logic flows with auto-generated visual diagrams.</p>
        </div>
        <div className="landing-audience__card">
          <h3>For Professional Developers</h3>
          <p>Instantly debug legacy codebases, generate automated documentation, and get immediate Big-O time and space complexity analysis for your algorithms.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-cta">
        <h2>Stop guessing. Start understanding.</h2>
        <a href="/#/app" className="landing-btn landing-btn--primary landing-btn--lg">
          Launch the App <ArrowRight size={20} />
        </a>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Built as a portfolio showcase. Open source and ready to explore.</p>
        <div className="landing-footer__links">
          <a href="https://github.com/vigneshselvan-v" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/vigneshselvan-v/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
