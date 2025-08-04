import { useEffect } from 'react';
import { usePuterStore } from '~/lib/puter';
import {useLocation, useNavigate} from 'react-router';

export const meta = () => [
  { title: 'Resumind | Auth' },
  { name: 'description', content: 'Log into Your Account' },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.includes('next=') ? location.search.split('next=')[1] : '/';
  const isLoggedOut = location.search.includes('logout=true');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          {isLoggedOut && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>You have been successfully logged out</span>
            </div>
          )}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <h2 className="text-gray-600">Login to continue your job hunting journey</h2>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : auth.isAuthenticated ? (
              <button className="logout-button text-3xl font-semibold w-[600px] max-md:w-full py-4 px-8" onClick={auth.signOut}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn}>
                <p>Log In</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
