"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Impact", href: "#impact" },
    { label: "Journey", href: "#timeline" },
    { label: "Stories", href: "#stories" },
    { label: "Expertise", href: "#skills" },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.logo}>
          <a href="#hero">SHEEBA SUKUMARAN</a>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a href="/resume/Sheeba Sukumaran_Resume Original.docx" download className={styles.resumeBtn}>Resume</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <button
            className={styles.closeBtn}
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
          <ul className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/resume/Sheeba Sukumaran_Resume Original.docx" download className={styles.mobileResumeBtn}>Resume</a>
        </div>
      )}
    </>
  );
}
