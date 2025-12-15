
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, GameRound, RiskCategory } from "../types";
import { SUBJECTS, TOPICS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const streamLessonContent = async function* (topicContext: string, subjectName: string) {
  try {
    let customInstructions = "";
    
    if (subjectName === "Matematik") {
      customInstructions = `
      - Bu bir matematik dersi.
      - Rasyonel sayıları ve kesirleri ASLA '3/4', '3/5' veya '3÷5' şeklinde yazma.
      - Kesirleri MUTLAKA dikey kesir formatında LaTeX kodu ile yaz: '\\frac{3}{4}', '\\frac{x}{y}'.
      - Tam sayılı kesirleri '1 \\frac{1}{2}' şeklinde yaz.
      - Çarpma işlemi için 'x' veya '.' yerine '\\times' veya '\\cdot' kullan.
      - Üslü sayıları '$x^2$' formatında yaz.
      - Konu anlatımında bol bol "Çözümlü Örnek" ver. Önce soruyu sor, sonra adım adım çözümünü göster.
      - "Sıra Sizde" bölümleri ekle.
      - Tanımları net ve kısa tut, işlem pratikliğine odaklan.`;
    } else if (subjectName === "Sosyal Bilgiler") {
      customInstructions = `
      - Tarih konularını (özellikle Osmanlı) hikayeleştirici bir dille anlat (Tarih şeridi mantığı).
      - "Örnek Olay" kutucukları oluştur.
      - Kavramları (Vakıf, Gaza, İskan vb.) günlük hayatla ilişkilendir.`;
    } else if (subjectName === "Fen Bilimleri") {
      customInstructions = `
      - Bilimsel terimleri kalın yaz.
      - Deney örnekleri veya günlük hayattan gözlemler ekle.`;
    } else if (subjectName === "Türkçe") {
      customInstructions = `
      - Konuyu "turkcedersi.net" sitesindeki gibi kapsamlı ve maddeler halinde anlat.
      - Dil bilgisi konularında (Fiiller, Zarflar vb.) bol bol cümle örneği ver.
      - Anlam konularında (Sözcükte/Cümlede/Paragrafta Anlam) tanımları kısa tut, örnekler üzerinden git.
      - Yazım ve Noktalama konularında "DOĞRU - YANLIŞ" tabloları kullan.
      - Metin türlerini anlatırken örnek kısa metinler ekle.`;
    } else if (subjectName === "Temel Dini Bilgiler" || subjectName === "Din Kültürü ve Ahlak Bilgisi") {
      customInstructions = `
      - Konuları ayet ve hadislerle destekle (Mealleriyle birlikte ver).
      - Dini kavramları (Tevhid, İhlas, Takva, Ahiret, Hac) net bir şekilde açıkla.
      - Ahlaki değerleri (Adalet, Merhamet) güncel örneklerle anlat.
      - Saygılı, manevi ve öğretici bir dil kullan.
      - Hac gibi ibadet konularında aşamaları maddeler halinde sırala.`;
    } else if (subjectName === "Peygamberimizin Hayatı") {
      customInstructions = `
      - Hz. Muhammed (s.a.v.) ifadesini kullan.
      - Olayları kronolojik ve akıcı bir hikaye diliyle anlat.
      - Peygamberimizin ahlaki yönünü, merhametini ve güvenilirliğini vurgula.
      - "Örnek Olay" başlığı altında hayatından kısa, eğitici kıssalar ekle.
      - Hadislerden örnekler ver.
      - Saygılı ve edebi bir dil kullan.`;
    } else if (subjectName === "Arapça") {
      customInstructions = `
      - BU DERS SADECE KELİME VE ANLAMLARI ÜZERİNEDİR.
      - SORU SORMA. Soru-cevap yapma.
      - Ünitenin başındaki Arapça kelimeleri listele. Format: **Arapça Kelime** - *Okunuşu* - **Türkçe Anlamı**.
      - Kelimeleri verdikten sonra, bu kelimelerin içinde geçtiği basit cümleler kur ve Türkçe anlamlarını yaz.
      - Örneğin: "Muallim (Öğretmen) -> Ene muallim (Ben öğretmenim)."
      - Gramer detayına girme, kelime ezberletmeye odaklan.`;
    }

    const prompt = `Aşağıdaki konu bağlamını kullanarak MEB 7. Sınıf ${subjectName} Ders Kitabı formatında, müfredata %100 uyumlu bir ders içeriği oluştur.
    
    KONU BAĞLAMI: ${topicContext}

    ${customInstructions}

    İçerik şu yapıya sadık kalmalı (Markdown formatında):

    # [Ünite/Konu Adı]
    
    ## 🎯 Neler Öğreneceğiz?
    *(Bu bölümde ders kitabı kazanımlarını maddeler halinde özetle)*

    ## 🗝️ Yeni Kelimeler (Kelimeler ve Anlamları)
    *(Arapça ise kelimeleri liste halinde ver, diğer dersler için anahtar kavramları açıkla)*

    ## 📚 Konu Anlatımı
    *(MEB ders kitabı dilini kullanarak anlat. Arapça için örnek cümleler kur. Diğer dersler için detaylı açıklama yap.)*
    
    ${subjectName === 'Matematik' ? '### ✏️ Birlikte Çözelim\n*(Adım adım çözümlü örnek soru. Kesirleri \\frac{a}{b} formatında yaz)*' : ''}

    ## 💡 Bunları Biliyor musunuz?
    *(Konuyla ilgili şaşırtıcı, güncel veya tarihi kısa bir anekdot)*

    ## 📝 Sıra Sizde
    *(Öğrencinin konuyla ilgili yapabileceği basit bir etkinlik veya tekrar çalışması)*
    `;

    const response = await ai.models.generateContentStream({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `Sen MEB müfredatına hakim, 7. sınıf ${subjectName} ders kitabı yazan uzman bir eğitimcisin. Öğrencilere 'siz' diliyle hitap et. Bilgilerin kesinlikle bilimsel/doğru ve müfredat dahilinde olduğundan emin ol.`,
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Lesson generation error:", error);
    throw error;
  }
};

export const generateQuizQuestions = async (topicContext: string, subjectName: string): Promise<QuizQuestion[]> => {
  try {
    // Generates 10 multiple choice questions.
    const prompt = `"${topicContext}" bağlamı için 7. sınıf ${subjectName} seviyesinde toplam 10 adet ÇOKTAN SEÇMELİ (Test) sınav sorusu hazırla.
    
    Sorular LGS tarzı, beceri temelli (eğer uygunsa), düşündürücü ve seçici sorular olsun.
    Matematik ise işlem gerektirsin ve sayılar LaTeX formatında olsun ($x+y$, $\\frac{1}{2}$).
    Sosyal Bilgiler ise harita yorumlama veya paragraf yorumlama içersin.
    Arapça ise kelime bilgisi veya basit cümle tamamlama sor.
    Her soru için 4 seçenek (A, B, C, D) ve 1 doğru cevap indexi (0-3) ver.
    
    JSON formatında döndür.`;
    
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 seçenekli cevap listesi"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Doğru cevap indeksi (0-3)" },
              explanation: { type: Type.STRING, description: "Cevabın detaylı açıklaması" }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw error;
  }
};

export const generateArtExample = async (description: string): Promise<string | null> => {
  try {
    const prompt = `Educational illustration for 7th grade school textbook: ${description}. Clear, educational style, white background.`;
    
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const askTeacher = async (question: string, subjectName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: question,
      config: {
        systemInstruction: `Sen 7. Sınıf ${subjectName} alanında uzmanlaşmış bir Yapay Zeka asistanısın.
        Öğrencinin sorduğu soruları, o dersin müfredatına uygun cevapla.
        
        Kurallar:
        1. Samimi, cesaretlendirici ve eğitici bir ton kullan.
        2. CEVABIN EN ÖNEMLİ KISMINI (Sonuç sayısı, Çeviri kelimesi, Doğru Cevap) MUTLAKA ** (iki yıldız) İÇİNE ALARAK VURGULA.
           Örnekler:
           - Soru: "55 eksi 54 kaç?" -> Cevap: "Sonuç **1** eder."
           - Soru: "Beautiful ne demek?" -> Cevap: "**Güzel** anlamına gelir." veya "Waseem = **Yakışıklı**"
           - Soru: "Başkent neresi?" -> Cevap: "**Ankara**'dır."
        3. Matematik işlemlerinde kesirleri MUTLAKA '\\frac{a}{b}' formatında yaz. '3/4' gibi çizgili yazma. Üslüleri 'x^2' formatında yaz.
        4. Cevap KISA ve ÖZ olmalı. En fazla 6-7 satır uzunluğunda yaz.
        5. Karmaşık detaylara girme, öğrencinin seviyesine in.`,
      }
    });

    return response.text || "Üzgünüm, şu an cevap veremiyorum.";
  } catch (error) {
    console.error("Ask Teacher error:", error);
    return "Bir hata oluştu. Lütfen tekrar dene.";
  }
};

export const generateGameData = async (subjectName: string, selectedContexts?: string[]): Promise<GameRound[]> => {
  try {
    // 1. DERS MÜFREDAT BAĞLAMI OLUŞTURMA
    let contextInstruction = "";

    if (selectedContexts && selectedContexts.length > 0) {
        contextInstruction = `
        Aşağıdaki seçili 7. Sınıf MEB Müfredat konularını ve içeriklerini temel al:
        ${selectedContexts.join('\n\n')}
        `;
    } else {
        const subject = SUBJECTS.find(s => s.title === subjectName);
        if (subject) {
            // Bu dersin sistemdeki tanımlı konularını al
            const relevantTopics = TOPICS.filter(t => t.subjectId === subject.id);
            const topicDescriptions = relevantTopics.map(t => `"${t.title}" (${t.description})`).join(', ');
            
            contextInstruction = `
            Aşağıda listelenen 7. Sınıf MEB Müfredat konularını temel al:
            ${topicDescriptions}
            `;
        }
    }

    const prompt = `7. sınıf ${subjectName} dersi için "Labirent Kovalamaca" oyunu verisi hazırla.
    Toplam 10 tur (round) oluştur.
    
    ${contextInstruction}
    
    ÖNEMLİ KURALLAR:
    1. SORULAR KESİNLİKLE VE SADECE DERS KİTABINDA BULUNAN BİLGİLERDEN OLMALIDIR. Öğrenci dersi okuduysa cevabı bilmelidir.
    2. EĞER BİRDEN FAZLA KONU VERİLDİYSE, SORULARI KARIŞIK DAĞIT (Örneğin: Bir soru 1. konudan, diğeri 2. konudan olsun). Konuları sırayla bitirme, mutlaka karıştır.
    3. "question": Kısa ve net bir soru (Maks 6-7 kelime).
    4. "correctAnswer": ÇOK KISA olmalı (Maksimum 1-2 kelime). Çünkü ekrandaki küçük kutulara sığmalı.
    5. "wrongAnswers": 3 adet yanlış cevap, yine ÇOK KISA (1-2 kelime).
    
    Örnekler:
    - Fen: Soru="Hücrenin enerji merkezi?", Cevap="Mitokondri", Yanlışlar=["Koful", "Çekirdek", "Lizozom"]
    - Mat: Soru="$3^2 + 4^2$ işlemi?", Cevap="25", Yanlışlar=["14", "49", "12"]
    
    JSON formatında döndür.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
              wrongAnswers: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["question", "correctAnswer", "wrongAnswers"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Game data generation error:", error);
    throw error;
  }
};

export const generateBigRiskBoard = async (context: string, isSpecificTopic: boolean): Promise<RiskCategory[]> => {
  // SPECIAL HANDLING: If context implies Science (Fen Bilimleri), return the specific requested questions from Fen Aktivite.
  if (context.includes("Fen Bilimleri") || context.includes("Güneş Sistemi") || context.includes("Hücre") || context.includes("Kuvvet") || context.includes("Madde") || context.includes("Işık")) {
      return [
        {
          title: "UZAY VE EVREN",
          questions: [
            { points: 50, question: "Gök cisimlerini incelemek için kullanılan, 'gök dürbünü' de denilen alet nedir?", answer: "Teleskop", isOpened: false },
            { points: 100, question: "Dünya atmosferi dışında kalan, gök cisimlerinin içinde yer aldığı sonsuz boşluğa ne denir?", answer: "Uzay", isOpened: false },
            { points: 150, question: "Isı ve ışık yayan, küresel şekilli doğal gök cisimlerine ne denir?", answer: "Yıldız", isOpened: false },
            { points: 200, question: "Güneş sisteminin içinde bulunduğu galaksinin (gök ada) adı nedir?", answer: "Samanyolu", isOpened: false },
            { points: 250, question: "Yıldızların oluşum yeri olan, gaz ve toz bulutlarından oluşan gök cismine ne denir?", answer: "Bulutsu (Nebula)", isOpened: false }
          ]
        },
        {
          title: "HÜCRE VE BÖLÜNME",
          questions: [
            { points: 50, question: "Canlının canlılık özelliği gösteren en küçük yapı taşına ne denir?", answer: "Hücre", isOpened: false },
            { points: 100, question: "Hücrede enerji üretimini sağlayan organel hangisidir?", answer: "Mitokondri", isOpened: false },
            { points: 150, question: "Bitki hücresinde bulunan, fotosentez yaparak besin ve oksijen üreten organel hangisidir?", answer: "Kloroplast", isOpened: false },
            { points: 200, question: "Vücut hücrelerinde görülen, büyüme ve onarımı sağlayan bölünme çeşidi nedir?", answer: "Mitoz", isOpened: false },
            { points: 250, question: "Üreme ana hücrelerinde görülen ve kromozom sayısını yarıya indiren bölünme çeşidi nedir?", answer: "Mayoz", isOpened: false }
          ]
        },
        {
          title: "KUVVET VE ENERJİ",
          questions: [
            { points: 50, question: "Hareket halindeki cisimlerin sahip olduğu enerji türüne ne denir?", answer: "Kinetik Enerji", isOpened: false },
            { points: 100, question: "Cisimlerin konumlarından (yükseklik) dolayı sahip oldukları enerjiye ne denir?", answer: "Potansiyel Enerji", isOpened: false },
            { points: 150, question: "Bir cismin kütlesine etki eden yer çekimi kuvvetine ne denir?", answer: "Ağırlık", isOpened: false },
            { points: 200, question: "İş yapabilme yeteneğine ne ad verilir?", answer: "Enerji", isOpened: false },
            { points: 250, question: "Sürtünme kuvveti, hareket enerjisini genellikle hangi enerjiye dönüştürür?", answer: "Isı Enerjisi", isOpened: false }
          ]
        },
        {
          title: "MADDENİN YAPISI",
          questions: [
            { points: 50, question: "Maddenin bölünebilen en küçük yapı taşına ne denir?", answer: "Atom", isOpened: false },
            { points: 100, question: "Atomun çekirdeğinde bulunan pozitif (+) yüklü parçacığa ne denir?", answer: "Proton", isOpened: false },
            { points: 150, question: "Aynı cins atomlardan oluşan saf maddelere ne denir?", answer: "Element", isOpened: false },
            { points: 200, question: "Farklı cins atomların belirli oranlarda birleşmesiyle oluşan saf maddeye ne denir?", answer: "Bileşik", isOpened: false },
            { points: 250, question: "Atomun katmanlarında bulunan, çok hızlı hareket eden negatif (-) yüklü parçacığa ne denir?", answer: "Elektron", isOpened: false }
          ]
        },
        {
          title: "IŞIK VE MADDE",
          questions: [
            { points: 50, question: "Işığın madde tarafından tutulmasına ne denir?", answer: "Soğurulma", isOpened: false },
            { points: 100, question: "Üzerine düşen ışığı yansıtmayıp büyük oranda geçiren maddelere ne denir?", answer: "Saydam Madde", isOpened: false },
            { points: 150, question: "Görüntünün her zaman düz ve cisimle aynı boyda olduğu ayna türü hangisidir?", answer: "Düz Ayna", isOpened: false },
            { points: 200, question: "Işığın yoğunlukları farklı bir ortamdan diğerine geçerken doğrultu değiştirmesine ne denir?", answer: "Kırılma", isOpened: false },
            { points: 250, question: "Beyaz ışık prizmadan geçirildiğinde en az kırılan renk hangisidir?", answer: "Kırmızı", isOpened: false }
          ]
        }
      ];
  }

  try {
    let categoryPrompt = "";
    
    if (context === "Karma") {
      categoryPrompt = `
      "Kategoriler" kesinlikle şunlar olmalı (Ders İsimleri): 
      1. Fen Bilimleri
      2. Matematik
      3. Sosyal Bilgiler
      4. Türkçe
      5. Din Kültürü`;
    } else if (isSpecificTopic) {
      // Use the rich prompt context from the lesson definition
      categoryPrompt = `
      Ders İçeriği ve Bağlam: "${context}".
      
      Bu içerik tek bir üniteye aittir. Yarışma tahtasını bu ünitenin alt başlıklarına (veya içeriğine) göre kategorilere böl.
      Kategoriler ders kitabındaki bölüm başlıkları gibi olsun (Örn: "Kelime Bilgisi", "İşlemler", "Tanımlar" vb).`;
    } else {
      categoryPrompt = `
      Seçilen Ders: ${context}.
      Bu dersin 7. sınıf müfredatındaki 5 farklı ünitesini kategori olarak belirle.`;
    }

    const prompt = `Hazırla: "Riskli Yusuf" yarışma tahtası.
    Hedef Kitle: 7. Sınıf öğrencileri.
    Müfredat: T.C. Milli Eğitim Bakanlığı (MEB) 7. Sınıf Ders Kitapları.
    
    ${categoryPrompt}
    
    Her kategori için zorluk seviyesine göre artan 5 soru hazırla (Toplam 25 soru).
    Puanlar sırasıyla: 50, 100, 150, 200, 250.
    
    ÇOK ÖNEMLİ KURALLAR:
    1. SORULAR KESİNLİKLE DERS KİTABI BİLGİSİ OLMALIDIR. Genel kültür veya müfredat dışı soru sorma.
    2. Amaç: Öğrencinin derste öğrendiği veya kitapta okuduğu bilgiyi ölçmek. Eğer öğrenci cevabı bilmiyorsa, ders kitabını açıp okuduğunda cevabı bulabilmeli.
    3. Sorular kısa ve net bilgi sorusu olsun.
    4. Cevaplar kısa ve öz olsun.
    5. Matematik soruları zihinden veya kağıt üzerinde yapılabilecek işlemler olsun ($x^2$ veya $\\frac{a}{b}$ formatı kullan).
    
    JSON formatında döndür.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Kategori Başlığı" },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    points: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ["points", "question", "answer"]
                }
              }
            },
            required: ["title", "questions"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    const data = JSON.parse(jsonStr);
    
    // Add isOpened state locally
    return data.map((cat: any) => ({
      ...cat,
      questions: cat.questions.map((q: any) => ({ ...q, isOpened: false }))
    }));

  } catch (error) {
    console.error("Riski Yusuf generation error:", error);
    throw error;
  }
};
