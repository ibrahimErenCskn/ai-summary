import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// The API key should be stored in an environment variable
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Initialize the Gemini API
export const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Function to generate a summary of the text
export async function generateSummary(
  text: string, 
  length: 'short' | 'medium' | 'long' = 'medium',
  detailLevel: 'low' | 'medium' | 'high' = 'medium'
): Promise<string> {
  try {
    const prompt = `
    Aşağıdaki metni özetleyin.
    Uzunluk: ${length} (kısa: 1-2 paragraf, orta: 3-4 paragraf, uzun: 5+ paragraf)
    Ayrıntı düzeyi: ${detailLevel} (düşük: yalnızca ana noktalar, orta: önemli ayrıntılar, yüksek: kapsamlı)
    
    Özetlenecek metin:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Failed to generate summary. Please try again.';
  }
}

// Function to generate a title suggestion based on the text
export async function generateTitleSuggestion(text: string): Promise<string> {
  try {
    const prompt = `
      Aşağıdaki metin için özlü ve açıklayıcı bir başlık oluşturun.
    Başlık en fazla 10 kelime olmalı ve ana konuyu kapsamalıdır.
      
      Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating title suggestion:', error);
    return 'Untitled Note';
  }
} 