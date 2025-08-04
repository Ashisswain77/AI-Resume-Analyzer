
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface CategoryData {
  score: number;
  tips: Tip[];
}

interface Feedback {
  toneAndStyle: CategoryData;
  content: CategoryData;
  structure: CategoryData;
  skills: CategoryData;
  overallScore: number;
  ATS: {
    score: number;
    tips: any[];
  };
}

interface DetailsProps {
  feedback: Feedback;
}

// ScoreBadge component for displaying scores
const ScoreBadge = ({ score }: { score: number }) => {
  // Determine background color and icon based on score
  const bgColor = score > 69 
    ? "bg-green-100" 
    : score > 39 
      ? "bg-yellow-100" 
      : "bg-red-100";
  
  const textColor = score > 69 
    ? "text-green-600" 
    : score > 39 
      ? "text-yellow-600" 
      : "text-red-600";

  return (
    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full", bgColor)}>
      {score > 69 ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4 h-4 text-green-600" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn("w-4 h-4", textColor)} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      <span className={cn("text-base font-medium", textColor)}>{score}/100</span>
    </div>
  );
};

// CategoryHeader component for section headers
const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-xl font-medium">{title}</h3>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

// CategoryContent component for displaying tips
const CategoryContent = ({ tips }: { tips: Tip[] }) => {
  // Separate tips by type
  const goodTips = tips.filter(tip => tip.type === "good");
  const improveTips = tips.filter(tip => tip.type === "improve");

  return (
    <div className="space-y-4">
      {/* Tips grid */}
      <div className="grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            {tip.type === "good" ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-green-600 mt-0.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-yellow-600 mt-0.5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            <p className={cn(
              "text-base", 
              tip.type === "good" ? "text-green-700" : "text-yellow-700"
            )}>
              {tip.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Explanation boxes */}
      <div className="space-y-3">
        {goodTips.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-base font-medium text-green-800 mb-2">What You're Doing Well</h4>
            <div className="space-y-2">
              {goodTips.map((tip, index) => (
                <div key={index} className="text-base text-green-700">
                  <p className="font-medium">{tip.tip}</p>
                  <p className="text-green-600">{tip.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {improveTips.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-base font-medium text-yellow-800 mb-2">Areas to Improve</h4>
            <div className="space-y-2">
              {improveTips.map((tip, index) => (
                <div key={index} className="text-base text-yellow-700">
                  <p className="font-medium">{tip.tip}</p>
                  <p className="text-yellow-600">{tip.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Details = ({ feedback }: DetailsProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6">
      <h2 className="text-3xl font-bold mb-4">Detailed Feedback</h2>
      
      <Accordion className="space-y-4">
        {/* Tone & Style Section */}
        <AccordionItem id="tone-style" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="tone-style" className="bg-gray-50 hover:bg-gray-100">
            <CategoryHeader 
              title="Tone & Style" 
              categoryScore={feedback.toneAndStyle.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style" className="p-4">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Content Section */}
        <AccordionItem id="content" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="content" className="bg-gray-50 hover:bg-gray-100">
            <CategoryHeader 
              title="Content" 
              categoryScore={feedback.content.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="content" className="p-4">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Structure Section */}
        <AccordionItem id="structure" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="structure" className="bg-gray-50 hover:bg-gray-100">
            <CategoryHeader 
              title="Structure" 
              categoryScore={feedback.structure.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="structure" className="p-4">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Skills Section */}
        <AccordionItem id="skills" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="skills" className="bg-gray-50 hover:bg-gray-100">
            <CategoryHeader 
              title="Skills" 
              categoryScore={feedback.skills.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="skills" className="p-4">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
