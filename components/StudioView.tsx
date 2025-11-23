import React, { useState } from 'react';
import { generateArtExample } from '../services/geminiService';
import { LoadingState } from '../types';

const StudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setGeneratedImage(null);
    
    try {
      const imgData = await generateArtExample(prompt);
      setGeneratedImage(imgData);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const presetPrompts = [
    "Hayvan hücresi ve organelleri modeli",
    "Güneş sistemi gezegenler sıralaması",
    "Basit bir elektrik devresi şeması",
    "Işığın prizmada kırılması",
    "DNA sarmal yapısı"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* Control Panel */}
        <div className="w-full md:w-1/3 p-8 bg-gray-50 border-r border-gray-100">
            <h2 className="text-2xl font-bold text-blue-600 font-handwritten mb-4">Görsel Laboratuvar 🧪</h2>
            <p className="text-gray-600 text-sm mb-6">
                Görmek istediğin bilimsel kavramı veya deneyi tarif et, yapay zeka senin için görselleştirsin.
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ne incelemek istersin?</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none h-32"
                        placeholder="Örn: Fotosentez yapan bir bitki yaprağı kesiti..."
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loadingState === LoadingState.LOADING || !prompt.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                        loadingState === LoadingState.LOADING || !prompt.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-1'
                    }`}
                >
                    {loadingState === LoadingState.LOADING ? 'Hazırlanıyor...' : 'Görseli Oluştur 🔬'}
                </button>
            </form>

            <div className="mt-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Hızlı Deneyler</p>
                <div className="flex flex-wrap gap-2">
                    {presetPrompts.map((p, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPrompt(p)}
                            className="text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors text-left"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Canvas / Result Area */}
        <div className="w-full md:w-2/3 p-8 bg-slate-100 flex items-center justify-center relative">
            {loadingState === LoadingState.IDLE && (
                <div className="text-center text-gray-400">
                    <span className="text-6xl block mb-4 opacity-50">⚗️</span>
                    <p>Bir bilimsel görsel oluşturmak için sol paneli kullan.</p>
                </div>
            )}

            {loadingState === LoadingState.LOADING && (
                <div className="text-center">
                    <div className="inline-block animate-bounce text-6xl mb-4">🧬</div>
                    <p className="text-blue-600 font-medium animate-pulse">Veriler işleniyor...</p>
                </div>
            )}

            {loadingState === LoadingState.ERROR && (
                <div className="text-center text-red-400">
                    <span className="text-4xl block mb-2">😕</span>
                    <p>Görsel oluşturulamadı. Lütfen farklı bir tarif dene.</p>
                </div>
            )}

            {loadingState === LoadingState.SUCCESS && generatedImage && (
                <div className="relative group">
                    <div className="bg-white p-4 rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105">
                        <img 
                            src={generatedImage} 
                            alt="Scientific Illustration" 
                            className="rounded-lg max-h-[500px] object-contain border border-gray-100"
                        />
                        <div className="mt-2 text-center text-gray-500 text-sm font-handwritten">
                            "{prompt}"
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudioView;