import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export type DrawingStyle = 'coloring' | 'cute' | 'realistic' | 'minimalist';

const getStylePrompt = (userPrompt: string, style: DrawingStyle): string => {
    switch (style) {
        case 'cute':
            return `Crie uma ilustração digital colorida e vibrante no estilo 'fofo' (kawaii), ideal para crianças. A cena deve ter personagens com olhos grandes, bochechas rosadas e formas arredondadas. O cenário deve ser alegre e simples, com cores vivas. A cena deve ilustrar o seguinte tema bíblico: "${userPrompt}".`;
        case 'realistic':
            return `Crie uma ilustração digital com um estilo 'realista' e artístico, quase como uma pintura clássica. A iluminação deve ser dramática, com sombras bem definidas para criar profundidade. As texturas (tecidos, pele, cenários) devem ser detalhadas. As expressões dos personagens devem ser emotivas e convincentes. A cena deve retratar a seguinte passagem bíblica: "${userPrompt}".`;
        case 'minimalist':
            return `Crie uma ilustração vetorial 'minimalista' e moderna. Use linhas limpas, formas geométricas simples e uma paleta de cores limitada (2-3 cores harmoniosas). O foco deve ser no simbolismo e na clareza da mensagem, com bastante espaço negativo para um visual clean. A ilustração deve representar o seguinte conceito bíblico: "${userPrompt}".`;
        case 'coloring':
        default:
            return `Crie uma página de livro de colorir em preto e branco, bonita, limpa e profissional para crianças. O estilo deve ser minimalista, fofo e amigável, com contornos bem definidos e espessos. A cena deve ilustrar a seguinte história ou tema bíblico: "${userPrompt}". As linhas devem ser claras, nítidas e bem definidas, perfeitas para colorir. Evite sombreamento, texturas complexas ou tons de cinza. A imagem deve ser estritamente em preto e branco. A composição deve ser simples e focada nos personagens ou na cena principal, adequada para crianças pequenas.`;
    }
}


export const generateImage = async (userPrompt: string, style: DrawingStyle = 'coloring'): Promise<string> => {
  
  const fullPrompt = getStylePrompt(userPrompt, style);

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          // A4-like aspect ratio, good for printing
          aspectRatio: '3:4', 
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Nenhuma imagem foi gerada pela API.");
    }

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Falha na comunicação com o serviço de geração de imagem.");
  }
};