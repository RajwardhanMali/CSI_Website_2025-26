import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import csiLogo from "../assets/CSI_ELOGO2.jpg";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  vitEmail: z.string().email("Invalid VIT email").endsWith("@vit.edu", "Must be a VIT email"),
  prn: z.string().min(1, "PRN is required"),
  contact: z.string().min(10, "Valid contact number required"),
  campus: z.enum(["Kondhwa", "Bibwewadi"], { required_error: "Please select a campus" }),
  branch: z.string().min(1, "Please select a branch"),
  division: z.string().min(1, "Division is required"),
  domains: z.array(z.string()).min(1, "Select at least one domain").max(2, "Maximum 2 domains allowed"),
  experience: z.string().min(10, "Please describe your experience (minimum 10 characters)"),
  newIdea: z.string().min(10, "Please share your idea (minimum 10 characters)"),
  whyCSI: z.string().min(10, "Please tell us why you want to join (minimum 10 characters)"),
  questions: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const rotatingTexts = [
  "Feeling the energy?",
  "Ready to innovate?",
  "Join the tech revolution!",
  "Join the amazing!"
];

const branches = [
  "CS", "IT", "CSE(AIML)", "CSE(AI)", "AIDS", "MECH", 
  "INSTRU", "E&TC", "CSE(SE)", "CSE(IOT)", "CSE(DS)", "CIVIL"
];

const domains = [
  "Aesthetics",
  "Content and Social Media",
  "Multimedia",
  "Finance",
  "Operations & Venue",
  "Corporate Relations",
  "Publicity",
  "Database",
  "Sponsorship",
];

const Volunteer = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domains: [],
    },
  });

  const selectedDomains = watch("domains") || [];
  const selectedCampus = watch("campus");
  const formData = watch();

  useEffect(() => {
    const loadLastSubmission = () => {
      try {
        const submissions = [];
        const singleSubmission = localStorage.getItem('volunteerSubmission');
        if (singleSubmission) {
          submissions.push(JSON.parse(singleSubmission));
        }
        
        const multipleSubmissions = localStorage.getItem('volunteerSubmissions');
        if (multipleSubmissions) {
          const parsedSubmissions = JSON.parse(multipleSubmissions);
          submissions.push(...parsedSubmissions);
        }
        
        const uniqueSubmissions = submissions.filter((submission, index, self) => 
          index === self.findIndex(s => s.id === submission.id)
        );
        
        uniqueSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        if (uniqueSubmissions.length > 0) {
          setIsAlreadyRegistered(true);
          setSubmissionStatus('success');
          const lastSubmission = uniqueSubmissions[0];
          setSubmittedData(lastSubmission);

          Object.keys(lastSubmission).forEach(key => {
            if (key !== 'submittedAt' && key !== 'id') {
              setValue(key, lastSubmission[key]);
            }
          });
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
      }
    };
    
    loadLastSubmission();
  }, [setValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    if (isAlreadyRegistered) return;
    
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage(null);
    setIsAlreadyRegistered(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/register-volunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Email or VIT email already registered
          if (responseData.error === 'Email already registered') {
            setErrorMessage("This email is already registered. Please use a different email address.");
          } else if (responseData.error === 'VIT Email already registered') {
            setErrorMessage("This VIT email is already registered. Please use a different VIT email address.");
          }
          setIsAlreadyRegistered(true);
          setSubmissionStatus('error');
        } else if (response.status === 400) {
          // Validation error
          setErrorMessage("Please check your form data and try again.");
          setSubmissionStatus('error');
        } else {
          throw new Error("Submission failed");
        }
        return;
      }

      const submissionData = {
        ...data,
        submittedAt: new Date().toISOString(),
        id: responseData.id || Date.now()
      };
      
      localStorage.setItem('volunteerSubmission', JSON.stringify(submissionData));
      
      const existingSubmissions = JSON.parse(localStorage.getItem('volunteerSubmissions') || '[]');
      existingSubmissions.push(submissionData);
      localStorage.setItem('volunteerSubmissions', JSON.stringify(existingSubmissions));
      
      setSubmittedData(submissionData);
      setSubmissionStatus('success');
      
    } catch (error) {
      setErrorMessage("An error occurred while submitting your application. Please try again.");
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDomainChange = (domain, checked) => {
    if (submissionStatus === 'success' || isAlreadyRegistered) return;
    const current = selectedDomains;
    if (checked && current.length < 2) {
      setValue("domains", [...current, domain]);
    } else if (!checked) {
      setValue("domains", current.filter((d) => d !== domain));
    } else {
      alert("Limit reached: You can select a maximum of 2 domains");
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-[#ff6b7d]/5 to-[#a54657]/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#a54657]/5 via-transparent to-[#ff6b7d]/8"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff6b7d]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#a54657]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[#ff6b7d]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#a54657]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-8">
        <div className="mb-12 text-center">
          <img src={csiLogo} alt="CSI Logo" className="mx-auto mb-8 h-40 sm:h-44 md:h-48 lg:h-52 object-contain md:rounded-2xl md:shadow-lg" />
          <div className="mb-6 h-[140px] sm:h-[160px] md:h-[180px] lg:h-[160px] flex items-center justify-center overflow-hidden">
            <div className="w-full px-4">
              <h1 className="audiowide text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl font-light text-[#a54657] transition-all duration-500 leading-tight">
                {rotatingTexts[currentTextIndex]}
              </h1>
            </div>
          </div>
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-normal text-[#a54657] px-4">
            CSI Volunteers Recruitment 2025-26
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-xl text-gray-700 px-4 mb-6">
            The Computer Society of India (CSI), Student Chapter, VIT Pune
          </p>
        </div>

        <div className="rounded-xl border border-gray-300 bg-white p-10 shadow-lg">
          <div className="mb-8">
            <p className="mb-6 text-lg text-gray-800 leading-relaxed">
              We are pleased to announce the opening of applications for <strong className="text-[#a54657]">Volunteer position</strong> for the academic year 2025-26.
            </p>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              Volunteers will support the planning and execution of technical and non-technical activities organized by the club.
            </p>
            <p className="mb-4 text-lg font-medium text-[#a54657]">
              Note: Form only open for First year students.
            </p>
            <p className="mb-6 text-base text-[#ff6b7d]">
              * Indicates required question
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* Error Display */}
            {submissionStatus === 'error' && errorMessage && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="text-xl font-medium text-red-800 mb-2">Submission Failed</h3>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="email" className="block text-lg font-medium text-[#a54657]">
                Email <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="email"
                type="email"
                disabled={submissionStatus === 'success' || isAlreadyRegistered}
                {...register("email")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${(submissionStatus === 'success' || isAlreadyRegistered) ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.email && <p className="text-base text-[#ff6b7d] mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="fullName" className="block text-lg font-medium text-[#a54657]">
                Full Name <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="fullName"
                disabled={submissionStatus === 'success' || isAlreadyRegistered}
                {...register("fullName")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${(submissionStatus === 'success' || isAlreadyRegistered) ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.fullName && <p className="text-base text-[#ff6b7d] mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="vitEmail" className="block text-lg font-medium text-[#a54657]">
                Email Id (vit.edu) <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="vitEmail"
                type="email"
                disabled={submissionStatus === 'success' || isAlreadyRegistered}
                {...register("vitEmail")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${(submissionStatus === 'success' || isAlreadyRegistered) ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.vitEmail && <p className="text-base text-[#ff6b7d] mt-1">{errors.vitEmail.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="prn" className="block text-lg font-medium text-[#a54657]">
                PRN <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="prn"
                disabled={submissionStatus === 'success'}
                {...register("prn")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.prn && <p className="text-base text-[#ff6b7d] mt-1">{errors.prn.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="contact" className="block text-lg font-medium text-[#a54657]">
                Contact No.(Whatsapp): <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="contact"
                type="tel"
                disabled={submissionStatus === 'success'}
                {...register("contact")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.contact && <p className="text-base text-[#ff6b7d] mt-1">{errors.contact.message}</p>}
            </div>

            {/* Campus */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#a54657]">
                Campus <span className="text-[#ff6b7d]">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input 
                      type="radio" 
                      id="bibwewadi" 
                      value="Bibwewadi" 
                      disabled={submissionStatus === 'success'}
                      {...register("campus")}
                      className={`appearance-none w-5 h-5 border-2 border-gray-400 bg-white checked:bg-[#ff6b7d] checked:border-[#ff6b7d] focus:outline-none focus:ring-2 focus:ring-[#ff6b7d] focus:ring-opacity-50 cursor-pointer ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    <div className="absolute inset-0 w-5 h-5 pointer-events-none flex items-center justify-center">
                      <div className={`w-2 h-2 bg-white rounded-full transition-opacity duration-200 ${selectedCampus === 'Bibwewadi' ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>
                  </div>
                  <label htmlFor="bibwewadi" className="font-normal cursor-pointer text-lg text-gray-700">Bibwewadi</label>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input 
                      type="radio" 
                      id="kondhwa" 
                      value="Kondhwa" 
                      disabled={submissionStatus === 'success'}
                      {...register("campus")}
                      className={`appearance-none w-5 h-5 border-2 border-gray-400 bg-white checked:bg-[#ff6b7d] checked:border-[#ff6b7d] focus:outline-none focus:ring-2 focus:ring-[#ff6b7d] focus:ring-opacity-50 cursor-pointer ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    <div className="absolute inset-0 w-5 h-5 pointer-events-none flex items-center justify-center">
                      <div className={`w-2 h-2 bg-white rounded-full transition-opacity duration-200 ${selectedCampus === 'Kondhwa' ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>
                  </div>
                  <label htmlFor="kondhwa" className="font-normal cursor-pointer text-lg text-gray-700">Kondhwa</label>
                </div>
              </div>
              {errors.campus && <p className="text-base text-[#ff6b7d] mt-1">{errors.campus.message}</p>}
            </div>

            {/* Branch */}
            <div className="space-y-3">
              <label htmlFor="branch" className="block text-lg font-medium text-[#a54657]">
                Branch <span className="text-[#ff6b7d]">*</span>
              </label>
              <div className="relative w-full">
                <select 
                  disabled={submissionStatus === 'success'}
                  {...register("branch")}
                  className={`w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-base sm:text-lg transition-colors duration-200 appearance-none cursor-pointer block ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  style={{ 
                    outline: 'none',
                    minWidth: '0',
                    maxWidth: '100%',
                    width: '100%'
                  }}
                >
                  <option value="">Choose</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.branch && <p className="text-base text-[#ff6b7d] mt-1">{errors.branch.message}</p>}
            </div>

            {/* Division */}
            <div className="space-y-3">
              <label htmlFor="division" className="block text-lg font-medium text-[#a54657]">
                Division <span className="text-[#ff6b7d]">*</span>
              </label>
              <input
                id="division"
                disabled={submissionStatus === 'success'}
                {...register("division")}
                className={`w-full border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 px-4 py-3 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.division && <p className="text-base text-[#ff6b7d] mt-1">{errors.division.message}</p>}
            </div>

            {/* Domains */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#a54657]">
                Domains You're Applying For (Max 2) <span className="text-[#ff6b7d]">*</span>
              </label>
              <div className="space-y-3">
                {domains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={domain}
                        disabled={submissionStatus === 'success'}
                        checked={selectedDomains.includes(domain)}
                        onChange={(e) => handleDomainChange(domain, e.target.checked)}
                        className={`appearance-none w-5 h-5 border-2 border-gray-400 bg-white checked:bg-[#ff6b7d] checked:border-[#ff6b7d] focus:outline-none focus:ring-2 focus:ring-[#ff6b7d] focus:ring-opacity-50 cursor-pointer ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      <div className="absolute inset-0 w-5 h-5 pointer-events-none flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0" fill="currentColor" viewBox="0 0 20 20" style={{ opacity: selectedDomains.includes(domain) ? '1' : '0' }}>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor={domain} className="font-normal cursor-pointer text-lg text-gray-700">
                      {domain}
                    </label>
                  </div>
                ))}
              </div>
              {errors.domains && <p className="text-base text-[#ff6b7d] mt-1">{errors.domains.message}</p>}
            </div>

            {/* Section: Getting to Know You */}
            <div className="pt-6">
              <h3 className="mb-6 text-3xl font-medium text-[#a54657]">Getting to Know You!</h3>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <label htmlFor="experience" className="block text-lg font-medium text-[#a54657]">
                What experiences do you have in the domains you wish to apply for? <span className="text-[#ff6b7d]">*</span>
              </label>
              <textarea
                id="experience"
                disabled={submissionStatus === 'success'}
                {...register("experience")}
                rows={5}
                className={`w-full resize-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.experience && <p className="text-base text-[#ff6b7d] mt-1">{errors.experience.message}</p>}
            </div>

            {/* New Idea */}
            <div className="space-y-3">
              <label htmlFor="newIdea" className="block text-lg font-medium text-[#a54657]">
                If you could bring one completely new idea or initiative to CSI, what would it be and why? <span className="text-[#ff6b7d]">*</span>
              </label>
              <textarea
                id="newIdea"
                disabled={submissionStatus === 'success'}
                {...register("newIdea")}
                rows={5}
                className={`w-full resize-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.newIdea && <p className="text-base text-[#ff6b7d] mt-1">{errors.newIdea.message}</p>}
            </div>

            {/* Why CSI */}
            <div className="space-y-3">
              <label htmlFor="whyCSI" className="block text-lg font-medium text-[#a54657]">
                Why do you want to be a part of CSI? <span className="text-[#ff6b7d]">*</span>
              </label>
              <textarea
                id="whyCSI"
                disabled={submissionStatus === 'success'}
                {...register("whyCSI")}
                rows={5}
                className={`w-full resize-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
              {errors.whyCSI && <p className="text-base text-[#ff6b7d] mt-1">{errors.whyCSI.message}</p>}
            </div>

            {/* Section: Before You Go */}
            <div className="pt-6">
              <h3 className="mb-6 text-3xl font-medium text-[#a54657]">Before You Go!</h3>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              <label htmlFor="questions" className="block text-lg font-medium text-[#a54657]">
                Do you have any questions for us?
              </label>
              <textarea
                id="questions"
                disabled={submissionStatus === 'success'}
                {...register("questions")}
                rows={4}
                className={`w-full resize-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <label htmlFor="additionalInfo" className="block text-lg font-medium text-[#a54657]">
                Is there anything you would like us to know about you?
              </label>
              <textarea
                id="additionalInfo"
                disabled={submissionStatus === 'success'}
                {...register("additionalInfo")}
                rows={4}
                className={`w-full resize-none border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-0 focus:border-[#ff6b7d] bg-gray-50 text-lg transition-colors duration-200 ${submissionStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6">
              {submissionStatus === 'success' ? (
                <div className="bg-green-600 text-white font-medium px-8 py-3 rounded-lg text-lg">
                  Application Submitted Successfully
                </div>
              ) : isAlreadyRegistered ? (
                <div className="bg-orange-600 text-white font-medium px-8 py-3 rounded-lg text-lg cursor-not-allowed">
                  Already Registered
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isAlreadyRegistered}
                  className={`font-medium px-8 py-3 rounded-lg disabled:opacity-50 transition-colors duration-200 text-lg ${
                    submissionStatus === 'error' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'hover:bg-[#ff6b7d] bg-[#a54657] text-white'
                  }`}
                >
                  {isSubmitting 
                    ? "Submitting..." 
                    : submissionStatus === 'error' && !isAlreadyRegistered
                      ? "Failed - Try Again" 
                      : "Submit Application"
                  }
                </button>
              )}
              <p className="text-lg text-gray-600 text-right">
                See you at the interviews ;)
              </p>
            </div>
          </form>

          {/* Success Display */}
          {submissionStatus === 'success' && submittedData && (
            <div className="mt-10 p-8 bg-green-50 border border-green-200 rounded-xl">
              <h3 className="text-2xl font-medium text-green-800 mb-6">Application Submitted Successfully</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-green-700">Name:</strong> {submittedData.fullName}</div>
                <div><strong className="text-green-700">Email:</strong> {submittedData.email}</div>
                <div><strong className="text-green-700">VIT Email:</strong> {submittedData.vitEmail}</div>
                <div><strong className="text-green-700">PRN:</strong> {submittedData.prn}</div>
                <div><strong className="text-green-700">Contact:</strong> {submittedData.contact}</div>
                <div><strong className="text-green-700">Campus:</strong> {submittedData.campus}</div>
                <div><strong className="text-green-700">Branch:</strong> {submittedData.branch}</div>
                <div><strong className="text-green-700">Division:</strong> {submittedData.division}</div>
                <div className="md:col-span-2"><strong className="text-green-700">Domains:</strong> {submittedData.domains?.join(', ')}</div>
                <div className="md:col-span-2"><strong className="text-green-700">Submitted:</strong> {new Date(submittedData.submittedAt).toLocaleString()}</div>
              </div>
              <p className="mt-4 text-green-700">
                Your application has been submitted to our system. See you at the interviews!
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-10 border-t pt-8">
            <p className="mb-4 text-lg font-medium text-[#a54657]">For any queries, feel free to contact:</p>
            <ul className="space-y-2 text-lg text-gray-700">
              <li>Ansh Sharma - 9579971640</li>
              <li>Purva Rathi - 8459635690</li>
              <li>Tejas Desale - 9322422921</li>
              <li>Shripad Kanakdande - 7028189628</li>
              <li>Shruti Raina - 9086094452</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-md text-gray-500">
          Developed by Team CSI
        </p>
      </div>
    </div>
  );
};  

export default Volunteer;