
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectEntry {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  link?: string;
  technologies: string[];
}

interface ProjectsProps {
  projects: ProjectEntry[];
  onChange: (projects: ProjectEntry[]) => void;
}

export const Projects = ({ projects, onChange }: ProjectsProps) => {
  const [newProject, setNewProject] = useState<ProjectEntry>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    link: "",
    technologies: [],
  });
  const [newTechnology, setNewTechnology] = useState<string>("");

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      onChange([...projects, { ...newProject }]);
      setNewProject({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        link: "",
        technologies: [],
      });
    }
  };

  const updateProject = (index: number, field: keyof ProjectEntry, value: any) => {
    const updatedProjects = projects.map((project, i) =>
      i === index ? { ...project, [field]: value } : project
    );
    onChange(updatedProjects);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const addTechnology = (index: number, technology: string) => {
    if (technology.trim() && !projects[index].technologies.includes(technology.trim())) {
      const updatedProjects = [...projects];
      updatedProjects[index].technologies.push(technology.trim());
      onChange(updatedProjects);
      setNewTechnology("");
    }
  };

  const removeTechnology = (projectIndex: number, technologyIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].technologies.splice(technologyIndex, 1);
    onChange(updatedProjects);
  };

  const addTechnologyToNew = () => {
    if (newTechnology.trim() && !newProject.technologies.includes(newTechnology.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTechnology.trim()],
      });
      setNewTechnology("");
    }
  };

  const removeTechnologyFromNew = (index: number) => {
    const updatedTechnologies = [...newProject.technologies];
    updatedTechnologies.splice(index, 1);
    setNewProject({
      ...newProject,
      technologies: updatedTechnologies,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="relative space-y-4 border p-4 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeProject(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor={`project-title-${index}`}>Project Title</Label>
              <Input
                id={`project-title-${index}`}
                value={project.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
                placeholder="Project Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                placeholder="Describe your project and your role in it"
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-startDate-${index}`}>Start Date (optional)</Label>
                <Input
                  id={`project-startDate-${index}`}
                  type="month"
                  value={project.startDate || ""}
                  onChange={(e) => updateProject(index, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-endDate-${index}`}>End Date (optional)</Label>
                <Input
                  id={`project-endDate-${index}`}
                  type="month"
                  value={project.endDate || ""}
                  onChange={(e) => updateProject(index, "endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-link-${index}`}>Project Link (optional)</Label>
              <Input
                id={`project-link-${index}`}
                value={project.link || ""}
                onChange={(e) => updateProject(index, "link", e.target.value)}
                placeholder="https://github.com/yourusername/project"
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a technology (e.g., React, Python)" 
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology(index, newTechnology);
                    }
                  }}
                />
                <Button type="button" onClick={() => addTechnology(index, newTechnology)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="text-sm flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index, techIndex)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="border border-dashed p-4 rounded-lg">
          <h3 className="font-medium mb-4">Add a New Project</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-project-title">Project Title</Label>
              <Input
                id="new-project-title"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                placeholder="Project Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-project-description">Description</Label>
              <Textarea
                id="new-project-description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Describe your project and your role in it"
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-project-startDate">Start Date (optional)</Label>
                <Input
                  id="new-project-startDate"
                  type="month"
                  value={newProject.startDate || ""}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-endDate">End Date (optional)</Label>
                <Input
                  id="new-project-endDate"
                  type="month"
                  value={newProject.endDate || ""}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-project-link">Project Link (optional)</Label>
              <Input
                id="new-project-link"
                value={newProject.link || ""}
                onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                placeholder="https://github.com/yourusername/project"
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a technology (e.g., React, Python)" 
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnologyToNew();
                    }
                  }}
                />
                <Button type="button" onClick={addTechnologyToNew}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newProject.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="text-sm flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnologyFromNew(techIndex)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={addProject}
            disabled={!newProject.title || !newProject.description}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
