import React, { useState, useEffect, useRef } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation and focus for accessibility
  useEffect(() => {
    const menuContainer = menuContainerRef.current;
    if (!isMenuOpen || !menuContainer) return;

    const focusableElements = Array.from(
      menuContainer.querySelectorAll<HTMLElement>('a[href]')
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }

      // Trap focus
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Set focus to the first element when menu opens
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus to the button that opened the menu
      menuButtonRef.current?.focus();
    };
  }, [isMenuOpen]);


  const navLinks = [
    { href: '#home', label: 'الرئيسية' },
    { href: '#about', label: 'عني' },
    { href: '#skills', label: 'المهارات' },
    { href: '#portfolio', label: 'أعمالي' },
    { href: '#github', label: 'GitHub' },
    { href: '#video-generator', label: 'صانع الفيديو' },
    { href: '#blog', label: 'المدونة' },
    { href: '#contact', label: 'تواصل' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-slate-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" onClick={handleLinkClick} className="text-2xl font-black text-cyan-400 z-50 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h2.25l2.25-9 3.75 18 3.75-9 2.25 6h2.25" />
            </svg>
            <span>نبض <span className="text-white">AI</span></span>
          </a>
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-lg">
                {link.label}
              </a>
            ))}
          </nav>
          <button
            ref={menuButtonRef}
            className="md:hidden text-slate-300 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-slate-900/95 backdrop-blur-md transition-opacity duration-300 ease-in-out z-40 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <nav 
          id="mobile-menu"
          ref={menuContainerRef}
          className="w-full h-full flex flex-col items-center justify-center space-y-8"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="mobile-menu-title" className="sr-only">القائمة الرئيسية</h2>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`text-slate-300 hover:text-cyan-400 text-3xl font-bold transition-all duration-500 ease-out ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{ transitionDelay: `${isMenuOpen ? index * 100 + 100 : 0}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;