'use client';
import { useState } from 'react';
import { NAV_LINKS } from '@/lib/content';
import { Brand } from './brand';
import { ThemeToggle } from './theme-toggle';
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="button button-small nav-cta" href="#contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close ×' : 'Menu ☰'}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false);
          }}
        >
          {[...NAV_LINKS, { href: '#contact', label: 'Let’s talk ↗' }].map(
            (link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
