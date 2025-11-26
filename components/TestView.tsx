
import React, { useState } from 'react';

// --- STATIC HIGH QUALITY DATA (NO AI) ---
// These are manually curated "MEB/LGS Style" questions to ensure 100% accuracy.

const TEST_DATA: Record<string, { title: string, questions: any[] }> = {
    'math': {
        title: 'Matematik Tarama Testi',
        questions: [
            {
                q: 'Bir sayının 3 katının 5 eksiği 16 ise, bu sayı kaçtır?',
                options: ['5', '6', '7', '8'],
                answer: 2 // 7 (3*7=21, 21-5=16)
            },
            {
                q: '$(-5) + (+3) - (-2)$ işleminin sonucu kaçtır?',
                options: ['0', '-4', '4', '-6'],
                answer: 0 // -5 + 3 + 2 = 0
            },
            {
                q: 'Bir araç 450 km\'lik yolun $\\frac{2}{5}$\'sini gitmiştir. Geriye kaç km yolu kalmıştır?',
                options: ['180', '250', '270', '300'],
                answer: 2 // 450 * 2/5 = 180 (giden), 450 - 180 = 270
            },
            {
                q: '$3x + 4 = 19$ denkleminde x kaçtır?',
                options: ['3', '4', '5', '6'],
                answer: 2 // 3x = 15, x = 5
            },
            {
                q: 'Bir açının tümleri $40^\\circ$ ise, bu açının bütünleri kaç derecedir?',
                options: ['50', '130', '140', '150'],
                answer: 1 // Açı = 90-40=50. Bütünleri = 180-50=130
            }
        ]
    },
    'science': {
        title: 'Fen Bilimleri Ünite Testi',
        questions: [
            {
                q: 'Aşağıdaki organellerden hangisi hücrede "Enerji Üretimi"nden sorumludur?',
                options: ['Ribozom', 'Lizozom', 'Mitokondri', 'Koful'],
                answer: 2
            },
            {
                q: 'Mitoz bölünme sonucunda oluşan hücrelerin kromozom sayısı ana hücreye göre nasıl değişir?',
                options: ['Yarıya iner', 'İki katına çıkar', 'Değişmez', 'Üç katına çıkar'],
                answer: 2
            },
            {
                q: 'Uzay araştırmalarında kullanılan, atmosfer dışına gönderilen ve yörüngede dolanan araçlara ne ad verilir?',
                options: ['Uzay Mekiği', 'Yapay Uydu', 'Uzay Sondası', 'Teleskop'],
                answer: 1
            },
            {
                q: 'Aşağıdakilerden hangisi saf madde değildir?',
                options: ['Demir', 'Su', 'Hava', 'Tuz'],
                answer: 2 // Hava bir karışımdır
            },
            {
                q: 'Kütlesi 10 kg olan bir cismin Dünya\'daki ağırlığı yaklaşık kaç Newton\'dur? (g=10 N/kg)',
                options: ['10', '100', '1000', '1'],
                answer: 1 // 10 * 10 = 100
            }
        ]
    },
    'social': {
        title: 'Sosyal Bilgiler Kazanım Testi',
        questions: [
            {
                q: 'Osmanlı Devleti\'nde "Devşirme Sistemi" ile yetiştirilen askerlerin oluşturduğu orduya ne ad verilir?',
                options: ['Tımarlı Sipahiler', 'Yeniçeri Ocağı', 'Akıncılar', 'Azaplar'],
                answer: 1
            },
            {
                q: 'İstanbul\'un Fethi (1453) ile çağ kapatıp çağ açan Osmanlı padişahı kimdir?',
                options: ['Yavuz Sultan Selim', 'Kanuni Sultan Süleyman', 'Fatih Sultan Mehmet', 'Osman Bey'],
                answer: 2
            },
            {
                q: 'Kitle iletişim özgürlüğü anayasamızın hangi maddesi ile güvence altına alınmıştır?',
                options: ['Haberleşme Hürriyeti', 'Yerleşme Hürriyeti', 'Seyahat Hürriyeti', 'Eğitim Hakkı'],
                answer: 0
            },
            {
                q: 'Nüfus sayımları sonucunda aşağıdakilerden hangisine ulaşılamaz?',
                options: ['Toplam nüfus miktarına', 'Kadın-erkek nüfusuna', 'İnsanların kişisel düşüncelerine', 'Kır-kent nüfus oranına'],
                answer: 2
            },
            {
                q: 'Lale Devri\'nde yapılan yeniliklerden hangisi Avrupa\'yı yakından tanıma amacı taşır?',
                options: ['Çiçek aşısının uygulanması', 'Tulumbacıların kurulması', 'Avrupa\'ya elçilerin gönderilmesi', 'Kağıt fabrikasının açılması'],
                answer: 2
            }
        ]
    },
    'english': {
        title: 'English Practice Test',
        questions: [
            {
                q: 'Which option describes a person who "never changes their mind"?',
                options: ['Generous', 'Stubborn', 'Honest', 'Punctual'],
                answer: 1
            },
            {
                q: 'I prefer _______ documentaries to _______ soap operas.',
                options: ['watch / watch', 'watching / watching', 'watch / watching', 'watching / watch'],
                answer: 1
            },
            {
                q: 'Complete the sentence: "We _______ at the cinema yesterday."',
                options: ['are', 'were', 'was', 'did'],
                answer: 1
            },
            {
                q: 'Which animal is a "reptile"?',
                options: ['Lion', 'Eagle', 'Snake', 'Whale'],
                answer: 2
            },
            {
                q: 'Ataturk _______ in 1881 in Thessaloniki.',
                options: ['is born', 'was born', 'born', 'were born'],
                answer: 1
            }
        ]
    },
    'turkish': {
        title: 'Türkçe Tarama Testi',
        questions: [
            {
                q: 'Aşağıdaki cümlelerin hangisinde "öznel" bir anlatım vardır?',
                options: ['Türkiye\'nin başkenti Ankara\'dır.', 'Kitap okumak dünyanın en zevkli işidir.', 'Su 100 derecede kaynar.', 'Bir hafta 7 gündür.'],
                answer: 1
            },
            {
                q: '"Baka kalırım giden geminin ardından." cümlesindeki fiilin kipi nedir?',
                options: ['Şimdiki Zaman', 'Gelecek Zaman', 'Geniş Zaman', 'Görülen Geçmiş Zaman'],
                answer: 2
            },
            {
                q: 'Aşağıdaki kelimelerden hangisi "türemiş" yapılıdır?',
                options: ['Kitaplık', 'Masa', 'Okul', 'Kalem'],
                answer: 0
            },
            {
                q: 'Hangi cümlede "neden-sonuç" ilişkisi vardır?',
                options: ['Ders çalışmak için odaya gitti.', 'Yağmur yağdığı için maç iptal oldu.', 'Seni görmek istiyorum.', 'Eve gelirse haber ver.'],
                answer: 1
            },
            {
                q: '"Tatlı" sözcüğü hangi cümlede "mecaz" anlamda kullanılmıştır?',
                options: ['Tatlı bir pasta yedik.', 'Çayın yanına tatlı aldık.', 'Çok tatlı bir çocuktu.', 'Tatlı elmalar sepette.'],
                answer: 2
            }
        ]
    }
};

const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={index} className="font-serif italic px-1 mx-0.5 bg-gray-100 rounded text-gray-900 inline-block border border-gray-200">
            {part.slice(1, -1)}
          </span>
        );
      } else {
        return part;
      }
    });
};

const TestView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // qIndex -> optionIndex
  const [isFinished, setIsFinished] = useState(false);

  const resetTest = () => {
      setSelectedCategory(null);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setIsFinished(false);
  };

  const startTest = (catKey: string) => {
      setSelectedCategory(catKey);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setIsFinished(false);
  };

  const handleOptionSelect = (optionIdx: number) => {
      if (isFinished) return;
      setUserAnswers(prev => ({
          ...prev,
          [currentQuestionIdx]: optionIdx
      }));
  };

  const finishTest = () => {
      setIsFinished(true);
  };

  const calculateScore = () => {
      if (!selectedCategory) return { correct: 0, wrong: 0, empty: 0, score: 0 };
      const questions = TEST_DATA[selectedCategory].questions;
      let correct = 0;
      let wrong = 0;
      let empty = 0;

      questions.forEach((q, idx) => {
          const userAns = userAnswers[idx];
          if (userAns === undefined) {
              empty++;
          } else if (userAns === q.answer) {
              correct++;
          } else {
              wrong++;
          }
      });

      return { correct, wrong, empty, score: correct * 20 }; // 5 questions * 20 pts = 100
  };

  // --- RENDER: MENU ---
  if (!selectedCategory) {
      return (
          <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in-up">
              <div className="text-center mb-12">
                  <h1 className="text-4xl font-black text-red-600 font-handwritten mb-4 tracking-wide">
                      TestTube Merkezi
                  </h1>
                  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                      Yapay Zeka yok. Hata yok. Sadece gerçek, müfredata uygun, kaliteli test soruları.
                      Başlamak için bir ders seç.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                      { id: 'math', title: 'Matematik', icon: '📐', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                      { id: 'science', title: 'Fen Bilimleri', icon: '🧬', color: 'bg-teal-50 border-teal-200 text-teal-700' },
                      { id: 'social', title: 'Sosyal Bilgiler', icon: '🌍', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                      { id: 'turkish', title: 'Türkçe', icon: '📚', color: 'bg-red-50 border-red-200 text-red-700' },
                      { id: 'english', title: 'İngilizce', icon: '🇬🇧', color: 'bg-rose-50 border-rose-200 text-rose-700' }
                  ].map((item) => (
                      <button
                          key={item.id}
                          onClick={() => startTest(item.id)}
                          className={`p-6 rounded-2xl border-2 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-4 ${item.color}`}
                      >
                          <span className="text-4xl bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
                              {item.icon}
                          </span>
                          <div className="text-left">
                              <h3 className="font-bold text-xl">{item.title}</h3>
                              <p className="text-sm opacity-80">5 Soru • 10 Dakika</p>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // --- RENDER: QUIZ ---
  const questions = TEST_DATA[selectedCategory].questions;
  const currentQ = questions[currentQuestionIdx];
  const results = isFinished ? calculateScore() : null;

  return (
      <div className="max-w-4xl mx-auto py-8 px-4">
          <button 
            onClick={resetTest}
            className="mb-6 flex items-center text-gray-500 hover:text-red-600 font-bold transition-colors"
          >
            &larr; Testlerden Çık
          </button>

          {!isFinished ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800">{TEST_DATA[selectedCategory].title}</h2>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                          Soru {currentQuestionIdx + 1} / {questions.length}
                      </span>
                  </div>

                  {/* Question Area */}
                  <div className="p-8 sm:p-12">
                      <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-10">
                          {formatText(currentQ.q)}
                      </p>

                      <div className="space-y-4">
                          {currentQ.options.map((opt: string, idx: number) => {
                              const isSelected = userAnswers[currentQuestionIdx] === idx;
                              return (
                                  <button
                                      key={idx}
                                      onClick={() => handleOptionSelect(idx)}
                                      className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center group ${
                                          isSelected 
                                            ? 'border-red-500 bg-red-50 text-red-900 shadow-md' 
                                            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                      }`}
                                  >
                                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 border transition-colors ${
                                          isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-300 text-gray-500 group-hover:border-gray-400'
                                      }`}>
                                          {String.fromCharCode(65 + idx)}
                                      </span>
                                      <span className="text-lg font-medium">{formatText(opt)}</span>
                                  </button>
                              );
                          })}
                      </div>
                  </div>

                  {/* Footer Navigation */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between">
                      <button
                          onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                          disabled={currentQuestionIdx === 0}
                          className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"
                      >
                          Önceki
                      </button>
                      
                      {currentQuestionIdx < questions.length - 1 ? (
                          <button
                              onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition-colors"
                          >
                              Sonraki
                          </button>
                      ) : (
                          <button
                              onClick={finishTest}
                              className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition-colors"
                          >
                              Testi Bitir
                          </button>
                      )}
                  </div>
              </div>
          ) : (
              // --- RESULT SCREEN ---
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center animate-fade-in-up">
                  <div className="bg-red-600 p-8 text-white">
                      <h2 className="text-3xl font-bold mb-2">Test Sonucu</h2>
                      <div className="text-6xl font-black mb-2">{results?.score} <span className="text-2xl font-normal opacity-80">/ 100</span></div>
                  </div>
                  
                  <div className="p-8 sm:p-12">
                      <div className="grid grid-cols-3 gap-4 mb-10">
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                              <div className="text-3xl font-bold text-green-600">{results?.correct}</div>
                              <div className="text-sm text-green-800 font-bold uppercase">Doğru</div>
                          </div>
                          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                              <div className="text-3xl font-bold text-red-600">{results?.wrong}</div>
                              <div className="text-sm text-red-800 font-bold uppercase">Yanlış</div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="text-3xl font-bold text-gray-600">{results?.empty}</div>
                              <div className="text-sm text-gray-800 font-bold uppercase">Boş</div>
                          </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">Cevap Anahtarı:</h3>
                      <div className="space-y-3 mb-10">
                          {questions.map((q, idx) => {
                              const userAns = userAnswers[idx];
                              const isCorrect = userAns === q.answer;
                              const isEmpty = userAns === undefined;
                              
                              return (
                                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                                      <div className="flex items-center gap-3">
                                          <span className="font-bold text-gray-500 w-6">{idx + 1}.</span>
                                          <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-md">{q.q}</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          {isEmpty ? (
                                              <span className="text-gray-400 font-bold text-sm">BOŞ</span>
                                          ) : isCorrect ? (
                                              <span className="text-green-600 font-bold text-sm">DOĞRU</span>
                                          ) : (
                                              <span className="text-red-600 font-bold text-sm">YANLIŞ (Cevap: {String.fromCharCode(65 + q.answer)})</span>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      <div className="flex justify-center gap-4">
                          <button 
                              onClick={resetTest}
                              className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
                          >
                              Listeye Dön
                          </button>
                          <button 
                              onClick={() => startTest(selectedCategory!)}
                              className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg transition-colors"
                          >
                              Tekrar Çöz
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

export default TestView;
