"use client";

import { ImageUpload } from "@/components/image-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImageUpload = async (image: File) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/remove-watermark", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.processedImageUrl);
      toast.success("Watermark removed successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Watermark Removal</CardTitle>
          <CardDescription>
            Upload an image and our AI will remove watermarks using Gemini 2.0 Flash Vision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload 
            onUpload={handleImageUpload}
            isLoading={isLoading}
          />
          
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Result</h3>
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={result} 
                  alt="Processed image" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}