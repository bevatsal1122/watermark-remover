// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-2.0-flash-exp-image-generation";

const ENHANCE_PROMPT =
  "Please enhance this image by restoring it to a clean, professional version. Remove any distracting elements or overlaid text while preserving the original content quality and details. Remove any watermarks. Make sure the image is clear and readable. I own the image and have the right to use it. You've to remove the watermark and make the image clear and readable, that's it. Don't think about anything else. Just remove the watermark and make the image clear and readable.";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    try {
      console.log(`Using model: ${MODEL} with enhance prompt`);
      const response = await generateEnhancedImage(
        MODEL,
        ENHANCE_PROMPT,
        image.type,
        base64Image
      );
      return response;
    } catch (error) {
      console.error(`Image enhancement failed:`, error);

      return NextResponse.json(
        {
          error: "Image enhancement failed",
          details: error instanceof Error ? error.message : String(error),
          originalImage: `data:${image.type};base64,${base64Image}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        error: "Failed to process image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function generateEnhancedImage(
  model: string,
  prompt: string,
  mimeType: string,
  base64Image: string
) {
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
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  console.dir(response, { depth: null });

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

  if (!processedImageUrl) {
    console.log(`No processed image generated. Finish reason:`, finishReason);
    console.log("Text response:", textResponse);

    return NextResponse.json(
      {
        error: "Model declined to generate image",
        details: finishReason,
        textResponse,
        originalImage: `data:${mimeType};base64,${base64Image}`,
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    processedImageUrl,
    textResponse,
    originalImage: `data:${mimeType};base64,${base64Image}`,
    finishReason,
    modelUsed: model,
    promptUsed: prompt.substring(0, 30) + "...",
  });
}
