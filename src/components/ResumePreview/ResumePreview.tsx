
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Briefcase, GraduationCap, Award, Code, Link, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
    summary?: string;
    fontSize?: string;
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
  const fontSize = data.fontSize || "medium";
  const [editMode, setEditMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Font size classes
  const fontSizeClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const headingFontSizeClass = fontSize === "small" ? "text-lg" : fontSize === "large" ? "text-2xl" : "text-xl";
  const nameClass = fontSize === "small" ? "text-xl" : fontSize === "large" ? "text-4xl" : "text-3xl";

  const getTemplateStyles = () => {
    switch (templateClass) {
      case "executive":
        return "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100";
      case "creative":
        return "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-900 dark:text-purple-100";
      case "modern":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white";
      case "minimal":
        return "bg-white dark:bg-gray-900 text-black dark:text-white";
      default: // classic
        return "bg-white dark:bg-gray-800 text-black dark:text-white";
    }
  };

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    // In a real implementation, this would update the parent state
    // For now, we'll just exit edit mode
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <Card 
      className={`p-8 w-full ${getTemplateStyles()} ${fontSizeClass} shadow-lg`} 
      id="resume-preview"
    >
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
          className="text-xs"
        >
          {editMode ? "Exit Edit Mode" : "Edit Resume"}
        </Button>
      </div>

      {/* Header with optional profile image */}
      <div className={`flex ${
          templateClass === "minimal" 
            ? "flex-col items-center" 
            : templateClass === "modern" || templateClass === "creative"
              ? "flex-row-reverse items-center justify-between" 
              : templateClass === "executive"
                ? "flex-col items-center border-b-2 pb-4 mb-6 border-slate-300 dark:border-slate-600"
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
                    : templateClass === "executive"
                      ? "h-28 w-28 border-0 rounded-full"
                      : templateClass === "creative"
                        ? "h-24 w-24 rounded-full ring-4 ring-purple-200 dark:ring-purple-800"
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
            templateClass === "minimal" || templateClass === "executive"
              ? "text-center w-full" 
              : templateClass === "modern" || templateClass === "creative"
                ? "text-left flex-1" 
                : data.personalInfo.profileImage ? "text-left flex-1" : "text-center w-full"
          }`}
        >
          {editMode && editingField === "fullName" ? (
            <div className="mb-2 flex items-center gap-2">
              <Input 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border border-blue-400"
              />
              <Button size="sm" variant="outline" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          ) : (
            <h1 
              className={`${nameClass} ${
                templateClass === "minimal" 
                  ? "font-medium" 
                  : templateClass === "modern" 
                    ? "font-bold text-blue-700 dark:text-blue-400" 
                    : templateClass === "executive"
                      ? "font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100"
                      : templateClass === "creative"
                        ? "font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                        : "font-bold"
              } mb-2`}
              onClick={editMode ? () => handleEdit("fullName", data.personalInfo.fullName) : undefined}
              style={editMode ? { cursor: "pointer" } : {}}
            >
              {data.personalInfo.fullName}
            </h1>
          )}
          
          <div className={`text-sm flex flex-wrap ${
              templateClass === "minimal" || templateClass === "executive"
                ? "justify-center gap-4" 
                : templateClass === "modern" || templateClass === "creative"
                  ? "justify-start gap-4" 
                  : "gap-3 items-center justify-center md:justify-start"
            }`}
          >
            {data.personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {editMode && editingField === "email" ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-blue-400 text-xs h-6 py-0 px-1"
                    />
                    <Button size="sm" variant="outline" className="h-6 py-0" onClick={handleSaveEdit}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-6 py-0" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                ) : (
                  <span 
                    onClick={editMode ? () => handleEdit("email", data.personalInfo.email) : undefined}
                    style={editMode ? { cursor: "pointer" } : {}}
                  >
                    {data.personalInfo.email}
                  </span>
                )}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {editMode && editingField === "phone" ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-blue-400 text-xs h-6 py-0 px-1"
                    />
                    <Button size="sm" variant="outline" className="h-6 py-0" onClick={handleSaveEdit}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-6 py-0" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                ) : (
                  <span 
                    onClick={editMode ? () => handleEdit("phone", data.personalInfo.phone) : undefined}
                    style={editMode ? { cursor: "pointer" } : {}}
                  >
                    {data.personalInfo.phone}
                  </span>
                )}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                {editMode && editingField === "location" ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-blue-400 text-xs h-6 py-0 px-1"
                    />
                    <Button size="sm" variant="outline" className="h-6 py-0" onClick={handleSaveEdit}>Save</Button>
                    <Button size="sm" variant="ghost" className="h-6 py-0" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                ) : (
                  <span 
                    onClick={editMode ? () => handleEdit("location", data.personalInfo.location) : undefined}
                    style={editMode ? { cursor: "pointer" } : {}}
                  >
                    {data.personalInfo.location}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
                      : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Professional Summary
          </h2>
          {editMode && editingField === "summary" ? (
            <div className="mb-2 flex flex-col gap-2">
              <Textarea 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border border-blue-400 min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleSaveEdit}>Save</Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p 
              className="whitespace-pre-line" 
              onClick={editMode ? () => handleEdit("summary", data.personalInfo.summary || "") : undefined}
              style={editMode ? { cursor: "pointer" } : {}}
            >
              {data.personalInfo.summary}
            </p>
          )}
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
                      : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Professional Experience
          </h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" || templateClass === "creative" 
                  ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" 
                  : templateClass === "executive"
                    ? "pl-2 border-l-2 border-slate-300 dark:border-slate-600"
                    : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold ${
                      templateClass === "modern" 
                        ? "text-blue-700 dark:text-blue-400" 
                        : templateClass === "creative"
                          ? "text-purple-700 dark:text-purple-400"
                          : templateClass === "executive"
                            ? "text-slate-900 dark:text-slate-100"
                            : ""
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
                      : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <Code className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Projects
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" || templateClass === "creative"
                  ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" 
                  : templateClass === "executive"
                    ? "pl-2 border-l-2 border-slate-300 dark:border-slate-600"
                    : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${
                      templateClass === "modern" 
                        ? "text-blue-700 dark:text-blue-400" 
                        : templateClass === "creative"
                          ? "text-purple-700 dark:text-purple-400"
                          : templateClass === "executive"
                            ? "text-slate-900 dark:text-slate-100"
                            : ""
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
                          : templateClass === "creative"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : templateClass === "executive"
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
                      : "border-b-2 border-gray-300 dark:border-gray-600"
            } mb-3 flex items-center gap-2`}
          >
            <GraduationCap className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className={`mb-4 ${
                templateClass === "modern" || templateClass === "creative"
                  ? "pl-2 border-l-2 border-blue-200 dark:border-blue-800" 
                  : templateClass === "executive"
                    ? "pl-2 border-l-2 border-slate-300 dark:border-slate-600"
                    : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold ${
                      templateClass === "modern" 
                        ? "text-blue-700 dark:text-blue-400" 
                        : templateClass === "creative"
                          ? "text-purple-700 dark:text-purple-400"
                          : templateClass === "executive"
                            ? "text-slate-900 dark:text-slate-100"
                            : ""
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
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
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : templateClass === "executive"
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
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
          <h2 className={`${headingFontSizeClass} font-bold ${
              templateClass === "minimal" 
                ? "border-b border-gray-200 dark:border-gray-700" 
                : templateClass === "modern" 
                  ? "bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-sm text-blue-800 dark:text-blue-300" 
                  : templateClass === "executive"
                    ? "border-b-2 border-slate-300 dark:border-slate-600 uppercase tracking-wide"
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-sm text-purple-800 dark:text-purple-300"
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
                    : templateClass === "creative"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : templateClass === "executive"
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
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
