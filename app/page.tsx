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
    <div className="min-h-screen relative overflow-hidden">
      {/* Video background */}
      <video
        src="/Chevrons-moving-down-3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#222222]/70 to-[#303030]/70" />

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
          <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] overflow-hidden backdrop-blur-sm transition-all duration-300">
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
        <div className="mb-20 max-w-3xl mx-auto relative">
          {/* Background gradient & blurred shapes */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#252525] to-[#333333] rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-1/2 w-64 h-64 bg-[#333]/30 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-[#444]/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative py-16 px-8">
            <h2 className="text-4xl font-bold text-gray-200 mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-300 to-white animate-pulse">
              How It Works
            </h2>
            <div className="flex flex-col items-center space-y-12">
              {/* Step 1 */}
              <div className="w-full max-w-xl p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-transform transform hover:scale-105 duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-b from-[#222] to-[#333] p-4 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <span className="text-gray-100 text-lg font-bold">1</span>
                  </div>
                  <h3 className="text-gray-100 font-medium text-xl">
                    Upload Image
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Upload any image that contains unwanted watermarks. Supports JPG, PNG, and WEBP up to 10MB.
                </p>
              </div>
              {/* Step 2 */}
              <div className="w-full max-w-xl p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-transform transform hover:scale-105 duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-b from-[#222] to-[#333] p-4 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <span className="text-gray-100 text-lg font-bold">2</span>
                  </div>
                  <h3 className="text-gray-100 font-medium text-xl">
                    AI Processing
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Our AI analyzes and removes watermarks with precision, preserving the original quality.
                </p>
              </div>
              {/* Step 3 */}
              <div className="w-full max-w-xl p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-transform transform hover:scale-105 duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-b from-[#222] to-[#333] p-4 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    <span className="text-gray-100 text-lg font-bold">3</span>
                  </div>
                  <h3 className="text-gray-100 font-medium text-xl">
                    Download Result
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Download your watermark-free image instantly, with no loss in detail or resolution.
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
