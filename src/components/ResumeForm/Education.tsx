
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface EducationEntry {
  school: string;
  degree: string;
  graduationDate: string;
  gpa?: string;
}

interface EducationProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
}

export const Education = ({ education, onChange }: EducationProps) => {
  const addEducation = () => {
    onChange([...education, { school: "", degree: "", graduationDate: "", gpa: "" }]);
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updatedEducation = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updatedEducation);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="relative space-y-4 border p-4 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeEducation(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label htmlFor={`school-${index}`}>School</Label>
              <Input
                id={`school-${index}`}
                value={edu.school}
                onChange={(e) => updateEducation(index, "school", e.target.value)}
                placeholder="University Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`degree-${index}`}>Degree</Label>
              <Input
                id={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                placeholder="Bachelor of Science in..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`graduationDate-${index}`}>Graduation Date</Label>
                <Input
                  id={`graduationDate-${index}`}
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                <Input
                  id={`gpa-${index}`}
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addEducation}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
};
