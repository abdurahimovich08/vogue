
import { GoogleGenAI, Type } from "@google/genai";
import { Product, UserMeasurements, ClothingSize, GenerationConfig, ModelVibe, ProductCategory } from "../types";
import { sanitizeInput } from "./security";

// Centralized AI client getter with error handling
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing via process.env.API_KEY");
    throw new Error("Tizim sozlanmagan: API Kaliti topilmadi (Vercel Environment Variables).");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * MASTER PHOTOGRAPHER GUIDELINES:
 * 1. Never change the garment's shape, color, or texture.
 * 2. Create a "miracle" around it using lighting and atmosphere.
 * 3. Use global illumination and ray-traced shadow effects.
 */
const MIRACLE_PROMPT = `Sen dunyoga mashhur fashion-fotograf va dizaynersan. 
Sening vazifang - yuklangan kiyim rasmiga tegmagan holda, uni professional kampaniya darajasiga ko'tarish. 
Kiyimning detallari, materiali va rangi 100% original saqlanishi shart. 
Lekin uning atrofida mo'jizaviy muhit yarat: 
- Cinematic lighting (Rim lighting, Rembrandt lighting)
- High-end textures for the background (Polished marble, silk drapes, or minimalist concrete)
- Depth of field (bokeh effect)
- Professional color grading that makes customers desire the product.`;

export const analyzeProductImage = async (base64: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: `${MIRACLE_PROMPT} Ushbu kiyimni tahlil qil va uning premium atributlarini aniqla. JSON qaytar.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          material: { type: Type.STRING },
          suggestedPrice: { type: Type.NUMBER },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          attributes: {
            type: Type.OBJECT,
            properties: {
              color: { type: Type.STRING },
              season: { type: Type.STRING },
              gender: { type: Type.STRING },
              sizes: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "{}");
  return {
    ...rawData,
    name: sanitizeInput(rawData.name || "Couture Piece"),
    category: (rawData.category || 'Tops') as ProductCategory
  };
};

export const generateProfessionalShot = async (base64: string, productName: string, vibe: string = "High-End Studio"): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: `Create a "Miracle Shot" for this item. 
                 DO NOT ALTER THE GARMENT. Preserve every thread and color.
                 ENVIRONMENT: ${vibe}. Focus on lighting that emphasizes the material quality.
                 Make it look like a cover of Vogue or Harper's Bazaar. 
                 Ray-traced shadows, premium reflections, 8k professional studio photography.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Designer generation failed");
};

export const virtualTryOn = async (productUrl: string, personBase64: string, measurements: UserMeasurements, size: ClothingSize): Promise<string> => {
  const ai = getAI();
  const productData = productUrl.includes('base64,') ? productUrl.split(',')[1] : productUrl;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: productData, mimeType: 'image/png' } },
        { inlineData: { data: personBase64.split(',')[1], mimeType: 'image/png' } },
        { text: `Luxury Fitting Room. Photorealistically fit this specific item on the person. 
                 Body stats: ${measurements.bodyType}, ${measurements.height}cm. 
                 Lighting must match between person and garment for 100% realism.` }
      ]
    }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Miracle try-on failed");
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Full address for lat ${latitude}, lng ${longitude}. Concise string only.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude, longitude }
        }
      }
    },
  });
  return response.text?.trim() || "Elite Boutique Location";
};

export const generateModelShot = async (
  clothBase64: string, 
  config: GenerationConfig, 
  isHighQuality: boolean, 
  personBase64?: string
): Promise<string> => {
  const ai = getAI();
  const model = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const parts: any[] = [
    { inlineData: { data: clothBase64.split(',')[1], mimeType: 'image/png' } }
  ];

  if (personBase64) {
    parts.push({ inlineData: { data: personBase64.split(',')[1], mimeType: 'image/png' } });
  }

  const prompt = personBase64 
    ? `Masterpiece Try-On. Composite this authentic piece onto the user. Match environmental lighting perfectly. High-fashion retouching.`
    : `Elite Editorial Shoot. A ${config.gender} supermodel wearing this exact clothing. Atmosphere: ${config.vibe}. Lighting: ${config.lighting}. Cinematic depth, luxury brand look.`;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: isHighQuality ? "2K" : "1K"
      }
    }
  });

  for (const candidate of response.candidates || []) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("High-end generation failed");
};
