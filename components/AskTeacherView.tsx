
import React, { useState } from 'react';
import { Subject, LoadingState } from '../types';
import { askTeacher } from '../services/geminiService';
import { SUBJECTS } from '../constants';

// Reusing the formatting helper
const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Updated to use "dark black" (font-black, text-black) for emphasized answers
        return <strong key={index} className="text-black font-black">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={index} className="font-serif italic px-1 mx-0.5 bg-slate-100 rounded text-slate-900 inline-block border border-slate-200">
            {part.slice(1, -1)}
          </span>
        );
      } else {
        return part;
      }
    });
};

const AskTeacherView: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(SUBJECTS[0].id);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const selectedSubject = SUBJECTS.find(s => s.id === selectedSubjectId) || SUBJECTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setAnswer(null);

    try {
      const response = await askTeacher(question, selectedSubject.title);
      setAnswer(response);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* Left Panel: Input */}
        <div className="w-full md:w-1/3 p-8 bg-gray-50 border-r border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-pink-600 font-handwritten mb-2">Yapay Zekaya Sor 🤖</h2>
            <p className="text-gray-600 text-sm mb-6">
                Aklına takılan soruyu sor, Yapay Zeka asistanın hemen cevaplasın.
            </p>

            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Hangi Ders?</label>
                <div className="grid grid-cols-1 gap-2">
                    {SUBJECTS.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => setSelectedSubjectId(sub.id)}
                            className={`flex items-center p-2 rounded-lg transition-colors border ${
                                selectedSubjectId === sub.id 
                                ? `${sub.colorClass} border-transparent ring-2 ring-offset-1 ring-gray-200` 
                                : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            <span className="text-xl mr-2">{sub.icon}</span>
                            <span className="font-medium text-sm">{sub.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-auto">
                <label className="block text-sm font-bold text-gray-700 mb-2">Sorun Nedir?</label>
                <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none h-32 mb-4"
                    placeholder={
                        selectedSubject.id === 'math' ? "Örn: 2x + 5 = 15 denklemini nasıl çözerim?" :
                        selectedSubject.id === 'social' ? "Örn: Lale Devri nedir?" :
                        selectedSubject.id === 'english' ? "Örn: 'Kalem' kelimesinin İngilizcesi ne?" :
                        "Sorunu buraya yaz..."
                    }
                />
                <button 
                    type="submit"
                    disabled={loadingState === LoadingState.LOADING || !question.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                        loadingState === LoadingState.LOADING || !question.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-pink-500 hover:bg-pink-600 hover:shadow-lg transform hover:-translate-y-1'
                    }`}
                >
                    {loadingState === LoadingState.LOADING ? 'Yapay Zekaya Soruluyor...' : 'Yapay Zekaya Sor 🚀'}
                </button>
            </form>
        </div>

        {/* Right Panel: Answer */}
        <div className="w-full md:w-2/3 p-8 bg-slate-50 flex flex-col relative">
            
            {/* Header for Chat */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedSubject.colorClass.replace('bg-', 'from-').replace('text-', '').split(' ')[0]} to-gray-200`}></div>

            {loadingState === LoadingState.IDLE && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <span className="text-6xl mb-4">💬</span>
                    <p className="text-center max-w-xs">Sol taraftan dersi seç ve sorunu yaz. Yapay Zeka burada cevaplayacak.</p>
                </div>
            )}

            {loadingState === LoadingState.LOADING && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="flex space-x-2 mb-4">
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-pink-600 font-medium">{selectedSubject.title} Yapay Zekası düşünüyor...</p>
                </div>
            )}

            {loadingState === LoadingState.SUCCESS && answer && (
                <div className="animate-fade-in flex-1 overflow-y-auto">
                    <div className="flex items-start mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl mr-3 border-2 border-white shadow-sm flex-shrink-0">
                            👤
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%]">
                            <p className="text-gray-800 font-medium">{question}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3 border-2 border-white shadow-sm flex-shrink-0 ${selectedSubject.colorClass}`}>
                            {selectedSubject.icon}
                        </div>
                        <div className={`p-6 rounded-2xl rounded-tl-none shadow-md border border-gray-100 w-full bg-white`}>
                            <h3 className={`font-bold text-sm mb-2 ${selectedSubject.colorClass.split(' ')[1]}`}>
                                {selectedSubject.title} Yapay Zekası:
                            </h3>
                            <div className="prose prose-slate text-gray-700 leading-relaxed">
                                {answer.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 last:mb-0">{formatText(line)}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loadingState === LoadingState.ERROR && (
                <div className="flex-1 flex flex-col items-center justify-center text-red-400">
                    <span className="text-4xl mb-2">😕</span>
                    <p>Bir sorun oluştu. Lütfen tekrar dene.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AskTeacherView;
