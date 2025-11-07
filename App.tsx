
import React from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <ImageGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
