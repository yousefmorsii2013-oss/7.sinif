import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, GameRound } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const streamLessonContent = async function* (topicContext: string, subjectName: string) {
  try {
    let customInstructions = "";
    
    if (subjectName === "Matematik") {
      customInstructions = `
      - Bu bir matematik dersi. İŞLEMLERİ VE SAYILARI MUTLAKA LaTeX FORMATINDA YAZ ($x^2$, $3/4$, $30^\\circ$ gibi).
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
      - Konuyu bir "Okuma Metni" üzerinden anlat.
      - Dil bilgisi kurallarını bu metin üzerinden örneklendir.`;
    } else if (subjectName === "Temel Dini Bilgiler" || subjectName === "Din Kültürü ve Ahlak Bilgisi") {
      customInstructions = `
      - Konuları ayet ve hadislerle destekle (Mealleriyle birlikte ver).
      - Dini kavramları (Tevhid, İhlas, Takva, Ahiret, Hac) net bir şekilde açıkla.
      - Ahlaki değerleri (Adalet, Merhamet) güncel örneklerle anlat.
      - Saygılı, manevi ve öğretici bir dil kullan.
      - Hac gibi ibadet konularında aşamaları maddeler halinde sırala.`;
    }

    const prompt = `Aşağıdaki konu bağlamını kullanarak MEB 7. Sınıf ${subjectName} Ders Kitabı formatında, müfredata %100 uyumlu bir ders içeriği oluştur.
    
    KONU BAĞLAMI: ${topicContext}

    ${customInstructions}

    İçerik şu yapıya sadık kalmalı (Markdown formatında):

    # [Ünite/Konu Adı]
    
    ## 🎯 Neler Öğreneceğiz?
    *(Bu bölümde ders kitabı kazanımlarını maddeler halinde özetle)*

    ## 🗝️ Anahtar Kavramlar
    *(Konunun en önemli terimlerini liste halinde tanımla)*

    ## 📚 Konu Anlatımı
    *(MEB ders kitabı dilini kullanarak, öğrenciye hitap eden, açıklayıcı, akademik ama anlaşılır bir anlatım yap. Alt başlıklar kullan. Önemli yerleri koyu yaz.)*
    
    ${subjectName === 'Matematik' ? '### ✏️ Birlikte Çözelim\n*(Adım adım çözümlü örnek soru)*' : ''}

    ## 💡 Bunları Biliyor musunuz?
    *(Konuyla ilgili şaşırtıcı, güncel veya tarihi kısa bir anekdot)*

    ## 📝 Sıra Sizde
    *(Öğrencinin konuyla ilgili yapabileceği basit bir etkinlik, düşünme sorusu veya araştırma ödevi)*
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
    Matematik ise işlem gerektirsin ve sayılar LaTeX formatında olsun ($x+y$).
    Sosyal Bilgiler ise harita yorumlama veya paragraf yorumlama içersin.
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
        2. ${subjectName === 'Matematik' ? 'Sayısal ifadeleri ve formülleri mutlaka LaTeX formatında yaz ($x^2$).' : ''}
        3. Cevap KISA ve ÖZ olmalı. En fazla 6-7 satır uzunluğunda yaz.
        4. Karmaşık detaylara girme, öğrencinin seviyesine in.`,
      }
    });

    return response.text || "Üzgünüm, şu an cevap veremiyorum.";
  } catch (error) {
    console.error("Ask Teacher error:", error);
    return "Bir hata oluştu. Lütfen tekrar dene.";
  }
};

export const generateGameData = async (subjectName: string): Promise<GameRound[]> => {
  try {
    const prompt = `7. sınıf ${subjectName} dersi için "Labirent Kovalamaca" oyunu verisi hazırla.
    Toplam 10 tur (round) oluştur.
    
    ÖNEMLİ KURALLAR:
    1. "question": Kısa ve net bir soru (Maks 6-7 kelime).
    2. "correctAnswer": ÇOK KISA olmalı (Maksimum 1-2 kelime). Çünkü ekrandaki küçük kutulara sığmalı.
    3. "wrongAnswers": 3 adet yanlış cevap, yine ÇOK KISA (1-2 kelime).
    
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