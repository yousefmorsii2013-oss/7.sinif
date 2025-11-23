import React, { useState, useEffect } from 'react';
import { Topic, LoadingState, QuizQuestion } from '../types';
import { streamLessonContent, generateQuizQuestions } from '../services/geminiService';

interface LessonViewProps {
  topic: Topic;
  onBack: () => void;
}

// Simple Markdown parser component since we can't install react-markdown
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
          return <li key={idx} className="ml-4 text-gray-700 list-disc">{line.replace(/^[-*] /, '')}</li>;
        } else if (line.match(/^\d+\./)) {
             return <div key={idx} className="ml-4 text-gray-700 font-semibold mt-2">{line}</div>;
        } else if (line.trim() === '') {
          return <div key={idx} className="h-2"></div>;
        } else {
           // Handle bold text simply
           const parts = line.split('**');
           return (
             <p key={idx} className="text-gray-700 leading-relaxed">
               {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-indigo-900">{part}</strong> : part))}
             </p>
           );
        }
      })}
    </div>
  );
};

const LessonView: React.FC<LessonViewProps> = ({ topic, onBack }) => {
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoadingState(LoadingState.LOADING);
        setContent("");
        
        // 1. Start Quiz Generation in Background (Non-blocking)
        generateQuizQuestions(topic.promptContext)
          .then(questions => {
            if (isMounted) {
              setQuizQuestions(questions);
              setIsQuizReady(true);
            }
          })
          .catch(error => {
            console.error("Quiz generation failed:", error);
          });

        // 2. Stream Lesson Content
        const stream = streamLessonContent(topic.promptContext);
        let fullText = "";
        
        for await (const chunk of stream) {
          if (!isMounted) break;
          fullText += chunk;
          setContent(fullText);
          // Switch to SUCCESS as soon as we have text to show
          setLoadingState(LoadingState.SUCCESS);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

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
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-xl font-handwritten text-indigo-600">Öğretmen ders notlarını hazırlıyor...</p>
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

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
      >
        &larr; Konulara Dön
      </button>

      {!showQuiz ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
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
            <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                <h2 className="text-2xl font-bold font-handwritten">Bilgi Yarışması</h2>
                {!quizFinished && <span className="bg-purple-800 px-3 py-1 rounded-full text-sm">Soru {currentQuestionIndex + 1} / {quizQuestions.length}</span>}
            </div>
            
            <div className="p-8 lg:p-12">
                {!quizFinished ? (
                    <div>
                        <p className="text-xl font-medium text-gray-800 mb-8">{quizQuestions[currentQuestionIndex].question}</p>
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
                                            : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                                    }`}
                                >
                                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                                <p className="font-bold text-blue-800">Açıklama:</p>
                                <p className="text-blue-700">{quizQuestions[currentQuestionIndex].explanation}</p>
                                <div className="mt-4 text-right">
                                    <button 
                                        onClick={nextQuestion}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                                    >
                                        {currentQuestionIndex < quizQuestions.length - 1 ? 'Sıradaki Soru' : 'Sonucu Gör'}
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
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
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