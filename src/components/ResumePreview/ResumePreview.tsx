
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Briefcase, GraduationCap, Award, Code, Link } from "lucide-react";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    link?: string;
    technologies?: string[];
  }>;
  certifications?: string[];
  hobbies?: string[];
  extraCurricular?: string[];
  softSkills?: string[];
  font?: string;
  template?: string;
}

interface ResumePreviewProps {
  data: ResumeData;
}

// Helper function to safely format dates
const safelyFormatDate = (dateString: string | undefined): string => {
  if (!dateString) return "";
  
  try {
    // Check if the date string is valid
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return dateString; // Return the original string if it's not a valid date
    }
    return format(dateObj, "MMM yyyy");
  } catch (error) {
    console.error("Date formatting error:", error, "for date:", dateString);
    return dateString; // Return the original string on error
  }
};

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const templateClass = data.template || "classic";

  return (
    <Card 
      className={`p-8 w-full ${
        templateClass === "minimal" 
          ? "bg-white dark:bg-gray-900 text-black dark:text-white" 
          : templateClass === "modern" 
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white" 
            : "bg-white dark:bg-gray-800 text-black dark:text-white"
      } shadow-lg`} 
      id="resume-preview"
    >
      {/* Header with optional profile image */}
      <div className={`flex ${
          templateClass === "minimal" 
            ? "flex-col items-center" 
            : templateClass === "modern" 
              ? "flex-row-reverse items-center justify-between" 
              : "flex-col md:flex-row items-center md:items-start"
        } gap-6 mb-8`}
      >
        {data.personalInfo.profileImage && (
          <div className="flex-shrink-0">
            <Avatar className={`${
                templateClass === "minimal" 
                  ? "h-20 w-20 border-0" 
                  : templateClass === "modern" 
                    ? "h-24 w-24 rounded-md border-0" 
                    : "h-24 w-24 border-2 border-gray-200 dark:border-gray-700"
              }`}
            >
              <AvatarImage src={data.personalInfo.profileImage} alt={data.personalInfo.fullName} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xl">
                {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className={`${
            templateClass === "minimal" 
              ? "text-center w-full" 
              : templateClass === "modern" 
                ? "text-left flex-1" 
                : data.personalInfo.profileImage ? "text-left flex-1" : "text-center w-full"
          }`}
        >
          <h1 className={`${
              templateClass === "minimal" 
                ? "text-2xl font-medium" 
                : templateClass === "modern" 
                  ? "text-3xl font-bold text-blue-700 dark:text-blue-400" 
                  : "text-3xl font-bold"
            } mb-2`}
          >
            {data.personalInfo.fullName}
          </h1>
          <div className={`text-sm flex flex-wrap ${
              templateClass === "minimal" 
                ? "justify-center gap-4" 
                : templateClass === "modern" 
                  ? "justify-start gap-4" 
                  : "gap-3 items-center justify-center md:justify-start"
            }`}
          >
            {data.personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {data.personalInfo.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Professional Experience
          </h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold ${
                      templateClass === "modern" ? "text-blue-700 dark:text-blue-400" : ""
                    }`}
                  >
                    {exp.position}
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300">{exp.company}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.startDate && safelyFormatDate(exp.startDate)} -{" "}
                  {exp.endDate ? safelyFormatDate(exp.endDate) : "Present"}
                </div>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Code className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Projects
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${
                      templateClass === "modern" ? "text-blue-700 dark:text-blue-400" : ""
                    }`}
                  >
                    {project.title}
                  </h3>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                    >
                      <Link className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                {(project.startDate || project.endDate) && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {project.startDate && safelyFormatDate(project.startDate)}
                    {project.startDate && project.endDate && " - "}
                    {project.endDate ? safelyFormatDate(project.endDate) : 
                     project.startDate ? "Present" : ""}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm whitespace-pre-line">{project.description}</p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className={`text-xs px-2 py-0.5 rounded ${
                        templateClass === "modern" 
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <GraduationCap className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold ${
                      templateClass === "modern" ? "text-blue-700 dark:text-blue-400" : ""
                    }`}
                  >
                    {edu.school}
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300">{edu.degree}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {edu.graduationDate && safelyFormatDate(edu.graduationDate)}
                </div>
              </div>
              {edu.gpa && <div className="text-sm text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Award className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm ${
                  templateClass === "modern" 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                    : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications, Hobbies, etc. */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Award className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Certifications
          </h2>
          <ul className="list-disc pl-5">
            {data.certifications.map((cert, index) => (
              <li key={index} className="mb-1">{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional sections for hobbies, extracurricular, and soft skills */}
      {(data.hobbies && data.hobbies.length > 0) && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3`}
          >
            Hobbies
          </h2>
          <ul className="list-disc pl-5">
            {data.hobbies.map((hobby, index) => (
              <li key={index} className="mb-1">{hobby}</li>
            ))}
          </ul>
        </div>
      )}

      {(data.extraCurricular && data.extraCurricular.length > 0) && (
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3`}
          >
            Extra Curricular Activities
          </h2>
          <ul className="list-disc pl-5">
            {data.extraCurricular.map((activity, index) => (
              <li key={index} className="mb-1">{activity}</li>
            ))}
          </ul>
        </div>
      )}

      {(data.softSkills && data.softSkills.length > 0) && (
        <div>
          <h2 className={`text-xl font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3`}
          >
            Soft Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.softSkills.map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm ${
                  templateClass === "modern" 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                    : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
