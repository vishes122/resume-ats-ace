
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Upload, Camera } from "lucide-react";
import { toPDF } from "@/utils/pdf";

interface PersonalInfoProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PersonalInfo = ({ formData, onChange }: PersonalInfoProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange("profileImage", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange("profileImage", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full border border-purple-200/50 shadow-lg transition-all hover:shadow-purple-100/50 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
        <CardTitle className="text-gradient font-heading flex items-center gap-2">
          <User className="h-5 w-5 text-purple-500" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col items-center justify-center">
          <div 
            className={`relative w-32 h-32 rounded-full mb-4 transition-all duration-300 ${dragActive ? 'ring-4 ring-purple-400 ring-offset-2' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Avatar className="w-32 h-32 border-2 border-purple-200">
              <AvatarImage src={formData.profileImage} />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-800 text-xl">
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="profile-upload" 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-purple-50 transition-colors"
            >
              <Camera className="h-5 w-5 text-purple-500" />
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handleProfileImageChange}
              />
            </label>
          </div>
          <p className="text-xs text-center text-gray-500 max-w-xs">
            Drag & drop an image or click the camera icon to upload a profile picture
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-purple-500" /> Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="John Doe"
              className="transition-all focus-visible:ring-purple-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-purple-500" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="john@example.com"
              className="transition-all focus-visible:ring-purple-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-purple-500" /> Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="transition-all focus-visible:ring-purple-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-purple-500" /> Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="New York, NY"
              className="transition-all focus-visible:ring-purple-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
