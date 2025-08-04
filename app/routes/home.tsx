import type { Route } from "./+types/home";
import Navbar from '~/components/Navbar';
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart analyzer for your Dream Job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);


  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }
    loadResumes();
  }, []);

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

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
