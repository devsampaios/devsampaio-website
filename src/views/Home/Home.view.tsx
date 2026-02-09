const HomeView = () => {
  const badges = ["Full-stack", "JavaScript", "React", "Node.js", "C#", ".NET"];
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
    { logo: "/assets/home/Electron.png", name: "Electron" },
    { logo: "/assets/home/PHP.png", name: "PHP" },
    { logo: "/assets/home/dotnet.png", name: ".NET" },
    { logo: "/assets/home/CSharp.png", name: "C#" }
  ];

  const projects = [
    {
      title: "StoneProd",
      description: "ERP suite for stone shops with production, inventory, and billing in real time.",
      stack: ["React", "Node.js", "Firebase"],
      link: "https://sistema-marmoraria-carrara.web.app/",
      status: "In production"
    },
    {
      title: "SamPay",
      description: "Digital wallet with payment integrations and UX focused on clarity and safety.",
      stack: ["React", "Node.js", "Firebase"],
      link: "https://github.com/devsampaios",
      status: "In development"
    },
    {
      title: "DevSampaio",
      description: "Personal portfolio with online minigames, skills grid, and a responsive experience.",
      stack: ["React", "Games", "UI Clean"],
      link: "/",
      status: "Live"
    }
  ];

  return (
    <main className="page">
      <section className="section hero" id="home">
        <div className="container heroLayout">
          <div className="heroContent">
            <p className="eyebrow">Mateus Sampaio · Full-stack</p>
            <h1 className="heroTitle">
              Building secure, solid products with clean experiences.
            </h1>
            <p className="heroSubtitle">
              Developer from Minas Gerais with 2+ years of experience creating fast, clear interfaces and digital products that solve real problems.
            </p>

            <div className="badgeRow">
              {badges.map((badge, index) => (
                <span key={index} className="chip soft">{badge}</span>
              ))}
            </div>
          </div>

          <div className="heroMedia">
            <div className="heroAvatar">
              <img 
                src="/assets/home/imagemMateus.jpeg" 
                alt="Mateus Sampaio" 
                loading="lazy"
              />
            </div>

            
          </div>
        </div>
      </section>

      <section className="section soft" id="skills">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow">Skills</p>
            <h2 className="sectionTitle">Core stack to ship fast</h2>
            <p className="sectionSubtitle">
              Tools and technologies I use daily to build scalable products and consistent interfaces.
            </p>
          </div>

          <div className="skillsShell">
            <div className="skillsScroller">
              <div className="skillsGrid">
                {skills.map((skill, index) => (
                  <div key={index} className="skillCard">
                    <img 
                      src={skill.logo} 
                      alt={skill.name} 
                      loading="lazy"
                    />
                    <span className="skillName">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow">Featured projects</p>
            <h2 className="sectionTitle">Products that reflect how I build</h2>
            <p className="sectionSubtitle">
              A selection of projects focused on usability, performance, and robust integrations.
            </p>
          </div>

          <div className="projectsGrid">
            {projects.map((project, index) => (
              <article key={index} className="projectCard">
                <div className="projectHeader">
                  <h3 className="projectTitle">{project.title}</h3>
                  <span className="badge info">{project.status}</span>
                </div>
                <p className="projectDesc">{project.description}</p>
                <div className="projectMeta">
                  {project.stack.map((tag, tagIndex) => (
                    <span key={tagIndex} className="badge">{tag}</span>
                  ))}
                </div>
                <div className="projectActions">
                  <a 
                    className="btn btnGhost" 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    View project
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeView;
