
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { generateAiSuggestions } from "@/utils/export";
import { ResumeData } from "@/utils/export";
import { toast } from "sonner";

interface AiAssistantProps {
  resumeData: ResumeData;
}

export const AiAssistant = ({ resumeData }: AiAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState("experience");
  const [suggestion, setSuggestion] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an AI API with the resume data
      const result = await generateAiSuggestions(resumeData, section);
      setSuggestion(result);
      toast.success("Suggestion generated!");
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast.error("Failed to get suggestion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would send the custom prompt to an AI API
      // For now, we'll just use a mock response
      setTimeout(() => {
        const responses = [
          "Consider adding more quantifiable achievements to your resume. Numbers help recruiters understand your impact.",
          "Your resume could benefit from more industry-specific keywords that ATS systems look for.",
          "Try shortening your job descriptions to focus only on your most impressive achievements.",
          "Consider reorganizing your skills section to prioritize the most relevant skills for your target position."
        ];
        setSuggestion(responses[Math.floor(Math.random() * responses.length)]);
        toast.success("Custom suggestion generated!");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting custom AI suggestion:", error);
      toast.error("Failed to get suggestion. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Resume Assistant
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select section to improve" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="experience">Work Experience</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="summary">Professional Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Get Improvement Suggestions
          </Button>
          
          <div className="my-4 space-y-2">
            <div className="text-sm font-medium mb-1">Or ask a custom question:</div>
            <Textarea
              placeholder="E.g., How can I highlight my leadership skills better?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            <Button onClick={handleCustomPrompt} disabled={isLoading} variant="outline" className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
              Get Custom Advice
            </Button>
          </div>
          
          {suggestion && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">{suggestion}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
