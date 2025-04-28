"use client";

import { ImageUpload } from "@/components/image-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Image as ImageIcon,
  Download,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

enum ProcessingStage {
  None = "",
  Analyzing = "Analyzing image...",
  Detecting = "Detecting watermarks...",
  Processing = "Processing image...",
  Finalizing = "Finalizing result...",
  Complete = "Complete",
}

const styles = `
@keyframes fadeIn {
  0% { opacity: 0; filter: brightness(0.4); }
  100% { opacity: 1; filter: brightness(1); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<ProcessingStage>(
    ProcessingStage.None
  );
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [processingStartTime, setProcessingStartTime] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (isLoading && !processingStartTime) {
      setProcessingStartTime(Date.now());
      console.log("Starting analyzing stage");
    }
  }, [isLoading, processingStartTime]);

  useEffect(() => {
    if (!processingStartTime) return;

    const interval = setInterval(() => {
      const timeElapsed = Date.now() - processingStartTime;

      const detectingAt = 1500;
      const processingAt = 4000;
      const finalizingAt = 5500;
      const completeAt = 7000;

      if (timeElapsed >= detectingAt && timeElapsed < processingAt) {
        if (currentStage !== ProcessingStage.Detecting) {
          console.log("Setting stage to Detecting");
          setCurrentStage(ProcessingStage.Detecting);
        }
      } else if (timeElapsed >= processingAt && timeElapsed < finalizingAt) {
        if (currentStage !== ProcessingStage.Processing) {
          console.log("Setting stage to Processing");
          setCurrentStage(ProcessingStage.Processing);
        }
      } else if (timeElapsed >= finalizingAt && !result) {
        if (currentStage !== ProcessingStage.Finalizing) {
          console.log("Setting stage to Finalizing");
          setCurrentStage(ProcessingStage.Finalizing);
        }
      }

      if (result || !isLoading) {
        clearInterval(interval);
        setProcessingStartTime(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [processingStartTime, currentStage, result, isLoading]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (
      isLoading &&
      currentStage !== ProcessingStage.None &&
      currentStage !== ProcessingStage.Complete
    ) {
      const targetPercentage =
        currentStage === ProcessingStage.Analyzing
          ? 25
          : currentStage === ProcessingStage.Detecting
          ? 70
          : currentStage === ProcessingStage.Processing
          ? 85
          : currentStage === ProcessingStage.Finalizing
          ? 95
          : 99;

      intervalId = setInterval(() => {
        setProgressPercentage((prev) => {
          if (prev < targetPercentage) {
            return Math.min(prev + 0.5, targetPercentage);
          }
          return prev;
        });
      }, 50);
    } else if (currentStage === ProcessingStage.Complete) {
      setProgressPercentage(100);
    } else if (currentStage === ProcessingStage.None) {
      setProgressPercentage(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading, currentStage]);

  const handleImageUpload = async (image: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setProgressPercentage(0);
      setProcessingStartTime(null);
      setCurrentStage(ProcessingStage.Analyzing);

      const origImgUrl = URL.createObjectURL(image);
      setOriginalImage(origImgUrl);

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/remove-watermark", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || data.details || "Failed to process image"
        );
      }

      setCurrentStage(ProcessingStage.Complete);
      setResult(data.processedImageUrl);
      toast.success("Watermark removed successfully!");
    } catch (error) {
      console.error("Error:", error);
      setCurrentStage(ProcessingStage.None);
      setProgressPercentage(0);
      setProcessingStartTime(null);
      setError(
        error instanceof Error ? error.message : "Failed to process image"
      );
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ProcessingIndicator = () => (
    <div className="flex flex-col items-center justify-center p-8 pt-2 space-y-3 select-none">
      <div className="text-center">
        <h3 className="font-medium text-gray-200 text-lg mb-2 select-none">
          {currentStage}
        </h3>
        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-gray-500 to-gray-400 h-full rounded-full"
            style={{
              width: `${progressPercentage}%`,
              transition: "width 300ms ease-out",
            }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 select-none">
          Please wait while we remove the watermarks...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1d1d1d] relative overflow-hidden">
      <style jsx global>
        {styles}
      </style>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gray-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-gray-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto py-14 px-4 relative z-10">
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

        <div className="mb-16 max-w-4xl mx-auto">
          {!originalImage ? (
            <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] overflow-hidden backdrop-blur-sm transition-all duration-300">
              <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-gray-200 text-2xl text-center">
                  Upload Your Image
                </CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Our AI will remove watermarks preventing the best possible
                  quality
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
          ) : (
            <Card className="border-0 bg-gradient-to-b from-[#181818] to-[#232323] shadow-[0_0_15px_rgba(60,60,60,0.3)] overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-gray-200 text-2xl">
                  {isLoading || !result
                    ? "Processing Your Image"
                    : "Your Enhanced Image"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isLoading || !result
                    ? "Please wait while we remove watermarks"
                    : "Watermark successfully removed. *AI can make mistakes"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 min-h-[400px]">
                  <div className="md:w-[50%] rounded-lg overflow-hidden border border-gray-700 shadow-lg flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={originalImage!}
                        alt="Original image"
                        className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800/80 text-xs text-gray-200 rounded">
                        Original
                      </div>
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div className="md:w-[50%] rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="">
                          <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                          {currentStage === ProcessingStage.Complete && (
                            <CheckCircle2 className="w-12 h-12 text-green-500 absolute top-0 left-0 animate-slide-in" />
                          )}
                        </div>
                        <ProcessingIndicator />
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 w-full">
                          <h3 className="text-red-400 font-medium mb-2">
                            Processing Failed
                          </h3>
                          <p className="text-red-300 text-sm">
                            Model failed to remove watermarks. Please try again.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setError(null);
                            setProgressPercentage(0);
                            if (originalImage) {
                              fetch(originalImage)
                                .then((res) => res.blob())
                                .then((blob) => {
                                  const file = new File([blob], "image.jpg", {
                                    type: "image/jpeg",
                                  });
                                  handleImageUpload(file);
                                });
                            }
                          }}
                          className="mt-4 px-4 py-2 bg-gray-700 rounded-md text-gray-200 font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center gap-2"
                        >
                          Try Again <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : !result ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                          <Loader2 className="w-10 h-10 text-gray-400 animate-spin mx-auto mb-4" />
                          <p className="text-gray-300">
                            Please wait, finishing up...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full flex items-center justify-center">
                        <img
                          src={result}
                          alt="Processed image"
                          className="max-w-full max-h-full w-auto h-auto object-contain select-none animate-fade-in"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800/80 text-xs text-gray-200 rounded">
                          Enhanced
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setResult(null);
                      setOriginalImage(null);
                      setCurrentStage(ProcessingStage.None);
                    }}
                    className="px-4 py-2 bg-gray-700 rounded-md text-gray-200 font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center gap-2"
                  >
                    Upload New Image <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (originalImage) {
                        fetch(originalImage)
                          .then((res) => res.blob())
                          .then((blob) => {
                            const file = new File([blob], "image.jpg", {
                              type: "image/jpeg",
                            });
                            setResult(null);
                            setProgressPercentage(0);
                            handleImageUpload(file);
                          })
                          .catch((err) => {
                            console.error("Error retrying:", err);
                            toast.error(
                              "Failed to retry. Please upload again."
                            );
                          });
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 rounded-md text-gray-200 font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center gap-2"
                  >
                    Try Again <ArrowRight className="w-4 h-4" />
                  </button>
                  {result && (
                    <a
                      href={result}
                      download="enhanced-image.jpg"
                      className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-md text-gray-200 font-medium hover:opacity-90 transition-opacity border border-gray-700 group flex items-center gap-2"
                    >
                      Download Enhanced Image{" "}
                      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-200 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-white">
            How It Works
          </h2>
          <div className="relative flex flex-col items-center">
            <div
              className="absolute h-full w-1 bg-gradient-to-b from-[#222] to-[#333] left-1/2 transform -translate-x-1/2 z-0 hidden md:block"
              style={{ top: "3rem", maxHeight: "calc(100% - 6rem)" }}
            ></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center mb-16 relative z-10 w-full max-w-xl mx-auto">
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  Upload Image
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Upload any image that contains unwanted watermarks. Our system
                  accepts various image formats including JPG, PNG, and WEBP
                  with a maximum size of 10MB.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-16 relative z-10 w-full max-w-xl mx-auto">
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  AI Processing
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Our advanced AI identifies and processes the watermark using
                  state-of-the-art computer vision algorithms. The system
                  intelligently analyzes the image to detect watermark patterns.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center relative z-10 w-full max-w-xl mx-auto">
              <div className="w-full p-6 bg-[#121212]/80 rounded-2xl border border-gray-800 hover:bg-[#151515] transition-all duration-300">
                <h3 className="text-gray-100 font-medium text-xl mb-3">
                  Download Result
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Download your clean, watermark-free image instantly. The
                  processed image maintains high quality while effectively
                  removing unwanted watermarks and preserving the original
                  details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-2xl p-10 text-center relative overflow-hidden mb-12">
          <h2 className="text-3xl font-bold text-gray-200 mb-4">
            Ready to remove watermarks?
          </h2>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            Transform your images instantly with our state-of-the-art AI
            technology.
          </p>
          <button
            onClick={() => {
              setResult(null);
              setOriginalImage(null);
              setCurrentStage(ProcessingStage.None);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-md text-gray-200 font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-gray-900/30 hover:shadow-xl group flex items-center gap-2 mx-auto"
          >
            Upload an Image{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <footer className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
          <p>
            Developed by{" "}
            <Link
              href="https://x.com/bevatsal1122"
              target="_blank"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Vatsal
            </Link>{" "}
            and{" "}
            <Link
              href="https://x.com/ameeetgaikwad"
              target="_blank"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Amit
            </Link>{" "}
            | ClearMark © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
