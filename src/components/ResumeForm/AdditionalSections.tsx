
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Award, Book, Star, Coffee } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AdditionalSectionsProps {
  certifications: string[];
  hobbies: string[];
  extraCurricular: string[];
  softSkills: string[];
  onCertificationsChange: (value: string[]) => void;
  onHobbiesChange: (value: string[]) => void;
  onExtraCurricularChange: (value: string[]) => void;
  onSoftSkillsChange: (value: string[]) => void;
}

export const AdditionalSections = ({
  certifications,
  hobbies,
  extraCurricular,
  softSkills,
  onCertificationsChange,
  onHobbiesChange,
  onExtraCurricularChange,
  onSoftSkillsChange,
}: AdditionalSectionsProps) => {
  const handleAdd = (
    section: string[],
    setSection: (value: string[]) => void
  ) => {
    setSection([...section, ""]);
  };

  const handleRemove = (
    index: number,
    section: string[],
    setSection: (value: string[]) => void
  ) => {
    const newSection = section.filter((_, i) => i !== index);
    setSection(newSection);
  };

  const handleChange = (
    index: number,
    value: string,
    section: string[],
    setSection: (value: string[]) => void
  ) => {
    const newSection = [...section];
    newSection[index] = value;
    setSection(newSection);
  };

  const renderSection = (
    title: string,
    items: string[],
    setItems: (value: string[]) => void,
    icon: React.ReactNode
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value, items, setItems)}
            placeholder={`Enter ${title.toLowerCase()}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index, items, setItems)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => handleAdd(items, setItems)}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add {title}
      </Button>
    </div>
  );

  return (
    <Card className="p-6 space-y-6">
      {renderSection("Certifications", certifications, onCertificationsChange, <Award className="h-5 w-5 text-blue-600" />)}
      {renderSection("Extra-Curricular Activities", extraCurricular, onExtraCurricularChange, <Book className="h-5 w-5 text-indigo-600" />)}
      {renderSection("Soft Skills", softSkills, onSoftSkillsChange, <Star className="h-5 w-5 text-yellow-600" />)}
      {renderSection("Hobbies", hobbies, onHobbiesChange, <Coffee className="h-5 w-5 text-green-600" />)}
    </Card>
  );
};
