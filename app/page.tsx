"use client";

import { ImageUpload } from "@/components/image-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Zap,
  Shield,
  Image as ImageIcon,
  Download,
} from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1d1d1d] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gray-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-gray-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto py-14 px-4 relative z-10">
        {/* Hero section */}
        <div className="text-center mb-14 space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-white rounded-full animate-pulse">
              AI-Powered
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-white rounded-full animate-pulse">
              Instant Processing
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-white rounded-full animate-pulse">
              High Resolution Support
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-400 to-white drop-shadow-sm">
            Watermarks Defeated
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Erase watermarks{" "}
            <span className="font-semibold text-white">instantly</span> with our
            cutting-edge AI technology. Upload an image and watch as watermarks
            disappear seamlessly. No technical skills required.
          </p>
        </div>

        {/* Main Upload/Result Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-[0_0_15px_rgba(60,60,60,0.3)] overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-gray-700 pb-4">
              <CardTitle className="text-gray-200 text-2xl text-center">
                Upload Your Image
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Our AI will remove watermarks preventing the best possible quality
          </CardDescription>
        </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="">
          <ImageUpload 
            onUpload={handleImageUpload}
            isLoading={isLoading}
          />
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-[0_0_15px_rgba(60,60,60,0.3)] overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-300 mt-6">
              <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-gray-200 text-2xl">
                  Your Enhanced Image
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Watermark successfully removed
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                <img 
                  src={result} 
                  alt="Processed image" 
                  className="w-full h-auto"
                />
              </div>
                <div className="mt-4 flex justify-center">
                  <a
                    href={result}
                    download="enhanced-image.jpg"
                    className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-md text-gray-200 font-medium hover:opacity-90 transition-opacity border border-gray-700 group flex items-center gap-2"
                  >
                    Download Image{" "}
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </a>
            </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How It Works Section */}
        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-200 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-white">
            How It Works
          </h2>
          <div className="relative flex flex-col items-center">
            {/* Vertical connecting line */}
            <div className="absolute h-full w-1 bg-gradient-to-b from-[#222] to-[#333] left-1/2 transform -translate-x-1/2 z-0 hidden md:block" style={{ top: '3rem', maxHeight: 'calc(100% - 6rem)' }}></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center mb-16 relative z-10 w-full max-w-xl mx-auto">
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  Upload Image
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Upload any image that contains unwanted watermarks. Our system accepts various image formats including JPG, PNG, and WEBP with a maximum size of 10MB.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center mb-16 relative z-10 w-full max-w-xl mx-auto">
  
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  AI Processing
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Our advanced AI identifies and processes the watermark using state-of-the-art computer vision algorithms. The system intelligently analyzes the image to detect watermark patterns.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 w-full max-w-xl mx-auto">
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  Download Result
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Download your clean, watermark-free image instantly. The processed image maintains high quality while effectively removing unwanted watermarks and preserving the original details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
          Examples
        </h2>
        <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4 mb-16">
          {[
            {
              title: "Stock Photo",
              before: "https://placehold.co/300x200/222/444?text=Before",
              after: "https://placehold.co/300x200/222/444?text=After",
            },
            {
              title: "Professional Photography",
              before: "https://placehold.co/300x200/222/444?text=Before",
              after: "https://placehold.co/300x200/222/444?text=After",
            },
            {
              title: "Screen Capture",
              before: "https://placehold.co/300x200/222/444?text=Before",
              after: "https://placehold.co/300x200/222/444?text=After",
            },
          ].map((example, index) => (
            <Card
              key={index}
              className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[350px] max-w-[350px]"
            >
              <CardHeader>
                <CardTitle className="text-gray-200">{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Before</p>
                    <img
                      src={example.before}
                      alt="Before"
                      className="w-full h-auto rounded-md border border-gray-700"
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">After</p>
                    <img
                      src={example.after}
                      alt="After"
                      className="w-full h-auto rounded-md border border-gray-700"
                    />
                  </div>
                </div>
        </CardContent>
      </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-2xl p-10 text-center relative overflow-hidden mb-12">
          <h2 className="text-3xl font-bold text-gray-200 mb-4">
            Ready to remove watermarks?
          </h2>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            Transform your images instantly with our state-of-the-art AI
            technology.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-md text-gray-200 font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-gray-900/30 hover:shadow-xl group flex items-center gap-2 mx-auto"
          >
            Upload an Image{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <footer className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
          <p>
            Powered by Gemini 2.0 Flash Vision | © {new Date().getFullYear()} AI
            Watermark Remover
          </p>
        </footer>
    </main>
    </div>
  );
}
