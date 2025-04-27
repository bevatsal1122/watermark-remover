"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Loader2, UploadIcon } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleButtonClick = () => {
    // Trigger file input click when button is clicked
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer border-gray-700 hover:border-gray-600 bg-[#1a1a24] hover:bg-[#1f1f2c] p-6"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 object-contain mb-4"
              />
            ) : (
              <>
                <div className="w-20 h-20 mb-4 rounded-full bg-[#2d2b41] flex items-center justify-center">
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#b67cff]"
                  >
                    <path 
                      d="M12 16V8M12 8L8 12M12 8L16 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium text-white mb-2">
                  Drop Your Image Here
                </p>
                <p className="text-gray-400 mb-4">
                  Support JPG, PNG, WEBP files
                </p>
                <Button 
                  className="bg-[#b67cff] hover:bg-[#a56cf0] text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick();
                  }}
                  disabled={isLoading}
                >
                  Choose Image
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Maximum size: 10MB
                </p>
              </>
            )}
          </div>
          <Input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
            ref={fileInputRef}
          />
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#b67cff]" />
          <p className="text-sm text-gray-400">
            Processing image...
          </p>
        </div>
      )}
    </div>
  );
}