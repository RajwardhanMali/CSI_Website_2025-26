import { useState, useEffect } from 'react';

const Footer = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const checkScroll = () => {
      const elements = document.querySelectorAll('[data-scroll]');
      const windowHeight = window.innerHeight;
      const newVisible = new Set(visibleElements);

      elements.forEach((element, index) => {
        const position = element.getBoundingClientRect().top;
        if (position < windowHeight - 100) {
          newVisible.add(index);
        }
      });

      setVisibleElements(newVisible);
    };

    const handleLoad = () => checkScroll();
    const handleScroll = () => checkScroll();

    window.addEventListener('load', handleLoad);
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    checkScroll();

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleElements]);

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Watermark Background */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-center max-w-[90%]">
        <img 
          src="/logo.png" 
          alt="CSI Logo" 
          className="block mx-auto mb-4 h-15 lg:h-25 max-w-full opacity-30"
        />
        <div className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#a54657] to-[#ff6b7d] opacity-20 bg-clip-text text-transparent break-words">
          Computer Society of India
          <div className="text-lg sm:text-2xl lg:text-3xl font-medium mt-4">
            Building What Matters
          </div>
        </div>
      </div>

      <div className="relative z-10 px-8 py-12">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-around gap-6 lg:gap-24">
            {/* About Section */}
            <div 
              data-scroll 
              className={`flex-1 min-w-[300px] mb-8 px-4 transition-all duration-700 ease-out ${
                visibleElements.has(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-[#a54657] text-2xl overflow-hidden font-semibold mb-6 relative inline-block">
                About CSI
                <span className="absolute left-0 -bottom-2 w-12 h-0.5 bg-amber-700 rounded-full"></span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                The Computer Society of India is a body of computer professionals that aims to advance the theory and practice of computer science and technology.
              </p>
            </div>

            {/* Contact Section */}
            <div 
              data-scroll 
              className={`flex-1 min-w-[300px] mb-8 px-4 transition-all duration-700 ease-out delay-100 ${
                visibleElements.has(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-[#a54657] text-2xl overflow-hidden font-semibold mb-6 relative inline-block">
                Contact Us
                <span className="absolute left-0 -bottom-2 w-12 h-0.5 bg-amber-700 rounded-full"></span>
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start transition-transform duration-300 hover:translate-x-1">
                  <i className="fas fa-envelope text-[#a54657] mr-3 mt-1.5 text-lg"></i>
                  <span>csivitpunechapter@vit.edu</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-1">
                  <i className="fas fa-map-marker-alt text-[#a54657] mr-3 mt-1.5 text-lg"></i>
                  <span>
                    Vishwakarma Institute of Technology,<br />
                    Upper Indira Nagar, Bibwewadi,<br />
                    Pune, India 411037
                  </span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-1">
                  <i className="fas fa-phone-alt text-[#a54657] mr-3 mt-1.5 text-lg"></i>
                  <span>+91 XXXXXXXXXX</span>
                </li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div 
              data-scroll 
              className={`flex-1 min-w-[300px] mb-8 px-4 transition-all duration-700 ease-out delay-200 ${
                visibleElements.has(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'   
              }`}
            >
              <h3 className="text-[#a54657] text-2xl overflow-hidden font-semibold mb-6 relative inline-block">
                Quick Links
                <span className="absolute left-0 -bottom-2 w-12 h-0.5 bg-[#a54657] rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {['Upcoming Events', 'Past Events', 'Membership', 'Resources', 'Team'].map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-[#a54657] transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links and Collaborate Button */}
          <div 
            data-scroll 
            className={`flex flex-col lg:flex-row justify-between items-center mt-12 gap-6 transition-all duration-700 ease-out delay-100 ${
              visibleElements.has(3) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Social Links */}
            <div className="flex gap-5 lg:ml-36">
              {[
                { icon: 'fab fa-instagram', href: '#' },
                { icon: 'fab fa-linkedin-in', href: '#' },
                { icon: 'fab fa-github', href: '#' },
                { icon: 'fab fa-youtube', href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-100 text-xl transition-all duration-400  hover:shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a54657] to-[#a54657] opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"></div>
                  <i className={`${social.icon} relative z-10`}></i>
                </a>
              ))}
            </div>

            {/* Collaborate Button */}
            {/* <a
              href="https://example.com/collaborate"
              className="bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300  hover:shadow-lg hover:shadow-orange-600/60 relative overflow-hidden group lg:mr-32"
            >
              <div className="absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 transition-all duration-600 group-hover:left-full"></div>
              Let's Collaborate!
            </a> */}
          </div>

          {/* Footer Bottom */}
          <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="italic text-gray-200 text-lg font-medium mb-4">
              Made by CSI Web Development Team
            </p>
            <p className="text-gray-300 text-sm">
              © {currentYear} Computer Society of India VIT Pune Chapter. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </footer>
  );
};

export default Footer;