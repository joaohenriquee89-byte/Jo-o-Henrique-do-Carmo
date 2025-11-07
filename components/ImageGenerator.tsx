import React, { useState, useCallback } from 'react';
import { generateImage, DrawingStyle } from '../services/geminiService';
import Spinner from './Spinner';
import PrintButton from './PrintButton';
import ShareButton from './ShareButton';

const styleOptions: { id: DrawingStyle; name: string }[] = [
    { id: 'coloring', name: 'Página de Colorir' },
    { id: 'cute', name: 'Fofo (Kawaii)' },
    { id: 'realistic', name: 'Realista' },
    { id: 'minimalist', name: 'Minimalista' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<DrawingStyle>('coloring');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor, insira uma passagem ou tema bíblico.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const generatedUrl = await generateImage(prompt, style);
      setImageUrl(generatedUrl);
    } catch (err) {
      setError('Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, style]);

  const examplePrompts = [
    "A Arca de Noé com os animais entrando",
    "Davi e Golias",
    "Daniel na cova dos leões",
    "O nascimento de Jesus na manjedoura"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-700">Dê Vida às Histórias Bíblicas</h2>
        <p className="text-slate-600 mt-2">
          Descreva uma cena, personagem ou passagem bíblica, escolha um estilo e nossa IA criará uma arte única.
        </p>
      </div>

      <div className="space-y-6">
        <div>
            <label className="block text-lg font-semibold text-slate-700 mb-3 text-center">1. Escolha um Estilo</label>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {styleOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setStyle(option.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                            style === option.id
                            ? 'bg-cyan-600 text-white shadow'
                            : 'bg-slate-100 text-slate-700 hover:bg-cyan-100'
                        }`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
        
        <div>
            <label className="block text-lg font-semibold text-slate-700 mb-3 text-center">2. Descreva sua Ideia</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: A criação do mundo em 7 dias, Adão e Eva no Jardim do Éden..."
              className="w-full h-28 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm font-medium text-slate-500 self-center">Sugestões:</span>
                {examplePrompts.map((p, i) => (
                    <button key={i} onClick={() => handleExampleClick(p)} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-cyan-100 hover:text-cyan-800 transition-colors duration-200">
                        {p}
                    </button>
                ))}
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform duration-200 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Gerando Imagem...</span>
            </>
          ) : (
            '✨ Gerar Desenho'
          )}
        </button>
      </div>

      {error && <p className="text-red-600 mt-4 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="mt-8">
        {isLoading ? (
          <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center animate-pulse">
            <p className="text-slate-500">Aguarde, a mágica está acontecendo...</p>
          </div>
        ) : imageUrl ? (
          <div className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg">
            <img 
              src={imageUrl} 
              alt={prompt} 
              className="w-full h-auto object-contain rounded-md shadow-md"
            />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrintButton imageUrl={imageUrl} />
              <ShareButton imageUrl={imageUrl} prompt={prompt} />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="o 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-500">Sua imagem aparecerá aqui</h3>
            <p className="text-sm text-slate-400">Pronta para ser colorida e impressa!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;