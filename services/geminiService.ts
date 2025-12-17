import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { ImageAttachment } from "../types";

// Initialize the client with the API Key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates or edits an image using Gemini 2.5 Flash Image.
 * 
 * @param prompt The text description or instruction.
 * @param inputImage Optional base64 image data for editing tasks.
 * @param mimeType Optional mime type for the input image.
 */
export const generateOrEditImage = async (
  prompt: string,
  inputImage?: string,
  mimeType?: string
): Promise<{ text: string; images: ImageAttachment[] }> => {
  
  const parts: any[] = [];

  // If there is an input image, add it to the request parts (Image-to-Image / Editing)
  if (inputImage && mimeType) {
    parts.push({
      inlineData: {
        data: inputImage,
        mimeType: mimeType,
      },
    });
  }

  // Add the text prompt
  parts.push({
    text: prompt,
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Specific model for image tasks as per requirements
      contents: {
        parts: parts,
      },
      // Note: responseMimeType and responseSchema are not supported for this model.
    });

    const generatedTextParts: string[] = [];
    const generatedImages: ImageAttachment[] = [];

    // Parse the response candidates
    const candidateContent = response.candidates?.[0]?.content;
    
    if (candidateContent && candidateContent.parts) {
      for (const part of candidateContent.parts) {
        if (part.text) {
          generatedTextParts.push(part.text);
        }
        if (part.inlineData) {
          generatedImages.push({
            mimeType: part.inlineData.mimeType || 'image/png', // Default fallback
            data: part.inlineData.data,
          });
        }
      }
    }

    return {
      text: generatedTextParts.join('\n'),
      images: generatedImages,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
