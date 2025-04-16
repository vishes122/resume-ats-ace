
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/components/ResumeForm/PersonalInfo";
import { Experience } from "@/components/ResumeForm/Experience";
import { Education } from "@/components/ResumeForm/Education";
import { Skills } from "@/components/ResumeForm/Skills";
import { ResumePreview } from "@/components/ResumePreview/ResumePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, LogOut, FileText, Sun, Moon, SaveIcon } from "lucide-react";
import { toPDF } from "@/utils/pdf";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const Index = () => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // This ensures the theme is properly applied when the component mounts
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);
  
  const [formData, setFormData] = useState({
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleDownload = () => {
    if (!formData.personalInfo.fullName) {
      toast.error("Please enter your name before downloading");
      return;
    }
    
    toast.promise(
      toPDF("resume-preview", `${formData.personalInfo.fullName.replace(/\s+/g, "_")}_resume.pdf`),
      {
        loading: "Generating PDF...",
        success: "Resume downloaded successfully!",
        error: "Failed to generate PDF. Please try again."
      }
    );
  };

  // Local storage functions
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
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30">
              <TabsTrigger value="personal" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Personal</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Experience</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Education</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4 animate-fade-in">
              <PersonalInfo
                formData={formData.personalInfo}
                onChange={handlePersonalInfoChange}
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
            
            <TabsContent value="skills" className="mt-4 animate-fade-in">
              <Skills
                skills={formData.skills}
                onChange={handleSkillsChange}
              />
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="sticky top-4">
              <div className="flex justify-between mb-4">
                <Button variant="outline" onClick={() => loadFromLocalStorage()} className="gap-1">
                  Load Saved Data
                </Button>
                <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <div className="max-h-[800px] overflow-y-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg shadow-lg">
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
