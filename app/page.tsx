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
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
            How It Works
          </h2>
          <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-[0_0_15px_rgba(60,60,60,0.3)] overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-4 bg-gray-800/20 rounded-lg">
                  <div className="bg-gray-700 p-3 rounded-full mb-4">
                    <span className="text-gray-300 font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-gray-200 font-medium mb-2">
                    Upload Image
                  </h3>
                  <p className="text-gray-400">
                    Upload any image that contains unwanted watermarks
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-800/20 rounded-lg">
                  <div className="bg-gray-700 p-3 rounded-full mb-4">
                    <span className="text-gray-300 font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-gray-200 font-medium mb-2">
                    AI Processing
                  </h3>
                  <p className="text-gray-400">
                    Our advanced AI identifies and processes the watermark
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-800/20 rounded-lg">
                  <div className="bg-gray-700 p-3 rounded-full mb-4">
                    <span className="text-gray-300 font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-gray-200 font-medium mb-2">
                    Download Result
                  </h3>
                  <p className="text-gray-400">
                    Download your clean, watermark-free image instantly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {[
            {
              icon: <Zap className="h-6 w-6 text-gray-300" />,
              title: "AI-Powered Removal",
              description:
                "Advanced neural networks precisely identify and erase watermarks while preserving image quality",
            },
            {
              icon: <ArrowRight className="h-6 w-6 text-gray-300" />,
              title: "Instant Processing",
              description:
                "Get results in seconds with our optimized cloud processing pipeline",
            },
            {
              icon: <ImageIcon className="h-6 w-6 text-gray-300" />,
              title: "High Resolution Support",
              description:
                "Process images up to 4K resolution with consistent quality results",
            },
            {
              icon: <Shield className="h-6 w-6 text-gray-300" />,
              title: "Secure & Private",
              description:
                "Your uploads are processed securely and deleted after processing",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-gray-700/70 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="text-gray-200">{feature.title}</CardTitle>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
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

        {/* Technology Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
            Powered By
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#181818]/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-100">
                  Gemini
                </span>
              </div>
              <span className="text-sm text-gray-400">AI Model</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#181818]/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-100">
                  Next.js
                </span>
              </div>
              <span className="text-sm text-gray-400">Framework</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#181818]/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-100">
                  Tailwind
                </span>
              </div>
              <span className="text-sm text-gray-400">Styling</span>
            </div>
          </div>
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
