import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/devsampaio',
      icon: 'fab fa-linkedin-in',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/devsampaios',
      icon: 'fab fa-github',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Email',
      url: 'mailto:mateussampaio2710@gmail.com',
      icon: 'fas fa-envelope',
      color: 'hover:text-red-400'
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-blue-50 via-white to-blue-50 dark:from-neutral-900 dark:via-zinc-900 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6 sm:space-x-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative bg-gradient-to-br from-blue-100/60 to-blue-200/60 dark:from-neutral-800/60 dark:to-neutral-900/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/40 dark:border-neutral-700/40 hover:border-blue-400/60 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-400/20 ${social.color}`}
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-2xl sm:text-3xl text-blue-800 dark:text-yellow-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-yellow-200`} />
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-neutral-700 to-transparent"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-blue-600 dark:text-neutral-400 text-sm sm:text-base">
              &copy; {currentYear} <span className="text-blue-700 dark:text-yellow-400 font-medium">DevSampaio</span>. All rights reserved.
            </p>
            <p className="text-blue-500 dark:text-neutral-500 text-xs sm:text-sm">
              Made in Minas Gerais, Brazil
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;