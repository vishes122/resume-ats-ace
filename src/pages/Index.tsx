
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/components/ResumeForm/PersonalInfo";
import { Experience } from "@/components/ResumeForm/Experience";
import { Education } from "@/components/ResumeForm/Education";
import { Skills } from "@/components/ResumeForm/Skills";
import { ResumePreview } from "@/components/ResumePreview/ResumePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { toPDF } from "@/utils/pdf";

const Index = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    experiences: [],
    education: [],
    skills: [],
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleExperienceChange = (experiences: any[]) => {
    setFormData((prev) => ({ ...prev, experiences }));
  };

  const handleEducationChange = (education: any[]) => {
    setFormData((prev) => ({ ...prev, education }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleDownload = () => {
    toPDF("resume-preview", `${formData.personalInfo.fullName.replace(/\s+/g, "_")}_resume.pdf`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">ATS-Friendly Resume Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            <PersonalInfo
              formData={formData.personalInfo}
              onChange={handlePersonalInfoChange}
            />
          </TabsContent>
          
          <TabsContent value="experience" className="mt-4">
            <Experience
              experiences={formData.experiences}
              onChange={handleExperienceChange}
            />
          </TabsContent>
          
          <TabsContent value="education" className="mt-4">
            <Education
              education={formData.education}
              onChange={handleEducationChange}
            />
          </TabsContent>
          
          <TabsContent value="skills" className="mt-4">
            <Skills
              skills={formData.skills}
              onChange={handleSkillsChange}
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="sticky top-4">
            <div className="flex justify-end mb-4">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <div className="max-h-[800px] overflow-y-auto">
              <ResumePreview data={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
