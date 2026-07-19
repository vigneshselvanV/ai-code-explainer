import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Code2 } from 'lucide-react';
import type { Theme } from '../../types';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar = memo(function Navbar({
  theme,
  onToggleTheme,
}: NavbarProps) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__left">


        <div className="navbar__brand">
          <div className="navbar__logo" aria-hidden="true">
            <Code2 size={22} />
          </div>
          <h1 className="navbar__title">AI Code Explainer</h1>
        </div>
      </div>

      <div className="navbar__right">
        <button
          onClick={onToggleTheme}
          className="navbar__icon-button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
  );
});
