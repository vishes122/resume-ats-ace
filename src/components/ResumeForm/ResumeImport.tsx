
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText } from "lucide-react";
import { parseResumePDF } from "@/utils/export";
import { toast } from "sonner";
import { ResumeData } from "@/utils/export";

interface ResumeImportProps {
  onImport: (data: Partial<ResumeData>) => void;
}

export const ResumeImport = ({ onImport }: ResumeImportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        toast.info(`Selected file: ${file.name}`);
      } else {
        toast.error("Please select a PDF file");
        event.target.value = "";
        setSelectedFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsLoading(true);
    try {
      toast.info("Analyzing resume...");
      const parsedData = await parseResumePDF(selectedFile);
      
      // Validate that we have at least some basic data
      if (
        !parsedData.personalInfo?.email && 
        !parsedData.personalInfo?.fullName && 
        parsedData.skills?.length === 0
      ) {
        toast.warning("Limited information extracted from your resume. You may need to manually fill in most fields.");
      }
      
      onImport(parsedData);
      toast.success("Resume imported successfully! Some fields have been auto-filled.");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("Failed to import resume. Please ensure your PDF is not password-protected and is text-based (not scanned).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Import Existing Resume
        </CardTitle>
        <CardDescription>
          Upload your existing resume to automatically pre-fill form fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium mb-1">
              {selectedFile ? selectedFile.name : "Click to upload your resume (PDF)"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Maximum file size: 5MB
            </p>
          </label>
        </div>
        
        <Button 
          onClick={handleImport} 
          disabled={isLoading || !selectedFile} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Import Resume Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
