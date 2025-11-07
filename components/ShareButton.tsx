import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';

interface ShareButtonProps {
  imageUrl: string;
  prompt: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ imageUrl, prompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');
  const [downloadSize, setDownloadSize] = useState<'original' | 'a4' | 'a5'>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const shareText = `Veja a arte bíblica que criei sobre "${prompt}" com este incrível gerador de imagens!`;
  const appUrl = window.location.href;

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}`,
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imageUrl;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Failed to get canvas context");
                setIsDownloading(false);
                return;
            }

            let targetWidth = image.width;
            let targetHeight = image.height;

            if (downloadSize === 'a4') {
                targetWidth = 2480; // A4 width for 300 DPI
                targetHeight = (image.height / image.width) * targetWidth;
            } else if (downloadSize === 'a5') {
                targetWidth = 1748; // A5 width for 300 DPI
                targetHeight = (image.height / image.width) * targetWidth;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            if (downloadFormat === 'jpeg') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL(`image/${downloadFormat}`, downloadFormat === 'jpeg' ? 0.95 : undefined);
            
            const link = document.createElement('a');
            link.href = dataUrl;
            const fileName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
            link.download = `desenho_biblico_${fileName || 'arte'}.${downloadFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setIsOpen(false);
            setIsDownloading(false);
        };

        image.onerror = () => {
            console.error("Failed to load image for processing.");
            setIsDownloading(false);
        };

    } catch (err) {
      console.error("Error processing image for download:", err);
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform duration-200 transform hover:scale-105"
      >
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Compartilhar
      </button>

      {isOpen && (
        <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform opacity-100 scale-100" role="menu" aria-orientation="vertical">
          <div className="py-1" role="none">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-700 block px-4 py-2 text-sm hover:bg-slate-100" role="menuitem">Compartilhar no Facebook</a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-700 block px-4 py-2 text-sm hover:bg-slate-100" role="menuitem">Compartilhar no Twitter</a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-slate-700 block px-4 py-2 text-sm hover:bg-slate-100" role="menuitem">Enviar por WhatsApp</a>
          </div>
          <div className="border-t border-slate-200"></div>
          <div className="p-4 space-y-4">
            <fieldset>
                <legend className="text-sm font-semibold text-slate-800 mb-2">Opções de Download</legend>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Formato:</label>
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => setDownloadFormat('png')} className={`text-xs px-3 py-1 rounded-full ${downloadFormat === 'png' ? 'bg-cyan-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>PNG</button>
                            <button onClick={() => setDownloadFormat('jpeg')} className={`text-xs px-3 py-1 rounded-full ${downloadFormat === 'jpeg' ? 'bg-cyan-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>JPG</button>
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-slate-600">Tamanho:</label>
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => setDownloadSize('original')} className={`text-xs px-3 py-1 rounded-full ${downloadSize === 'original' ? 'bg-cyan-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Original</button>
                            <button onClick={() => setDownloadSize('a4')} className={`text-xs px-3 py-1 rounded-full ${downloadSize === 'a4' ? 'bg-cyan-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>A4</button>
                            <button onClick={() => setDownloadSize('a5')} className={`text-xs px-3 py-1 rounded-full ${downloadSize === 'a5' ? 'bg-cyan-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>A5</button>
                        </div>
                    </div>
                </div>
            </fieldset>
            <button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="w-full text-center flex items-center justify-center bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 disabled:bg-slate-400" 
              role="menuitem"
            >
              {isDownloading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Processando...</span>
                </>
              ) : (
                'Baixar Imagem'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
