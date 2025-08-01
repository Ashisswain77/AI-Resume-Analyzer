import { Link } from 'react-router';
import ScoreCircle from '../components/ScoreCircle';

const ResumeCard = ({
                      resume: { id, companyName, jobTitle, feedback, imagePath },
                    }: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 flex flex-col gap-4 bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
    >
      {/* Header row with company + score */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* Resume Image */}
      <div className="gradient-border overflow-hidden rounded-md">
        <img
          src={imagePath}
          alt="resume"
          className="w-full h-[380px] object-cover object-top"
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
