import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-[#d91e18] text-white pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-3">Figbricks</h3>
            <p className="text-xs leading-relaxed text-red-100">
              Providing collectible minifigs of fictional characters.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                📷
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                💬
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-base font-semibold mb-3">Contact Us</h4>
            <div className="space-y-2 text-xs text-red-100">
              <a href="mailto:figbrickss@gmail.com" className="flex items-center gap-2 hover:underline">
                <Mail className="w-3.5 h-3.5" />
                <span>figbrickss@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-red-100">
              <li>
                <Link href="/policy" className="hover:underline">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-base font-semibold mb-3">Useful Links</h4>
            <ul className="space-y-2 text-xs text-red-100">
              <li>
                <Link href="/why-shop" className="hover:underline">
                  Why Shop Online with Us
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="hover:underline">
                  Online Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  After Sales Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-red-500/50 mt-10 pt-4 text-center text-xs text-red-200">
          Copyright © 2026 www.figbricks.com
        </div>
      </footer>

      {/* Floating Red Chat Widget Button matching screenshot bottom-right */}
      <a
        href="https://wa.me"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#d91e18] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition z-40"
        aria-label="Contact via WhatsApp / Live Chat"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
      </a>
    </>
  );
}
