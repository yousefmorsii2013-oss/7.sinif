import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const streamLessonContent = async function* (topicContext: string) {
  try {
    const prompt = `Aşağıdaki konu bağlamını kullanarak MEB 7. Sınıf Fen Bilimleri Ders Kitabı formatında, müfredata %100 uyumlu bir ders içeriği oluştur.
    
    KONU BAĞLAMI: ${topicContext}

    İçerik şu yapıya sadık kalmalı (Markdown formatında):

    # [Ünite Adı]
    
    ## 🎯 Neler Öğreneceğiz?
    *(Bu bölümde ders kitabı kazanımlarını maddeler halinde özetle)*

    ## 🗝️ Anahtar Kavramlar
    *(Konunun en önemli terimlerini liste halinde tanımla)*

    ## 📚 Konu Anlatımı
    *(MEB ders kitabı dilini kullanarak, öğrenciye hitap eden, açıklayıcı, akademik ama anlaşılır bir anlatım yap. Alt başlıklar kullan. Önemli yerleri koyu yaz.)*

    ## 💡 Bunları Biliyor musunuz?
    *(Konuyla ilgili şaşırtıcı, güncel veya tarihi kısa bir bilimsel anekdot)*

    ## 📝 Sıra Sizde
    *(Öğrencinin konuyla ilgili yapabileceği basit bir etkinlik, düşünme sorusu veya araştırma ödevi)*
    `;

    const response = await ai.models.generateContentStream({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "Sen MEB müfredatına hakim, 7. sınıf Fen Bilimleri ders kitabı yazan uzman bir eğitimcisin. Öğrencilere 'siz' diliyle hitap et. Bilgilerin kesinlikle bilimsel ve müfredat dahilinde olduğundan emin ol. Gereksiz detaylardan kaçın, kazanımlara odaklan.",
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

export const generateQuizQuestions = async (topicContext: string): Promise<QuizQuestion[]> => {
  try {
    // Generates 10 multiple choice questions.
    const prompt = `"${topicContext}" bağlamı için 7. sınıf Fen Bilimleri seviyesinde toplam 10 adet ÇOKTAN SEÇMELİ (Test) sınav sorusu hazırla.
    
    Sorular LGS tarzı, beceri temelli, grafik/deney yorumlama gerektiren, düşündürücü ve seçici sorular olsun.
    Her soru için 4 seçenek (A, B, C, D) ve 1 doğru cevap indexi (0-3) ver.
    Ezberden uzak, mantık ve muhakeme gerektirmeli.

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
    const prompt = `Scientific illustration for 7th grade science textbook: ${description}. Educational, clear, white background, accurate labeling style.`;
    
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