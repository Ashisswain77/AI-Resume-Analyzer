import type { Route } from "./+types/home";
import Navbar from '~/components/Navbar';
import { resumes } from "../../constants";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart analyzer for your Dream Job" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Track Your Applications and Resume Ratings
          </h1>
          <h2 className="text-lg text-gray-600">
            Review your Submissions and check AI-Powered feedback
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-section grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
