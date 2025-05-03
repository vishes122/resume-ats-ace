
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const templates = [
  { id: "classic", name: "Classic", description: "Traditional resume layout" },
  { id: "modern", name: "Modern", description: "Clean and contemporary design" },
  { id: "minimal", name: "Minimal", description: "Simplified and distraction-free" },
  { id: "executive", name: "Executive", description: "Professional with bold headings" },
  { id: "creative", name: "Creative", description: "Unique layout with color accents" }
];

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(value || "classic");
  
  useEffect(() => {
    if (value !== selectedTemplate) {
      setSelectedTemplate(value || "classic");
    }
  }, [value]);

  const handleTemplateChange = (newTemplate: string) => {
    setSelectedTemplate(newTemplate);
    onChange(newTemplate);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-lg font-medium">Select Resume Template</Label>
          <RadioGroup 
            value={selectedTemplate} 
            onValueChange={handleTemplateChange} 
            className="grid gap-4 grid-cols-1 md:grid-cols-3"
          >
            {templates.map((template) => (
              <label
                key={template.id}
                htmlFor={`template-${template.id}`}
                className={`flex flex-col items-center rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? "border-primary bg-primary/10" 
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className={`w-full h-32 mb-3 rounded relative ${
                  template.id === "classic" 
                    ? "bg-white" 
                    : template.id === "modern" 
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50" 
                      : template.id === "executive"
                        ? "bg-slate-50"
                        : template.id === "creative"
                          ? "bg-gradient-to-br from-purple-50 to-pink-50"
                          : "bg-gray-50"
                }`}>
                  <div className="absolute top-3 left-3 right-3 h-6 bg-gray-300 rounded"></div>
                  <div className="absolute top-12 left-3 w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="absolute top-18 left-3 right-3 h-16 flex flex-col justify-center">
                    <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <RadioGroupItem 
                  value={template.id} 
                  id={`template-${template.id}`} 
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-semibold text-md">{template.name}</div>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
