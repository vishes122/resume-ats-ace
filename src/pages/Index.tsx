
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/components/ResumeForm/PersonalInfo";
import { Experience } from "@/components/ResumeForm/Experience";
import { Education } from "@/components/ResumeForm/Education";
import { Skills } from "@/components/ResumeForm/Skills";
import { Projects } from "@/components/ResumeForm/Projects";
import { AdditionalSections } from "@/components/ResumeForm/AdditionalSections";
import { ResumePreview } from "@/components/ResumePreview/ResumePreview";
import { TemplateSelector } from "@/components/ResumeForm/TemplateSelector";
import { AiAssistant } from "@/components/ResumeForm/AiAssistant";
import { ResumeImport } from "@/components/ResumeForm/ResumeImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, LogOut, FileText, Sun, Moon, SaveIcon, Palette, Import } from "lucide-react";
import { toPDF, toWord, ResumeData } from "@/utils/export";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);
  
  const [formData, setFormData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      profileImage: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    hobbies: [],
    extraCurricular: [],
    softSkills: [],
    font: "inter",
    template: "classic",
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

  const handleProjectsChange = (projects: any[]) => {
    setFormData((prev) => ({ ...prev, projects }));
  };

  const handleCertificationsChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, certifications: value }));
  };

  const handleHobbiesChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, hobbies: value }));
  };

  const handleExtraCurricularChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, extraCurricular: value }));
  };

  const handleSoftSkillsChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, softSkills: value }));
  };

  const handleFontChange = (value: string) => {
    setFormData((prev) => ({ ...prev, font: value }));
  };

  const handleTemplateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, template: value }));
  };

  const handleAdditionalSectionsChange = (field: keyof typeof formData, value: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!formData.personalInfo.fullName) {
      toast.error("Please enter your name before downloading");
      return;
    }
    
    const fileName = `${formData.personalInfo.fullName.replace(/\s+/g, "_")}_resume`;
    
    toast.promise(
      format === 'pdf' 
        ? toPDF("resume-preview", `${fileName}.pdf`)
        : toWord(formData, `${fileName}.docx`),
      {
        loading: `Generating ${format.toUpperCase()}...`,
        success: `Resume downloaded successfully as ${format.toUpperCase()}!`,
        error: `Failed to generate ${format.toUpperCase()}. Please try again.`
      }
    );
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
    toast.success("Resume data saved successfully!");
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        toast.success("Resume data loaded successfully!");
      } catch (error) {
        toast.error("Failed to load saved data");
      }
    }
  };

  const handleResumeImport = (importedData: Partial<ResumeData>) => {
    setFormData((prevData) => {
      const newData = { ...prevData };
      
      // Merge personal info
      if (importedData.personalInfo) {
        newData.personalInfo = {
          ...prevData.personalInfo,
          ...importedData.personalInfo,
        };
      }
      
      // Merge other sections if they exist and aren't empty
      if (importedData.experiences && importedData.experiences.length > 0) {
        newData.experiences = [...importedData.experiences];
      }
      
      if (importedData.education && importedData.education.length > 0) {
        newData.education = [...importedData.education];
      }
      
      if (importedData.skills && importedData.skills.length > 0) {
        newData.skills = [...importedData.skills];
      }
      
      if (importedData.projects && importedData.projects.length > 0) {
        newData.projects = [...importedData.projects];
      }
      
      return newData;
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedGradient />
      
      <div className="container py-8 flex-grow z-10 relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-br from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              ATS-Friendly Resume Builder
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button variant="outline" onClick={saveToLocalStorage} className="gap-1">
              <SaveIcon className="h-4 w-4" />
              Save
            </Button>
            
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30">
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>
            
            <TabsContent value="import" className="mt-4 animate-fade-in space-y-6">
              <ResumeImport onImport={handleResumeImport} />
              <AiAssistant resumeData={formData} />
            </TabsContent>
            
            <TabsContent value="personal" className="mt-4 animate-fade-in space-y-6">
              <PersonalInfo
                formData={formData.personalInfo}
                onChange={handlePersonalInfoChange}
              />
              <TemplateSelector
                value={formData.template || "classic"}
                onChange={handleTemplateChange}
              />
            </TabsContent>
            
            <TabsContent value="experience" className="mt-4 animate-fade-in">
              <Experience
                experiences={formData.experiences}
                onChange={handleExperienceChange}
              />
            </TabsContent>
            
            <TabsContent value="education" className="mt-4 animate-fade-in">
              <Education
                education={formData.education}
                onChange={handleEducationChange}
              />
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4 animate-fade-in">
              <Projects
                projects={formData.projects || []}
                onChange={handleProjectsChange}
              />
            </TabsContent>
            
            <TabsContent value="skills" className="mt-4 animate-fade-in">
              <Skills
                skills={formData.skills}
                onChange={handleSkillsChange}
              />
            </TabsContent>
            
            <TabsContent value="additional" className="mt-4 animate-fade-in">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="font">
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Font Selection
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4 p-4">
                      <Label>Select Font</Label>
                      <Select value={formData.font} onValueChange={handleFontChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="playfair">Playfair Display</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="lato">Lato</SelectItem>
                          <SelectItem value="montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sections">
                  <AccordionTrigger className="py-4">Additional Sections</AccordionTrigger>
                  <AccordionContent>
                    <AdditionalSections
                      certifications={formData.certifications || []}
                      hobbies={formData.hobbies || []}
                      extraCurricular={formData.extraCurricular || []}
                      softSkills={formData.softSkills || []}
                      onCertificationsChange={(value) => handleAdditionalSectionsChange('certifications', value)}
                      onHobbiesChange={(value) => handleAdditionalSectionsChange('hobbies', value)}
                      onExtraCurricularChange={(value) => handleAdditionalSectionsChange('extraCurricular', value)}
                      onSoftSkillsChange={(value) => handleAdditionalSectionsChange('softSkills', value)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="sticky top-4">
              <div className="flex justify-between mb-4">
                <Button variant="outline" onClick={() => loadFromLocalStorage()} className="gap-1">
                  <Import className="mr-2 h-4 w-4" />
                  Load Saved Data
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload('docx')} variant="outline" className="bg-white dark:bg-gray-800">
                    <Download className="mr-2 h-4 w-4" />
                    DOCX
                  </Button>
                  <Button onClick={() => handleDownload('pdf')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className={`max-h-[800px] overflow-y-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg shadow-lg font-${formData.font}`}>
                <ResumePreview data={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Created by <a href="https://www.visheshsanghvi.me/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vishesh Sanghvi</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
