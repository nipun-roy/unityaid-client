'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Props {
  redirectUrl?: string;
}

export default function GoogleSignInButton({ redirectUrl = '/events' }: Props) {
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const { handleGoogleCredential, googleLogin } = useAuth();
  const router = useRouter();
  const [rendered, setRendered] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const onCredentialSuccess = useCallback(
    async (credential: string) => {
      try {
        setSigningIn(true);
        const success = await handleGoogleCredential(credential);
        if (success) {
          router.push(redirectUrl);
        }
      } finally {
        setSigningIn(false);
      }
    },
    [handleGoogleCredential, redirectUrl, router]
  );

  useEffect(() => {
    let isMounted = true;
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '987371447787-v2posuctid61ijjqndmgoq35215qoqc6.apps.googleusercontent.com';

    const renderOfficialButton = () => {
      const google = typeof window !== 'undefined' ? (window as any).google : null;
      if (!google?.accounts?.id || !btnContainerRef.current) return false;

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response?.credential && isMounted) {
              await onCredentialSuccess(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        btnContainerRef.current.innerHTML = '';
        google.accounts.id.renderButton(btnContainerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        });

        // Also prompt One Tap if available
        try {
          google.accounts.id.prompt();
        } catch (_) {}

        if (isMounted) {
          setRendered(true);
        }
        return true;
      } catch (err) {
        console.error('Error rendering Google button:', err);
        return false;
      }
    };

    // 1. Try immediate render if script already loaded
    if (renderOfficialButton()) {
      return () => {
        isMounted = false;
      };
    }

    // 2. Ensure script is injected dynamically
    const SCRIPT_ID = 'google-gsi-client-script';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.src = 'https://accounts.google.com/gsi/client';
      scriptTag.async = true;
      scriptTag.defer = true;
      document.body.appendChild(scriptTag);
    }

    // 3. Poll briefly until window.google.accounts.id is available
    const interval = setInterval(() => {
      if (renderOfficialButton()) {
        clearInterval(interval);
      }
    }, 150);

    const timer = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onCredentialSuccess]);

  const handleCustomClick = async () => {
    setSigningIn(true);
    try {
      const success = await googleLogin();
      if (success) {
        router.push(redirectUrl);
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[44px]">
      {signingIn ? (
        <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-base-content/70">
          <span className="loading loading-spinner loading-sm text-green-600"></span>
          <span>Signing in with Google...</span>
        </div>
      ) : (
        <>
          {/* Official Google-rendered button (cannot be blocked by popup blocker) */}
          <div
            ref={btnContainerRef}
            className={`w-full flex justify-center ${rendered ? 'block' : 'hidden'}`}
          />

          {/* Fallback button shown while Google SDK loads or if blocked */}
          {!rendered && (
            <button
              type="button"
              onClick={handleCustomClick}
              className="w-full max-w-[320px] btn bg-base-100 hover:bg-base-200 active:bg-base-300 border border-base-300 text-base-content rounded-xl h-11 text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
