import Navbar from '~/components/Navbar';
import { useState, type FormEvent } from 'react';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import {useNavigate} from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';

const Upload = () => {
  const {auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);


  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }
  const handleAnalyze = async ({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
    setIsProcessing(true);

    setStatusText('Uploading file...');
    const uploadedFile = await fs.upload([file]);
    if(!uploadedFile) return setStatusText('ERROR: Failed to upload file.');

    setStatusText('Converting to image...');
    const imageFile = await convertPdfToImage(file);
    console.log('[convertPdfToImage] Result:', imageFile);
    if(!imageFile.file) return setStatusText('ERROR: Failed to convert pdf to image.');

    setStatusText('Uploading the image...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if(!uploadedImage) return setStatusText('ERROR: Failed to upload image.');

    setStatusText('Preparing Data...');

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName, jobTitle, jobDescription,
      feedback: '',
    }
    await kv.set( `resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analyzing...');

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({jobTitle, jobDescription}),
    )
    if(!feedback) return setStatusText('ERROR: Failed to analyze resume');

    const feedbackText = feedback.message.content === 'string'
    ? feedback.message.content : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set( `resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis complete, redirecting...');
    console.log(data);
    navigate(`/resume/${uuid}`);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

   if(!file) return;

   handleAnalyze({companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-6">
          <h1 className="text-gradient text-4xl font-bold mb-6 whitespace-nowrap">
            Smart Feedback for Your Dream Job
          </h1>

          {isProcessing ? (
            <>
              <h2 className="text-xl mb-6 text-gray-600 animate-in fade-in">{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Scanning..."
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg animate-in fade-in"
              />
            </>
          ) : (
            <h2 className="text-xl text-dark-200 mb-8">
              Drop your resume for an ATS Score and personalized improvement tips
            </h2>
          )}

          {!isProcessing && (
            <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 animate-in fade-in">
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                <div className="form-div">
                  <label htmlFor="company-name" className="text-lg font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    placeholder="Enter company name"
                    className="transition-all hover:shadow-md focus:shadow-md"
                    required
                  />
                </div>
                <div className="form-div">
                  <label htmlFor="job-title" className="text-lg font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    name="job-title"
                    id="job-title"
                    placeholder="Enter job title"
                    className="transition-all hover:shadow-md focus:shadow-md"
                    required
                  />
                </div>
                <div className="form-div">
                  <label htmlFor="job-description" className="text-lg font-medium mb-1">Job Description</label>
                  <textarea
                    rows={5}
                    name="job-description"
                    id="job-description"
                    placeholder="Paste job description here"
                    className="transition-all hover:shadow-md focus:shadow-md"
                    required
                  />
                </div>
                <div className="form-div">
                  <label htmlFor="uploader" className="text-lg font-medium mb-1">Upload Resume (PDF)</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>
                <button 
                  className="primary-button mt-4 py-3 text-lg font-semibold transition-all hover:primary-gradient-hover"
                  type="submit"
                  disabled={!file}
                >
                  Analyze Resume
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
