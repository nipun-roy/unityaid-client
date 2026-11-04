'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Mail, MapPin, Phone, Github, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-600/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-base-content">
                Unity<span className="text-green-600">Aid</span>
              </span>
            </Link>
            
            <p className="text-sm text-base-content/70 leading-relaxed max-w-sm">
              UnityAid connects compassionate citizens, volunteers, and grassroots community organizers to create measurable social impact across Bangladesh.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* New X (Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full bg-base-300 hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors text-base-content/80"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-base-300 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-base-content/80"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-base-300 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-colors text-base-content/80"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-base-300 hover:bg-neutral hover:text-white flex items-center justify-center transition-colors text-base-content/80"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-base-content">Platform</h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-green-600 transition-colors">Upcoming Events</Link></li>
              <li><Link href="/events/create" className="hover:text-green-600 transition-colors">Host an Event</Link></li>
              <li><Link href="/events/joined" className="hover:text-green-600 transition-colors">Volunteer Dashboard</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-base-content">Key Initiatives</h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li><Link href="/events?category=Donation" className="hover:text-green-600 transition-colors">Winter Clothes & Food</Link></li>
              <li><Link href="/events?category=Cleanup" className="hover:text-green-600 transition-colors">River & City Cleanup</Link></li>
              <li><Link href="/events?category=Plantation" className="hover:text-green-600 transition-colors">Tree Plantation</Link></li>
              <li><Link href="/events?category=Healthcare" className="hover:text-green-600 transition-colors">Free Health Camps</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-base-content">Get In Touch</h4>
            <ul className="space-y-2.5 text-sm text-base-content/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span>Mirpur 10, Dhaka 1216, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-green-600 shrink-0" />
                <span>support@unityaid.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-600 shrink-0" />
                <span>+880 1712 345678</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
          <p>© {new Date().getFullYear()} UnityAid Community Platform. Dedicated to social welfare and public development.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-green-600 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-green-600 transition-colors">Community Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

