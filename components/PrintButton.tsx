
import React from 'react';

interface PrintButtonProps {
  imageUrl: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ imageUrl }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Desenho</title>
            <style>
              @page { size: A4; margin: 20mm; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" onload="window.print(); setTimeout(function(){window.close();}, 100);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
    >
      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3h10V4H5zm10 5H5a2 2 0 00-2 2v4h14v-4a2 2 0 00-2-2zM5 13v4h10v-4H5z" clipRule="evenodd" />
        <path d="M15 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-1 2H6v3h8V4z"/>
      </svg>
      Imprimir ou Salvar como PDF
    </button>
  );
};

export default PrintButton;
