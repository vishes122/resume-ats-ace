
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";

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
}

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  return (
    <Card className="p-8 w-full bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg" id="resume-preview">
      {/* Header with optional profile image */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {data.personalInfo.profileImage && (
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
              <AvatarImage src={data.personalInfo.profileImage} alt={data.personalInfo.fullName} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xl">
                {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className={`${data.personalInfo.profileImage ? "text-left flex-1" : "text-center w-full"}`}>
          <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          <div className="text-sm flex flex-wrap gap-3 items-center justify-center md:justify-start">
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
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-600 mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Professional Experience
          </h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <div className="text-gray-700 dark:text-gray-300">{exp.company}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                </div>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-600 mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.school}</h3>
                  <div className="text-gray-700 dark:text-gray-300">{edu.degree}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {edu.graduationDate && format(new Date(edu.graduationDate), "MMM yyyy")}
                </div>
              </div>
              {edu.gpa && <div className="text-sm text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-600 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm border border-gray-200 dark:border-gray-600"
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
