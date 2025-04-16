
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Camera, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
  const [includePhoto, setIncludePhoto] = useState(!!formData.profileImage);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange("profileImage", e.target?.result as string);
        setIncludePhoto(true);
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
        setIncludePhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    onChange("profileImage", "");
    setIncludePhoto(false);
  };

  const toggleIncludePhoto = () => {
    if (includePhoto) {
      // If turning off, clear the image
      onChange("profileImage", "");
      setIncludePhoto(false);
    } else {
      // Just enable the option, but don't set an image yet
      setIncludePhoto(true);
    }
  };

  return (
    <Card className="w-full border border-blue-200/50 dark:border-blue-800/50 shadow-lg transition-all hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-t-lg">
        <CardTitle className="text-gradient font-heading flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Switch 
              id="include-photo" 
              checked={includePhoto}
              onCheckedChange={toggleIncludePhoto}
            />
            <Label htmlFor="include-photo" className="text-sm cursor-pointer">
              Include Profile Photo
            </Label>
          </div>
          {formData.profileImage && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeProfileImage}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove Photo
            </Button>
          )}
        </div>

        {includePhoto && (
          <div className="flex flex-col items-center justify-center">
            <div 
              className={`relative w-32 h-32 rounded-full mb-4 transition-all duration-300 ${dragActive ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Avatar className="w-32 h-32 border-2 border-blue-200 dark:border-blue-700">
                <AvatarImage src={formData.profileImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 text-xl">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-xs">
              Drag & drop an image or click the camera icon to upload a profile picture
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="John Doe"
              className="transition-all focus-visible:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="john@example.com"
              className="transition-all focus-visible:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="transition-all focus-visible:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="New York, NY"
              className="transition-all focus-visible:ring-blue-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
