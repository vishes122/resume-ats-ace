
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface ExperienceEntry {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceProps {
  experiences: ExperienceEntry[];
  onChange: (experiences: ExperienceEntry[]) => void;
}

export const Experience = ({ experiences, onChange }: ExperienceProps) => {
  const addExperience = () => {
    onChange([
      ...experiences,
      { company: "", position: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updatedExperiences);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="relative space-y-4 border p-4 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeExperience(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>Company</Label>
              <Input
                id={`company-${index}`}
                value={experience.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                placeholder="Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${index}`}>Position</Label>
              <Input
                id={`position-${index}`}
                value={experience.position}
                onChange={(e) => updateExperience(index, "position", e.target.value)}
                placeholder="Job Title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={experience.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                className="h-32"
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addExperience}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </CardContent>
    </Card>
  );
};
