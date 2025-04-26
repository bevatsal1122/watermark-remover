// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Explicitly mark this route as dynamic to prevent static generation attempts
export const dynamic = 'force-dynamic';

// Initialize the Gemini API with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define available models for image processing
const MODELS = {
  PRIMARY: "gemini-2.0-flash-exp-image-generation",
  FALLBACK: "gemini-2.0-pro-vision"
};

// Define different prompt approaches
const PROMPTS = {
  ENHANCE: "Please enhance this image by restoring it to a clean, professional version. Remove any distracting elements or overlaid text while preserving the original content quality and details.",
  RESTORE: "This image needs restoration to make it look clear and professional. Please clean up the image by removing any visual noise or text elements while maintaining the original content.",
  CREATIVE: "Create a beautiful, clean version of this image that highlights the main subject. Any distracting or unnecessary elements should be removed to improve visual clarity."
};

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

    // Try different approaches in sequence
    const approaches = [
      // First attempt: Primary model with enhance prompt
      { model: MODELS.PRIMARY, prompt: PROMPTS.ENHANCE, config: getPrimaryConfig(0.2) },
      
      // Second attempt: Primary model with restore prompt and higher temperature
      { model: MODELS.PRIMARY, prompt: PROMPTS.RESTORE, config: getPrimaryConfig(0.4) },
      
      // Third attempt: Primary model with creative prompt
      { model: MODELS.PRIMARY, prompt: PROMPTS.CREATIVE, config: getPrimaryConfig(0.6) },
      
      // Fourth attempt: Fallback model with enhance prompt
      { model: MODELS.FALLBACK, prompt: PROMPTS.ENHANCE, config: { temperature: 0.2 } },
      
      // Fifth attempt: Fallback model with restore prompt
      { model: MODELS.FALLBACK, prompt: PROMPTS.RESTORE, config: { temperature: 0.4 } }
    ];

    let lastError = null;

    // Try each approach until one succeeds
    for (const { model, prompt, config } of approaches) {
      try {
        console.log(`Trying model: ${model} with prompt type: ${prompt.substring(0, 20)}...`);
        const response = await generateEnhancedImage(model, prompt, image.type, base64Image, config);
        return response;
      } catch (error) {
        console.error(`Attempt with ${model} failed:`, error);
        lastError = error;
      }
    }

    // If all approaches failed, return the original image and error
    return NextResponse.json(
      { 
        error: "All image enhancement approaches failed", 
        details: lastError instanceof Error ? lastError.message : String(lastError),
        originalImage: `data:${image.type};base64,${base64Image}`
      },
      { status: 422 }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function getPrimaryConfig(temperature: number) {
  return {
    responseModalities: ["Text", "Image"],
    temperature,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 4096,
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };
}

async function generateEnhancedImage(model: string, prompt: string, mimeType: string, base64Image: string, config: any) {
  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      }
    ],
    config,
  });

  // Process the response to extract the image
  let processedImageUrl = "";
  let textResponse = "";
  let finishReason = response.candidates?.[0]?.finishReason || "UNKNOWN";

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

  // If no processed image was generated, throw error to try next approach
  if (!processedImageUrl) {
    console.log(`No processed image from ${model}. Finish reason:`, finishReason);
    console.log("Text response:", textResponse);
    
    throw new Error(`Model ${model} declined to generate image: ${finishReason}`);
  }

  return NextResponse.json({ 
    processedImageUrl,
    textResponse,
    originalImage: `data:${mimeType};base64,${base64Image}`,
    finishReason,
    modelUsed: model,
    promptUsed: prompt.substring(0, 30) + "..."
  });
}