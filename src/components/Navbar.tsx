'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { 
  HeartHandshake, 
  Calendar, 
  PlusCircle, 
  ListOrdered, 
  CheckCircle2, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-base-content group-hover:text-green-600 transition-colors">
                Unity<span className="text-green-600">Aid</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-base-content/60 -mt-1">
                Community Impact
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors hover:text-green-600 ${
                isActive('/') ? 'text-green-600 font-bold' : 'text-base-content/80'
              }`}
            >
              Home
            </Link>

            <Link 
              href="/events" 
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-green-600 ${
                isActive('/events') ? 'text-green-600 font-bold' : 'text-base-content/80'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </Link>
          </nav>

          {/* Right Controls: Theme Toggle & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                {/* Profile Picture with hover display name */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  title={user.name}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-base-200 transition-all focus:outline-none ring-2 ring-green-500/20"
                >
                  <img
                    src={user.photoURL || '/images/common/default-avatar.jpg'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-green-600"
                  />
                  <span className="text-sm font-medium text-base-content max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-base-content/60" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-base-100 shadow-xl border border-base-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-base-200">
                      <p className="text-sm font-bold text-base-content truncate">{user.name}</p>
                      <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/events/create"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-base-content/80 hover:bg-green-500/10 hover:text-green-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <PlusCircle className="w-4 h-4 text-green-600" />
                      Create Event
                    </Link>

                    <Link
                      href="/events/manage"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-base-content/80 hover:bg-green-500/10 hover:text-green-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ListOrdered className="w-4 h-4 text-blue-500" />
                      Manage Events
                    </Link>

                    <Link
                      href="/events/joined"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-base-content/80 hover:bg-green-500/10 hover:text-green-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Joined Events
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-base-content/80 hover:bg-green-500/10 hover:text-green-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-purple-500" />
                      My Profile
                    </Link>

                    <div className="border-t border-base-200 my-1"></div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn btn-sm btn-ghost font-semibold text-base-content hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none shadow-sm rounded-lg"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm btn-circle text-base-content"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-base-200 bg-base-100 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-base-content hover:text-green-600"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-base-content hover:text-green-600"
          >
            Upcoming Events
          </Link>

          {user ? (
            <div className="pt-2 border-t border-base-200 space-y-2">
              <div className="flex items-center gap-3 py-2">
                <img
                  src={user.photoURL || '/images/common/default-avatar.jpg'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-green-600"
                />
                <div>
                  <p className="text-sm font-bold text-base-content">{user.name}</p>
                  <p className="text-xs text-base-content/60">{user.email}</p>
                </div>
              </div>

              <Link
                href="/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-base-content/80 hover:text-green-600"
              >
                <PlusCircle className="w-4 h-4 text-green-600" />
                Create Event
              </Link>
              <Link
                href="/events/manage"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-base-content/80 hover:text-green-600"
              >
                <ListOrdered className="w-4 h-4 text-blue-500" />
                Manage Events
              </Link>
              <Link
                href="/events/joined"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-base-content/80 hover:text-green-600"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Joined Events
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-base-content/80 hover:text-green-600"
              >
                <UserIcon className="w-4 h-4 text-purple-500" />
                My Profile
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 py-2.5 text-sm font-medium text-rose-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-base-200 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-sm bg-base-100 hover:bg-base-200 border border-base-300 text-base-content"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-sm bg-green-600 text-white border-none"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

