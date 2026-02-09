import { useState, useCallback } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      if (prev) {
        setIsGamesDropdownOpen(false);
        setIsProjectsDropdownOpen(false);
      }
      return !prev;
    });
  }, []);

  const navigationItems = [{ href: '/', icon: 'fas fa-home', text: 'Home' }];

  const projectsOptions = [
    {
      href: 'https://sistema-marmoraria-carrara.web.app/',
      text: 'StoneProd',
      logo: '/assets/stoneprod.ico',
      icon: 'fas fa-briefcase',
    },
  ];

  const gameOptions = [
    { href: '/games/snake', text: 'Snake Game', icon: 'fas fa-dragon' },
    { href: '/games/tictactoe', text: 'Tic Tac Toe', icon: 'fas fa-th' },
    { href: '/games/mario-runner', text: 'Mario Runner', icon: 'fas fa-running' },
  ];

  return (
    <header className='navBar'>
      <div className='container navInner'>
        <a href='/' className='navBrand' aria-label='DevSampaio home'>
          <img src='/assets/logo-light2.png' alt='DevSampaio logo' loading='lazy' />
        </a>

        <nav className='navLinks' aria-label='Primary'>
          {navigationItems.map((item, index) => (
            <a key={index} href={item.href} className='navLink'>
              <i className={item.icon} aria-hidden='true' />
              {item.text}
            </a>
          ))}

          <div
            className='navDropdown'
            onMouseEnter={() => setIsProjectsDropdownOpen(true)}
            onMouseLeave={() => setIsProjectsDropdownOpen(false)}
            onFocus={() => setIsProjectsDropdownOpen(true)}
            onBlur={() => setIsProjectsDropdownOpen(false)}
          >
            <button className={`navLink ${isProjectsDropdownOpen ? 'isOpen' : ''}`} aria-expanded={isProjectsDropdownOpen}>
              <i className='fas fa-briefcase' aria-hidden='true' />
              Projects
              <i className='fas fa-chevron-down' aria-hidden='true' />
            </button>
            <div
              className='navDropdownMenu'
              style={
                isProjectsDropdownOpen ? { visibility: 'visible', opacity: 1, transform: 'translateY(0)' } : undefined
              }
            >
              {projectsOptions.map((project, index) => (
                <a key={index} href={project.href} className='navDropdownItem'>
                  {project.logo ? (
                    <img src={project.logo} alt={`${project.text} logo`} width={20} height={20} />
                  ) : (
                    <i className={project.icon} aria-hidden='true' />
                  )}
                  {project.text}
                </a>
              ))}
            </div>
          </div>

          <div
            className='navDropdown'
            onMouseEnter={() => setIsGamesDropdownOpen(true)}
            onMouseLeave={() => setIsGamesDropdownOpen(false)}
            onFocus={() => setIsGamesDropdownOpen(true)}
            onBlur={() => setIsGamesDropdownOpen(false)}
          >
            <button className={`navLink ${isGamesDropdownOpen ? 'isOpen' : ''}`} aria-expanded={isGamesDropdownOpen}>
              <i className='fas fa-gamepad' aria-hidden='true' />
              Games
              <i className='fas fa-chevron-down' aria-hidden='true' />
            </button>
            <div
              className='navDropdownMenu'
              style={
                isGamesDropdownOpen ? { visibility: 'visible', opacity: 1, transform: 'translateY(0)' } : undefined
              }
            >
              {gameOptions.map((game, index) => (
                <a key={index} href={game.href} className='navDropdownItem'>
                  <i className={game.icon} aria-hidden='true' />
                  {game.text}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <button onClick={toggleMobileMenu} className='mobileNavToggle' aria-label='Toggle menu'>
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} aria-hidden='true' />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className='container mobileNavPanel'>
          {navigationItems.map((item, index) => (
            <a key={index} href={item.href} className='navLink' onClick={() => setIsMobileMenuOpen(false)}>
              <i className={item.icon} aria-hidden='true' />
              {item.text}
            </a>
          ))}

          <div>
            <button
              className={`navLink ${isProjectsDropdownOpen ? 'isOpen' : ''}`}
              onClick={() => setIsProjectsDropdownOpen((prev) => !prev)}
              aria-expanded={isProjectsDropdownOpen}
            >
              <i className='fas fa-briefcase' aria-hidden='true' />
              Projects
              <i className='fas fa-chevron-down' aria-hidden='true' />
            </button>
            {isProjectsDropdownOpen && (
              <div className='mobileNavPanel'>
                {projectsOptions.map((project, index) => (
                  <a
                    key={index}
                    href={project.href}
                    target='_blank'
                    className='navDropdownItem'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img src={project.logo} alt={`${project.text} logo`} width={18} height={18} />
                    {project.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              className={`navLink ${isGamesDropdownOpen ? 'isOpen' : ''}`}
              onClick={() => setIsGamesDropdownOpen((prev) => !prev)}
              aria-expanded={isGamesDropdownOpen}
            >
              <i className='fas fa-gamepad' aria-hidden='true' />
              Games
              <i className='fas fa-chevron-down' aria-hidden='true' />
            </button>
            {isGamesDropdownOpen && (
              <div className='mobileNavPanel'>
                {gameOptions.map((game, index) => (
                  <a
                    key={index}
                    href={game.href}
                    className='navDropdownItem'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className={game.icon} aria-hidden='true' />
                    {game.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
