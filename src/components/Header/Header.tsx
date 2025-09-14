import { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LogoDark from '/src/assets/logo-dark2.png';
import LogoLight from '/src/assets/logo-light2.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { href: "/home", icon: "fas fa-home", text: "Home" },
    { href: "mailto:mateussampaio2710@gmail.com", icon: "fas fa-comment-dots", text: "Tell Me" }
  ];

  const gameOptions = [
    { href: "/games/snake", text: "Snake Game", icon: "fas fa-dragon" },
    { href: "/games/tictactoe", text: "Tic Tac Toe", icon: "fas fa-th" },
    { href: "/games/mario-runner", text: "Mario Runner", icon: "fas fa-running" }
  ];

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 dark:from-zinc-900 dark:to-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex-shrink-0">
            <a href="/" className="block">
              <img 
                src={theme === 'dark' ? LogoDark : LogoLight} 
                alt="Logo DevSampaio" 
                className="h-12 md:h-16 w-auto transition-transform duration-200 hover:scale-105"
              />
            </a>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-1 items-center">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-center px-4 py-3 text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                    style={{textDecoration: 'none'}}
                  >
                    <i className={`${item.icon} mr-2 text-blue-800 dark:text-white`} />
                    {item.text}
                  </a>
                </li>
              ))}
              
              <li>
                <div className="flex items-center px-4 py-3">
                  <i className={`fas fa-moon mr-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-blue-700'
                  }`} />
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      theme === 'dark' ? 'bg-yellow-400' : 'bg-blue-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <i className={`fas fa-sun ml-3 ${
                    theme === 'dark' ? 'text-yellow-300' : 'text-neutral-400'
                  }`} />
                </div>
              </li>
              
              {/* Games Dropdown */}
              <li className="relative"
                  onMouseEnter={() => setIsGamesDropdownOpen(true)}
                  onMouseLeave={() => setIsGamesDropdownOpen(false)}
              >
                <div className="flex items-center px-4 py-3 text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 cursor-pointer">
                  <i className="fas fa-gamepad mr-2 text-blue-800 dark:text-white" />
                  Games
                  <i className={`fas fa-chevron-down ml-2 text-sm text-blue-800 dark:text-neutral-200 transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-800 border border-blue-200 dark:border-neutral-700 rounded-lg shadow-xl transition-all duration-200 z-50 ${isGamesDropdownOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'}`}>
                  <ul className="py-2">
                    {gameOptions.map((game, index) => (
                      <li key={index}>
                        <a 
                          href={game.href}
                          className="flex items-center px-4 py-3 text-blue-800 dark:text-yellow-300 hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all duration-200"
                          style={{textDecoration: 'none'}}
                        >
                          <i className={`${game.icon} mr-3 text-blue-600 dark:text-yellow-300`} />
                          {game.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-blue-800 dark:text-yellow-100 hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <nav className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href}
                  className="flex items-center px-4 py-3 text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                  style={{textDecoration: 'none'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${item.icon} mr-3 text-blue-800 dark:text-white`} />
                  {item.text}
                </a>
              </li>
            ))}
            
            <li>
              <div className="flex items-center justify-between px-4 py-3 w-full">
                <div className="flex items-center">
                  <i className={`fas fa-moon mr-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-blue-700'
                  }`} />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-blue-800'
                  }`}>
                    Theme
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                      theme === 'dark' ? 'bg-yellow-400' : 'bg-blue-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <i className={`fas fa-sun ml-3 ${
                    theme === 'dark' ? 'text-yellow-300' : 'text-neutral-400'
                  }`} />
                </div>
              </div>
            </li>
            
            <li>
              <div 
                className="flex items-center px-4 py-3 text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 cursor-pointer"
                onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
              >
                <i className="fas fa-gamepad mr-3 text-blue-800 dark:text-white" />
                Games
                <i className={`fas fa-chevron-down ml-auto text-sm transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${isGamesDropdownOpen ? 'max-h-48' : 'max-h-0'}`}>
                <ul className="ml-6 mt-2 space-y-1">
                  {gameOptions.map((game, index) => (
                    <li key={index}>
                      <a 
                        href={game.href}
                        className="flex items-center px-4 py-2 text-blue-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-yellow-200 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                        style={{textDecoration: 'none'}}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className={`${game.icon} mr-3 text-blue-600 dark:text-yellow-400 text-sm`} />
                        {game.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;