"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PolicyLayout({ children, title, logoPath }) {
  const [activeSection, setActiveSection] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Extract headings from the content for table of contents
    const content = document.querySelector(".policy-content");
    if (content) {
      const headings = Array.from(content.querySelectorAll("h1, h2, h3"));
      const toc = headings.map((heading) => ({
        id:
          heading.id ||
          heading.innerText.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        text: heading.innerText,
        level: heading.tagName === "H1" ? 1 : heading.tagName === "H2" ? 2 : 3,
      }));

      // Add IDs to headings if they don't have one
      headings.forEach((heading) => {
        if (!heading.id) {
          heading.id = heading.innerText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
        }
      });

      setTableOfContents(toc);
    }
  }, [children]);

  // Handle scroll to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(
        document.querySelectorAll("h1[id], h2[id], h3[id]")
      );
      const scrollPosition = window.scrollY + 200;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.offsetTop <= scrollPosition) {
          setActiveSection(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 3%, white), white, color-mix(in srgb, var(--hotel-primary) 3%, white))' }}
    >
      {/* Hero Section */}
      <div 
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 8%, white), white)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-hotel-primary-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hotel Policies
          </motion.h1>
          <div className="w-24 h-1 bg-hotel-primary mx-auto mb-6 rounded-full"></div>
          <motion.p
            className="text-lg text-hotel-secondary-grey max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Please read our policies carefully to understand our practices
            regarding your interaction with our services.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          {tableOfContents.length > 0 && (
            <motion.div
              className="hidden lg:block lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <nav
                className="sticky top-24 space-y-1"
                aria-label="Table of Contents"
              >
                <p className="text-sm font-semibold text-hotel-primary-text mb-4">
                  Quick Navigation
                </p>
                <div className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                        ${
                          activeSection === item.id
                            ? "text-hotel-primary font-medium"
                            : "text-hotel-secondary-grey hover:text-hotel-primary-text"
                        }
                        ${
                          item.level === 2
                            ? "pl-6"
                            : item.level === 3
                            ? "pl-9"
                            : ""
                        }`}
                      style={activeSection === item.id ? { backgroundColor: 'color-mix(in srgb, var(--hotel-primary) 8%, white)' } : {}}
                      onMouseEnter={(e) => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--hotel-primary) 3%, white)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeSection !== item.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className={`policy-content mt-6 lg:mt-0 ${
              tableOfContents.length > 0 ? "lg:col-span-9" : "lg:col-span-12"
            } prose prose-lg max-w-none
              prose-headings:scroll-mt-32 prose-headings:font-bold
              prose-h1:text-3xl prose-h1:mb-8
              prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:leading-relaxed
              prose-a:no-underline hover:prose-a:underline
              prose-strong:font-semibold
              prose-ul:my-6 prose-li:my-2
              prose-hr:my-8`}
            style={{
              '--tw-prose-headings': 'var(--hotel-primary-text)',
              '--tw-prose-body': 'var(--hotel-secondary-grey)',
              '--tw-prose-links': 'var(--hotel-primary)',
              '--tw-prose-bold': 'var(--hotel-primary-text)',
              '--tw-prose-bullets': 'var(--hotel-primary)',
              '--tw-prose-hr': 'var(--hotel-secondary-light-grey)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Help Banner */}
      <div 
        className="border-t border-hotel-primary/20"
        style={{ backgroundColor: 'color-mix(in srgb, var(--hotel-primary) 8%, white)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-hotel-primary-text mb-4">
            Need Help?
          </h2>
          <p className="text-hotel-secondary-grey mb-6">
            If you have any questions about our policies, please do not hesitate
            to contact us.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-hotel-primary hover:bg-hotel-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-primary transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
