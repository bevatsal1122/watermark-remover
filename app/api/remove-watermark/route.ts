// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Explicitly mark this route as dynamic to prevent static generation attempts
export const dynamic = 'force-dynamic';

// Initialize the Gemini API with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Create prompt to remove watermark
    const prompt = "Remove the watermark from this image while preserving the original image quality and details.";

    // Use the model to generate a new image without watermark
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: image.type,
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Process the response to extract the image
    let processedImageUrl = "";
    let textResponse = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          processedImageUrl = `data:${part.inlineData.mimeType};base64,${imageData}`;
        }
      }
    }

    return NextResponse.json({ 
      processedImageUrl,
      textResponse,
      originalImage: `data:${image.type};base64,${base64Image}`
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}