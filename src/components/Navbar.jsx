import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleNavbar = () => setIsExpanded((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const navItems = ["Home", "Events", "About", "Team"];

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
    setIsExpanded(false);
    setIsMobileMenuOpen(false);
  };

  const navLinkClasses = `px-4 py-2 rounded-full text-white font-medium 
                          bg-[#853847] hover:bg-[#75303d] 
                          border-2 border-red-300 hover:border-red-400 
                          transition-colors duration-300 block text-lg`;

  const navVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.42, 0, 0.58, 1] } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: "0%", transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
    exit: { opacity: 0, y: "-100%", transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] } },
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Desktop Navbar */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
        className="hidden md:flex w-full items-center justify-center mt-2 font-sans bg-transparent overflow-hidden"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
          className={`flex items-center bg-[#a54657] overflow-hidden ${
            isExpanded ? "rounded-2xl px-2 " : "rounded-full p-1"
          }`}
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.nav
                className="flex overflow-hidden space-x-3 mr-4 p-2"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {["Home", "Events"].map((item) => (
                  <motion.div key={item} variants={navVariants} whileHover={{ scale: 1.1 }}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={(e) => handleLinkClick(e, item.toLowerCase())}
                      className={navLinkClasses}
                    >
                      {item}
                    </a>
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleNavbar}
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="p-2 rounded-full bg-black border-2 border-red-300 hover:border-red-400 shadow-md hover:shadow-red-400/50 transition-all duration-300"
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-8 h-8 -translate-x-1"
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.9, ease: [0.42, 0, 0.58, 1] }}
            />
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.nav
                className="flex overflow-hidden space-x-3 ml-4 p-2"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {["Team", "About"].map((item) => (
                  <motion.div key={item} variants={navVariants} whileHover={{ scale: 1.1 }}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={(e) => handleLinkClick(e, item.toLowerCase())}
                      className={navLinkClasses}
                    >
                      {item}
                    </a>
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Mobile Hamburger Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
        className="md:hidden fixed top-4 right-4 z-50"
      >
        <motion.button
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
          className="bg-[#a54657] p-3 rounded-full shadow-lg text-white"
        >
          <Menu size={28} />
        </motion.button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 bg-[#a54657] flex flex-col items-center justify-center z-40"
          >
            <button onClick={toggleMobileMenu} className="absolute top-6 right-6 text-white">
              <X size={32} />
            </button>
            <nav className="flex flex-col items-center space-y-8">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleLinkClick(e, item.toLowerCase())}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
                  className="text-3xl text-white font-bold"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
