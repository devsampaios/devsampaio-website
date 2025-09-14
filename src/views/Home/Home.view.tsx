import { Separator } from '@moreirapontocom/npmhelpers';

const HomeView = () => {
  const skills = [
    { logo: "/assets/home/css-3.png", name: "CSS3" },
    { logo: "/assets/home/html-5.png", name: "HTML5" },
    { logo: "/assets/home/js.png", name: "JavaScript" },
    { logo: "/assets/home/TypeScript.png", name: "TypeScript" },
    { logo: "/assets/home/NPM.png", name: "NPM" },
    { logo: "/assets/home/Node.js.png", name: "Node.js" },
    { logo: "/assets/home/React.png", name: "React" },
    { logo: "/assets/home/React Bootstrap.png", name: "React Bootstrap" },
    { logo: "/assets/home/bootstrap.png", name: "Bootstrap" },
    { logo: "/assets/home/Tailwind CSS.png", name: "Tailwind CSS" },
    { logo: "/assets/home/Git.png", name: "Git" },
    { logo: "/assets/home/C.png", name: "C" },
    { logo: "/assets/home/PHP.png", name: "PHP" },
    { logo: "/assets/home/Python.png", name: "Python" }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-900 dark:via-neutral-900 dark:to-zinc-900">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 dark:via-yellow-400/10 to-transparent"></div>
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: window.matchMedia('(prefers-color-scheme: dark)').matches || document.documentElement.classList.contains('dark') ? `radial-gradient(circle at 25% 25%, rgba(243, 223, 154, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(243, 223, 154, 0.05) 0%, transparent 50%)` : `radial-gradient(circle at 25% 25%, rgba(243, 223, 154, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(243, 223, 154, 0.1) 0%, transparent 50%)`
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex-1 flex flex-col items-center lg:items-center text-center lg:text-left mb-12 lg:mb-0 lg:pr-12">
          <div className="mb-8 lg:mb-12">
            <div className="relative group">
              <img 
                src='/assets/home/imagemMateus.jpeg' 
                className="rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-cover shadow-2xl border-4 border-yellow-400/40 group-hover:border-yellow-400/70 transition-all duration-500 group-hover:scale-105" 
                alt="Imagem do Mateus" 
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 via-transparent to-yellow-400/10 group-hover:from-yellow-400/30 group-hover:to-yellow-400/20 transition-all duration-500"></div>
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 blur-xl group-hover:from-yellow-400/20 group-hover:to-yellow-400/20 transition-all duration-500"></div>
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-900 dark:text-white mb-6 leading-tight">
              Welcome to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 transition-all duration-300">
                DevSampaio's
              </span> Website!
            </h1>
            
            <p className="text-blue-700 dark:text-neutral-300 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8">
              I am Mateus, a Full-Stack Developer from Minas Gerais who is passionate about programming. Explore more about my projects and skills!
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center lg:items-end w-full max-w-2xl">
          <div className="w-full">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-800 dark:text-yellow-100 mb-8 text-center lg:text-right">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Skills
              </span>
            </h2>
            <Separator size={30} />

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
              {skills.map((skill, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-gradient-to-br from-blue-50/60 to-blue-100/60 dark:from-neutral-800/60 dark:to-neutral-900/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200/40 dark:border-neutral-700/40 group-hover:border-blue-400/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-400/20 min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center">
                    <img 
                      src={skill.logo} 
                      className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 transition-all duration-300 filter drop-shadow-lg group-hover:drop-shadow-2xl mb-3" 
                      alt={skill.name} 
                    />
                    
                    <span className="text-blue-700 dark:text-yellow-100 text-xs sm:text-sm font-medium text-center leading-tight group-hover:text-blue-600 dark:group-hover:text-yellow-300 transition-colors duration-200">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;