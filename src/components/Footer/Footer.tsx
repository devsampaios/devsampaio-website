const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/devsampaio',
      icon: 'fab fa-linkedin-in'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/devsampaios',
      icon: 'fab fa-github'
    },
    {
      name: 'Email',
      url: 'mailto:mateussampaio2710@gmail.com',
      icon: 'fas fa-envelope'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/5531973003237',
      icon: 'fab fa-whatsapp'
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footerLinks" aria-label="Social links">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footerLink"
              aria-label={social.name}
            >
              <i className={social.icon} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="footerMeta">
          <div>&copy; {currentYear} DevSampaio. All rights reserved.</div>
          <div className="muted">Made in Minas Gerais, Brazil</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
