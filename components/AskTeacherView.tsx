
import React, { useState } from 'react';
import { Subject, LoadingState } from '../types';
import { askTeacher } from '../services/geminiService';
import { SUBJECTS } from '../constants';

const renderMath = (latex: string): React.ReactNode[] => {
    let text = latex
        .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
        .replace(/\\times/g, '×')
        .replace(/\\cdot/g, '·')
        .replace(/\\div/g, '÷')
        .replace(/\\circ/g, '°')
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\approx/g, '≈')
        .replace(/\\pi/g, 'π')
        .replace(/\\dots/g, '...')
        .replace(/\\ldots/g, '...')
        .replace(/\\cdots/g, '...')
        .replace(/\\rightarrow/g, '→')
        .replace(/\\Rightarrow/g, '⇒')
        .replace(/\\leftarrow/g, '←')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '');

    const output: React.ReactNode[] = [];
    let i = 0;
    
    const extractBraceContent = (str: string, start: number) => {
        let depth = 1;
        let content = "";
        let j = start + 1; 
        while (j < str.length && depth > 0) {
            if (str[j] === '{') depth++;
            else if (str[j] === '}') depth--;
            
            if (depth > 0) content += str[j];
            j++;
        }
        return { content, nextIndex: j };
    };

    while (i < text.length) {
        if (text.substr(i, 5) === '\\frac') {
            i += 5;
            let num = "";
            let den = "";
            
            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                num = res.content;
                i = res.nextIndex;
            } else {
                num = text[i];
                i++;
            }

            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                den = res.content;
                i = res.nextIndex;
            } else {
                den = text[i];
                i++;
            }

            output.push(
                <span key={`frac-${i}`} className="inline-flex flex-col text-center align-middle mx-1 align-middle relative group">
                    <span className="border-b-2 border-current px-1 pb-[1px] text-[0.8em] font-semibold leading-none block">{renderMath(num)}</span>
                    <span className="w-[1px] h-[1px] overflow-hidden opacity-0 absolute left-0 top-1/2 -z-10 select-all">/</span>
                    <span className="px-1 pt-[1px] text-[0.8em] font-semibold leading-none block">{renderMath(den)}</span>
                </span>
            );

        } else if (text.substr(i, 9) === '\\overline') {
            i += 9;
            let content = "";
            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                content = res.content;
                i = res.nextIndex;
            } else {
                content = text[i];
                i++;
            }
            output.push(
                <span key={`over-${i}`} className="border-t border-current inline-block">{renderMath(content)}</span>
            );

        } else if (text.substr(i, 7) === '\\cancel') {
            i += 7;
            let content = "";
            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                content = res.content;
                i = res.nextIndex;
            } else {
                content = text[i];
                i++;
            }
            output.push(
                <span key={`cancel-${i}`} className="relative inline-block mx-0.5">
                    {renderMath(content)}
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-full border-t-2 border-red-500 transform -rotate-12 opacity-80"></span>
                    </span>
                </span>
            );

        } else if (text[i] === '^') {
            i++; 
            let content = "";
            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                content = res.content;
                i = res.nextIndex;
            } else if (i < text.length) {
                content = text[i];
                i++;
            }
            output.push(<sup key={`sup-${i}`} className="text-[0.6em] align-super ml-0.5 font-bold">{renderMath(content)}</sup>);
        } else if (text[i] === '_') {
            i++; 
             let content = "";
            if (i < text.length && text[i] === '{') {
                const res = extractBraceContent(text, i);
                content = res.content;
                i = res.nextIndex;
            } else if (i < text.length) {
                content = text[i];
                i++;
            }
            output.push(<sub key={`sub-${i}`} className="text-[0.6em] align-baseline ml-0.5">{renderMath(content)}</sub>);
        } else {
            let buffer = "";
            while (
                i < text.length && 
                text.substr(i, 5) !== '\\frac' && 
                text.substr(i, 9) !== '\\overline' && 
                text.substr(i, 7) !== '\\cancel' && 
                text[i] !== '^' && 
                text[i] !== '_'
            ) {
                buffer += text[i];
                i++;
            }
            output.push(<span key={`txt-${i}`}>{buffer}</span>);
        }
    }
    
    return output;
};

const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-black font-black">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.slice(1, -1);
        return (
          <span key={index} className="font-serif italic px-1 mx-0.5 bg-slate-100 rounded text-slate-900 inline-block border border-slate-200">
            {renderMath(mathContent)}
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

        <div className="w-full md:w-2/3 p-8 bg-slate-50 flex flex-col relative">
            
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
