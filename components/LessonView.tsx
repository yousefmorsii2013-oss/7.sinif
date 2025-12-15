
import React, { useState, useEffect } from 'react';
import { Topic, LoadingState, QuizQuestion, Subject } from '../types';
import { streamLessonContent, generateQuizQuestions } from '../services/geminiService';

interface LessonViewProps {
  topic: Topic;
  subject: Subject;
  onBack: () => void;
}

// Math Rendering Helper
const renderMath = (latex: string): React.ReactNode[] => {
    // 1. Pre-process to fix common AI formatting issues
    // Convert 1/2 to \frac{1}{2} strictly within math contexts
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
        .replace(/\\pi/g, 'π');

    // 2. Parser for \frac{num}{den}, ^{sup}, _{sub}
    const output: React.ReactNode[] = [];
    let i = 0;
    
    // Helper to extract content inside {} starting at index start
    const extractBraceContent = (str: string, start: number) => {
        let depth = 1;
        let content = "";
        let j = start + 1; // skip first {
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
            // Expect {num}
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
                <span key={`frac-${i}`} className="inline-flex flex-col text-center align-middle mx-1 align-middle">
                    <span className="border-b-2 border-current px-1 pb-[1px] text-[0.8em] font-semibold leading-none block">{renderMath(num)}</span>
                    <span className="px-1 pt-[1px] text-[0.8em] font-semibold leading-none block">{renderMath(den)}</span>
                </span>
            );

        } else if (text[i] === '^') {
            i++; // skip ^
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
            i++; // skip _
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
            // Collect text until next special char
            let buffer = "";
            while (i < text.length && text.substr(i, 5) !== '\\frac' && text[i] !== '^' && text[i] !== '_') {
                buffer += text[i];
                i++;
            }
            output.push(<span key={`txt-${i}`}>{buffer}</span>);
        }
    }
    
    return output;
};

// Helper to format text with bold (**text**) and math ($text$) support
const formatText = (text: string) => {
  // Split by bold (**) or math ($) patterns
  const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-indigo-900 font-bold">{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      // Basic math styling with new renderMath parser
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

// Simple Markdown parser component
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-indigo-600 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        } else if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-indigo-700 mt-8 mb-3 border-b-2 border-indigo-100 pb-2">{line.replace('## ', '')}</h2>;
        } else if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold text-indigo-800 mb-4">{line.replace('# ', '')}</h1>;
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={idx} className="ml-4 text-gray-700 list-disc">{formatText(line.replace(/^[-*] /, ''))}</li>;
        } else if (line.match(/^\d+\./)) {
             return <div key={idx} className="ml-4 text-gray-700 font-semibold mt-2">{formatText(line)}</div>;
        } else if (line.trim() === '') {
          return <div key={idx} className="h-2"></div>;
        } else {
           // Handle paragraph text with formatting
           return (
             <p key={idx} className="text-gray-700 leading-relaxed">
               {formatText(line)}
             </p>
           );
        }
      })}
    </div>
  );
};

const LessonView: React.FC<LessonViewProps> = ({ topic, subject, onBack }) => {
  const [content, setContent] = useState<string>("");
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.LOADING);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizReady, setIsQuizReady] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Clear cache if needed (for debugging or manual refresh)
  const refreshLesson = () => {
      localStorage.removeItem(`lesson_content_${topic.id}`);
      localStorage.removeItem(`lesson_quiz_${topic.id}`);
      window.location.reload(); // Simple reload to re-fetch
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoadingState(LoadingState.LOADING);
        setContent("");
        
        const contentKey = `lesson_content_${topic.id}`;
        const quizKey = `lesson_quiz_${topic.id}`;

        const cachedContent = localStorage.getItem(contentKey);
        const cachedQuiz = localStorage.getItem(quizKey);

        // 1. Handle Quiz (Load Cache or Generate)
        if (cachedQuiz) {
            try {
                const parsedQuiz = JSON.parse(cachedQuiz);
                if (isMounted) {
                    setQuizQuestions(parsedQuiz);
                    setIsQuizReady(true);
                }
            } catch (e) {
                console.error("Cache parse error", e);
                // Fallback to generation
                generateQuizQuestions(topic.promptContext, subject.title)
                .then(questions => {
                    if (isMounted) {
                    setQuizQuestions(questions);
                    setIsQuizReady(true);
                    localStorage.setItem(quizKey, JSON.stringify(questions));
                    }
                });
            }
        } else {
            generateQuizQuestions(topic.promptContext, subject.title)
            .then(questions => {
                if (isMounted) {
                setQuizQuestions(questions);
                setIsQuizReady(true);
                localStorage.setItem(quizKey, JSON.stringify(questions));
                }
            })
            .catch(error => {
                console.error("Quiz generation failed:", error);
            });
        }

        // 2. Handle Lesson Content (Load Cache or Stream)
        if (cachedContent) {
            if (isMounted) {
                setContent(cachedContent);
                setLoadingState(LoadingState.SUCCESS);
            }
        } else {
            const stream = streamLessonContent(topic.promptContext, subject.title);
            let fullText = "";
            
            for await (const chunk of stream) {
                if (!isMounted) break;
                fullText += chunk;
                setContent(fullText);
                setLoadingState(LoadingState.SUCCESS);
            }
            if (isMounted && fullText) {
                localStorage.setItem(contentKey, fullText);
            }
        }

      } catch (error) {
        console.error(error);
        if (isMounted && content.length === 0) {
            setLoadingState(LoadingState.ERROR);
        }
      }
    };
    fetchData();
    
    return () => { isMounted = false; };
  }, [topic, subject.title]);

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === quizQuestions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 10);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const retryQuiz = () => {
      setScore(0);
      setCurrentQuestionIndex(0);
      setQuizFinished(false);
      setShowQuiz(false);
      setSelectedOption(null);
      setShowExplanation(false);
  };

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className={`animate-spin rounded-full h-16 w-16 border-b-4 ${subject.colorClass.includes('teal') ? 'border-teal-600' : 'border-indigo-600'}`}></div>
        <p className="mt-4 text-xl font-handwritten text-gray-600">Yusuf ders notlarını hazırlıyor...</p>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
        <div className="text-center p-10">
            <p className="text-red-500 text-xl">Bir hata oluştu. Lütfen tekrar dene.</p>
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-gray-200 rounded-full">Geri Dön</button>
        </div>
    )
  }

  // Determine header color based on subject
  const headerBgClass = subject.headerColor;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
            &larr; Konulara Dön
        </button>
        <button 
            onClick={refreshLesson}
            className="text-xs text-gray-400 hover:text-indigo-600 underline"
            title="İçeriği Yeniden Oluştur"
        >
            Dersi Yenile ↻
        </button>
      </div>

      {!showQuiz ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className={`${headerBgClass} p-8 text-white`}>
            <div className="flex items-center gap-4">
                <span className="text-4xl">{topic.icon}</span>
                <h1 className="text-3xl font-bold font-handwritten">{topic.title}</h1>
            </div>
          </div>
          <div className="p-8 lg:p-12">
            <SimpleMarkdown content={content} />
            
            <div className="mt-12 p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Kendini Sınamaya Hazır mısın?</h3>
              <p className="text-yellow-700 mb-4">Bu konuyla ilgili öğrendiklerini test edelim!</p>
              <button 
                onClick={() => setShowQuiz(true)}
                disabled={!isQuizReady}
                className={`px-8 py-3 rounded-full shadow-md transition-all transform font-bold ${
                  isQuizReady 
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-105 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-wait'
                }`}
              >
                {isQuizReady ? 'Teste Başla 🚀' : 'Sorular Hazırlanıyor...'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Section */
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className={`${headerBgClass} p-6 text-white flex justify-between items-center`}>
                <h2 className="text-2xl font-bold font-handwritten">{subject.title} Testi</h2>
                {!quizFinished && <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Soru {currentQuestionIndex + 1} / {quizQuestions.length}</span>}
            </div>
            
            <div className="p-8 lg:p-12">
                {!quizFinished ? (
                    <div>
                        <p className="text-xl font-medium text-gray-800 mb-8">{formatText(quizQuestions[currentQuestionIndex].question)}</p>
                        <div className="space-y-3">
                            {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={showExplanation}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        showExplanation 
                                            ? idx === quizQuestions[currentQuestionIndex].correctAnswerIndex
                                                ? 'bg-green-100 border-green-500 text-green-800'
                                                : idx === selectedOption
                                                    ? 'bg-red-100 border-red-500 text-red-800'
                                                    : 'border-gray-200 opacity-50'
                                            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {formatText(option)}
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                                <p className="font-bold text-blue-800">Açıklama:</p>
                                <p className="text-blue-700">{formatText(quizQuestions[currentQuestionIndex].explanation)}</p>
                                <div className="mt-4 text-right">
                                    <button 
                                        onClick={nextQuestion}
                                        className={`px-6 py-2 text-white rounded-lg font-medium shadow-md ${subject.headerColor.replace('bg-', 'hover:bg-').replace('600', '700')} ${subject.headerColor}`}
                                    >
                                        Sıradaki Soru
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">
                            {score === quizQuestions.length * 10 ? '🏆' : score >= (quizQuestions.length * 10) / 2 ? '👏' : '📚'}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Tamamlandı!</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Toplam Puan: <span className="font-bold text-purple-600">{score} / {quizQuestions.length * 10}</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={retryQuiz}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                            >
                                Tekrar Dene
                            </button>
                            <button 
                                onClick={onBack}
                                className={`px-6 py-2 text-white rounded-lg font-medium transition-colors shadow-md ${subject.headerColor}`}
                            >
                                Diğer Konular
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default LessonView;
