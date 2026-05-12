import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import "./dashboardfooter.css"; // Import the CSS file directly
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="content">
          <div className="links">
            <span className="copyright link">
               © {new Date().getFullYear()} <Link href="" className="text-hotel-primary">RG Golden Palace</Link>
            </span>
            <Link href="/privacy-policy">
              <p className="link">Privacy Policy</p>
            </Link>
            <Link href="/terms-and-conditions">
              <p className="link">Term and conditions</p>
            </Link>
            <Link href="/contact">
              <p className="link">Contact</p>
            </Link>
            <Link
              href="https://mntfuture.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-hotel-primary"
            >
              Developed by MnT
            </Link>
          </div>
          <nav className="socialLinks" aria-label="Social media links">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaXTwitter />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
