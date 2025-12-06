
import React, { useState } from 'react';

const PdfView: React.FC = () => {
  const [activeBook, setActiveBook] = useState<{title: string, link: string} | null>(null);

  const books = [
    {
      title: 'Fen Bilimleri',
      link: 'https://drive.google.com/file/d/1bfEGxTd40ovIJQ4k1Cfy5gZ1nIZDw0ul/view?usp=sharing',
      icon: '🧬',
      color: 'bg-teal-100 text-teal-700 border-teal-200'
    },
    {
      title: 'Matematik',
      link: 'https://drive.google.com/file/d/1gAYQ6jc5LAOtBrXuX9uEjgZHtvm4f9ja/view?usp=sharing',
      icon: '📐',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      title: 'Matematik Defter Kitap',
      link: 'https://www.cantadaakillitahta.com/zkitapx.php?code=M0JCR0xDQkg=',
      icon: '📓',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    },
    {
      title: 'Sosyal Bilgiler',
      link: 'https://drive.google.com/file/d/1ZXLFKYWIPVkuYtbVAu7z7SDxU-2utS0L/view?usp=sharing',
      icon: '🌍',
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      title: 'İngilizce',
      link: 'https://drive.google.com/file/d/1E1mEtww6UXeRRtYT6gdlDgYecGZBQpjb/view?usp=sharing',
      icon: '📘',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    },
    {
      title: 'More & More English',
      link: 'https://kurmayzkitap.frns.in/zkitapx.php?code=S0FBUEIxQUo=&openBookId=421',
      icon: '🦁',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      title: 'Din Kültürü',
      link: 'https://drive.google.com/file/d/1iiDXemlzK1H7anTo9PukaiEcHPHxNj_h/view?usp=sharing',
      icon: '🕌',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Temel Dini Bilgiler (TDB)',
      link: 'https://drive.google.com/file/d/1R9E1Ro2GtobAo5hr6H3TZbSQe5bLyyhx/view?usp=sharing',
      icon: '🌙',
      color: 'bg-violet-100 text-violet-700 border-violet-200'
    },
    {
      title: 'Arapça',
      link: 'https://drive.google.com/file/d/1R5QECdLeNQXQLOpivrOopYdtoUM7Ka5J/view?usp=sharing',
      icon: '📖',
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      title: 'Peygamberimizin Hayatı (Siyer)',
      link: 'https://drive.google.com/file/d/1BQMPl6aS9a9odMyNaLuexgS3ZWmleJkD/view?usp=sharing',
      icon: '🌹',
      color: 'bg-pink-100 text-pink-700 border-pink-200'
    }
  ];

  // Helper to convert Google Drive view links to preview links for embedding
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com') && url.includes('/view')) {
      return url.replace(/\/view.*/, '/preview');
    }
    return url;
  };

  if (activeBook) {
    return (
      // Fixed overlay to cover the main app container. 
      // top-16 ensures it starts right below the sticky header.
      // bg-black ensures the background around the book is black.
      <div className="fixed inset-0 top-16 z-40 bg-black flex flex-col animate-fade-in">
        
        {/* Dark Toolbar */}
        <div className="bg-black border-b border-gray-800 p-3 px-4 flex justify-between items-center shadow-md shrink-0 h-14">
           <button 
             onClick={() => setActiveBook(null)}
             className="flex items-center text-gray-300 hover:text-white font-bold transition-colors bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-sm"
           >
             &larr; Kütüphaneye Dön
           </button>
           <h3 className="text-gray-200 font-medium tracking-wide hidden sm:block">{activeBook.title}</h3>
           <div className="w-32 hidden sm:block"></div> {/* Spacer for centering */}
        </div>
        
        {/* Full Height PDF Container */}
        <div className="flex-1 relative w-full h-full bg-black">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-0">
                <span className="animate-pulse">Sayfalar Yükleniyor...</span>
            </div>
            <iframe 
              src={getEmbedUrl(activeBook.link)} 
              title={activeBook.title}
              className="w-full h-full relative z-10 bg-white" // Content is white
              allow="autoplay"
              frameBorder="0"
            ></iframe>
        </div>
      </div>
    );
  }

  // Library List View (Remains white/styled as per theme)
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up pb-12">
      <div className="text-center mb-10 mt-4">
        <h2 className="text-4xl font-bold text-gray-800 font-handwritten mb-4">
          Dijital Kütüphane 📄
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ders kitaplarına buradan ulaşabilir ve istediğin zaman inceleyebilirsin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {books.map((book, index) => (
          <div 
            key={index}
            className={`relative rounded-3xl p-6 border-b-4 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-xl bg-white ${book.color.split(' ')[2]}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${book.color}`}>
              {book.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{book.title}</h3>
            <p className="text-gray-500 text-sm mb-6">7. Sınıf Kaynak Kitap</p>
            
            <button 
              onClick={() => setActiveBook(book)}
              className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${book.color} hover:shadow-md active:scale-95`}
            >
              Kitabı Aç 📖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfView;
