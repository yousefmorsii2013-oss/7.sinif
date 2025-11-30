
import { Topic, Subject } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'science',
    title: 'Fen Bilimleri',
    icon: '🧬',
    colorClass: 'bg-teal-100 text-teal-600 border-teal-200',
    headerColor: 'bg-teal-600'
  },
  {
    id: 'social',
    title: 'Sosyal Bilgiler',
    icon: '🌍',
    colorClass: 'bg-orange-100 text-orange-600 border-orange-200',
    headerColor: 'bg-orange-600'
  },
  {
    id: 'math',
    title: 'Matematik',
    icon: '📐',
    colorClass: 'bg-blue-100 text-blue-600 border-blue-200',
    headerColor: 'bg-blue-600'
  },
  {
    id: 'english',
    title: 'İngilizce',
    icon: '📘',
    colorClass: 'bg-cyan-100 text-cyan-600 border-cyan-200',
    headerColor: 'bg-cyan-600'
  },
  {
    id: 'turkish',
    title: 'Türkçe',
    icon: '📚',
    colorClass: 'bg-red-100 text-red-600 border-red-200',
    headerColor: 'bg-red-600'
  },
  {
    id: 'din',
    title: 'Din Kültürü ve Ahlak Bilgisi',
    icon: '🕌',
    colorClass: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    headerColor: 'bg-emerald-600'
  },
  {
    id: 'tdb',
    title: 'Temel Dini Bilgiler',
    icon: '🌙',
    colorClass: 'bg-violet-100 text-violet-600 border-violet-200',
    headerColor: 'bg-violet-600'
  },
  {
    id: 'arabic',
    title: 'Arapça',
    icon: '🏺',
    colorClass: 'bg-lime-100 text-lime-600 border-lime-200',
    headerColor: 'bg-lime-600'
  }
];

export const TOPICS: Topic[] = [
  // --- ARAPÇA (7. SINIF MÜFREDATI) ---
  {
    id: 'arp-1',
    subjectId: 'arabic',
    title: '1. Ünite: Meslekler (El-Mihen)',
    description: 'Meslek isimleri ve tanıtımı.',
    icon: '👨‍⚕️',
    promptContext: 'MEB 7. Sınıf Arapça 1. Ünite: Meslekler (El-Mihen). Kelimeler: Muallim (Öğretmen), Tabib (Doktor), Mühendis, Fellah (Çiftçi), Şurtî (Polis), Naccar (Marangoz), Hayyat (Terzi). Kalıplar: "O nedir?", "O doktordur.", "Ben öğretmenim".'
  },
  {
    id: 'arp-2',
    subjectId: 'arabic',
    title: '2. Ünite: Çarşıda Pazarda',
    description: 'Alışveriş diyalogları, meyve ve sebzeler.',
    icon: '🛒',
    promptContext: 'MEB 7. Sınıf Arapça 2. Ünite: Çarşıda (Fi\'s-Suuk). Kelimeler: Fakihe (Meyve), Hudar (Sebze), Tuffah (Elma), Burtukal (Portakal), Mevz (Muz), Domates, Bakkal, Ekmek. Kalıplar: "Kaç lira?", "Ne istersin?".'
  },
  {
    id: 'arp-3',
    subjectId: 'arabic',
    title: '3. Ünite: Sağlık (Es-Sıhha)',
    description: 'Hastanede, organlar ve hastalıklar.',
    icon: '🏥',
    promptContext: 'MEB 7. Sınıf Arapça 3. Ünite: Sağlık (Es-Sıhha). Kelimeler: Müsteşfa (Hastane), Deva (İlaç), Meriz (Hasta), Elem (Ağrı), Re\'s (Baş), Batn (Karın). Kalıplar: "Neyin var?", "Geçmiş olsun".'
  },
  {
    id: 'arp-4',
    subjectId: 'arabic',
    title: '4. Ünite: Spor ve Oyunlar',
    description: 'Spor dalları ve hobiler.',
    icon: '⚽',
    promptContext: 'MEB 7. Sınıf Arapça 4. Ünite: Spor (Er-Riyada). Kelimeler: Kura (Top), Kuratü\'l-Kadem (Futbol), Kuratü\'s-Selle (Basketbol), Sibaha (Yüzme), Feric (Takım), Mel\'ab (Saha).'
  },
  {
    id: 'arp-5',
    subjectId: 'arabic',
    title: '5. Ünite: Evim ve Ailem',
    description: 'Aile bireyleri ve evin bölümleri.',
    icon: '🏠',
    promptContext: 'MEB 7. Sınıf Arapça 5. Ünite: Evim ve Ailem. Kelimeler: Beyt (Ev), Gurfe (Oda), Matbah (Mutfak), Eb (Baba), Ümm (Anne), Eh (Kardeş), Cedd (Dede).'
  },

  // --- DİN KÜLTÜRÜ VE AHLAK BİLGİSİ ---
  {
    id: 'din-1',
    subjectId: 'din',
    title: '1. Ünite: Melek ve Ahiret İnancı',
    description: 'Görülen ve görülmeyen varlıklar, dünya ve ahiret hayatı.',
    icon: '👼',
    promptContext: 'MEB 7. Sınıf Din Kültürü ve Ahlak Bilgisi 1. Ünite: Melek ve Ahiret İnancı. Konular: Varlıklar Alemi (Melekler, Cinler, Şeytan), Ahiret Hayatının Aşamaları (Kıyamet, Ba\'s, Haşir, Mizan, Cennet, Cehennem), Hz. İsa (a.s.).'
  },
  {
    id: 'din-2',
    subjectId: 'din',
    title: '2. Ünite: Hac ve Kurban',
    description: 'İslam\'da hac ibadeti ve kurbanın önemi.',
    icon: '🕋',
    promptContext: 'MEB 7. Sınıf Din Kültürü ve Ahlak Bilgisi 2. Ünite: Hac ve Kurban. Konular: Haccın yapılışı ve kavramları (İhram, Tavaf, Sa\'y, Vakfe), Umre, Kurban İbadeti ve önemi, Hz. İsmail (a.s.).'
  },
  {
    id: 'din-3',
    subjectId: 'din',
    title: '3. Ünite: Ahlaki Davranışlar',
    description: 'Güzel ahlak, adalet, dostluk ve dürüstlük.',
    icon: '🤝',
    promptContext: 'MEB 7. Sınıf Din Kültürü ve Ahlak Bilgisi 3. Ünite: Ahlaki Davranışlar. Konular: Güzel Ahlak, Adalet, Dostluk, Dürüstlük, Öz Denetim, Yardımseverlik, Vatanseverlik, Hz. Salih (a.s.).'
  },
  {
    id: 'din-4',
    subjectId: 'din',
    title: '4. Ünite: Allah\'ın Kulu ve Elçisi: Hz. Muhammed',
    description: 'Peygamberimizin insani ve peygamberlik yönü.',
    icon: '🌹',
    promptContext: 'MEB 7. Sınıf Din Kültürü ve Ahlak Bilgisi 4. Ünite: Allah\'ın Kulu ve Elçisi Hz. Muhammed. Konular: Hz. Muhammed\'in İnsani Yönü, Hz. Muhammed\'in Peygamberlik Yönü, Kafirun Suresi.'
  },
  {
    id: 'din-5',
    subjectId: 'din',
    title: '5. Ünite: İslam Düşüncesinde Yorumlar',
    description: 'Mezhepler ve düşünce ekolleri.',
    icon: '💭',
    promptContext: 'MEB 7. Sınıf Din Kültürü ve Ahlak Bilgisi 5. Ünite: İslam Düşüncesinde Yorumlar. Konular: Din Anlayışındaki Farklılıkların Sebepleri, İtikadi Yorumlar (Maturidilik, Eşarilik), Fıkhi Yorumlar (Hanefilik, Şafiilik vb.), Tasavvufi Yorumlar (Mevlevilik, Alevilik-Bektaşilik).'
  },

  // --- TDB (TEMEL DİNİ BİLGİLER) ---
  {
    id: 'tdb-1',
    subjectId: 'tdb',
    title: '1. Ünite: İman ve İslam',
    description: 'İmanın şartları, İslam\'ın şartları ve Kelime-i Tevhid.',
    icon: '📿',
    promptContext: 'MEB 7. Sınıf Temel Dini Bilgiler (TDB). Konu: İman ve İslam. Alt Başlıklar: Kelime-i Tevhid ve Kelime-i Şehadet, İmanın Şartları, İslam\'ın Şartları, Mümin ve Müslüman kavramları.'
  },
  {
    id: 'tdb-2',
    subjectId: 'tdb',
    title: '2. Ünite: İslam ve Temel Kaynaklar',
    description: 'Kur\'an-ı Kerim ve Sünnet.',
    icon: '📖',
    promptContext: 'MEB 7. Sınıf Temel Dini Bilgiler (TDB). Konu: İslam ve Temel Kaynaklar. Alt Başlıklar: Vahiy, Kur\'an-ı Kerim\'in özellikleri, Sünnet ve Hadis, Peygamberimizin rehberliği.'
  },
  {
    id: 'tdb-3',
    subjectId: 'tdb',
    title: '3. Ünite: İbadet Hayatımız',
    description: 'Namaz, Oruç, Zekat ve Hac ibadetleri.',
    icon: '🤲',
    promptContext: 'MEB 7. Sınıf Temel Dini Bilgiler (TDB). Konu: İbadet Hayatımız. Alt Başlıklar: İbadetin anlamı ve amacı, Namaz, Oruç, Zekat ve Hac ibadetlerinin temel özellikleri ve bireysel/toplumsal faydaları.'
  },
  {
    id: 'tdb-4',
    subjectId: 'tdb',
    title: '4. Ünite: Ahlaki Sorumluluklarımız',
    description: 'İslam ahlakı, güzel huy ve davranışlar.',
    icon: '💖',
    promptContext: 'MEB 7. Sınıf Temel Dini Bilgiler (TDB). Konu: Ahlak. Alt Başlıklar: İslam ahlakının kaynağı, Doğruluk, Emanet, Adalet, Merhamet, Saygı, Sevgi, Kardeşlik.'
  },
  {
    id: 'tdb-5',
    subjectId: 'tdb',
    title: '5. Ünite: Örnek Şahsiyetler',
    description: 'Peygamberimiz ve sahabelerin hayatından örnekler.',
    icon: '🌟',
    promptContext: 'MEB 7. Sınıf Temel Dini Bilgiler (TDB). Konu: Örnek Şahsiyetler. Alt Başlıklar: Hz. Muhammed\'in (s.a.v.) örnek kişiliği, Aşere-i Mübeşşere, Sahabelerin hayatından fazilet örnekleri.'
  },

  // --- SOSYAL BİLGİLER (MEB DERS KİTABI ÜNİTE YAPISI) ---
  {
    id: 'soc-1',
    subjectId: 'social',
    title: '1. Ünite: İletişim ve İnsan İlişkileri',
    description: 'İletişim, kitle iletişim araçları ve özgürlük.',
    icon: '🗣️',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 1. Ünite: İletişim ve İnsan İlişkileri. Konular: İletişim Kurarak Anlaşırım, Medya Okuryazarlığı, İletişim Özgürlüğü. Anahtar Kavramlar: Jest, mimik, empati, ben dili, sen dili, tekzip, sansür, kamuoyu.'
  },
  {
    id: 'soc-2',
    subjectId: 'social',
    title: '2. Ünite: Türk Tarihinde Yolculuk',
    description: 'Osmanlı Devleti\'nin kuruluşu, fetihler ve ıslahatlar.',
    icon: '🕌',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 2. Ünite: Türk Tarihinde Yolculuk. Konular: Boylardan Devlete (Osmanlı Kuruluş), Fetihler (İstanbul\'un Fethi), Osmanlı Kültür ve Sanatı, Islahatlar. Anahtar Kavramlar: Gaza ve cihat, istimalet politikası, devşirme sistemi, millet sistemi, divan-ı hümayun.'
  },
  {
    id: 'soc-3',
    subjectId: 'social',
    title: '3. Ünite: Ülkemizde Nüfus',
    description: 'Nüfus dağılışı, göçler ve yerleşme.',
    icon: '🗺️',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 3. Ünite: Ülkemizde Nüfus. Konular: Nereye Yerleşelim?, Türkiye\'nin Nüfus Özellikleri, Göçün Nedenleri ve Sonuçları. Anahtar Kavramlar: Nüfus yoğunluğu, kırsal nüfus, kentsel nüfus, beyin göçü, mevsimlik göç.'
  },
  {
    id: 'soc-4',
    subjectId: 'social',
    title: '4. Ünite: Zaman İçinde Bilim',
    description: 'Bilimin serüveni ve Türk-İslam bilginleri.',
    icon: '📜',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 4. Ünite: Zaman İçinde Bilim. Konular: Geçmişten Günümüze Bilginin Serüveni (Yazı, Kağıt, Matbaa), Türk-İslam Bilginleri, Bilimsel Özgürlük. Anahtar Kavramlar: Harezmi, Farabi, İbn-i Sina, Ali Kuşçu, Piri Reis, rasathane.'
  },
  {
    id: 'soc-5',
    subjectId: 'social',
    title: '5. Ünite: Ekonomi ve Sosyal Hayat',
    description: 'Tarihte üretim, vakıflar ve meslek eğitimi.',
    icon: '💰',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 5. Ünite: Ekonomi ve Sosyal Hayat. Konular: Topraktan Üretime (Tımar Sistemi), Geçmişten Günümüze Üretim Araçları, Vakıflar, Meslek Eğitimi (Ahi Teşkilatı, Lonca). Anahtar Kavramlar: Tımar, zeamet, has, vakıf medeniyeti, sanayi inkılabı.'
  },
  {
    id: 'soc-6',
    subjectId: 'social',
    title: '6. Ünite: Yaşayan Demokrasi',
    description: 'Demokrasinin tarihi ve yönetim biçimleri.',
    icon: '🗳️',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 6. Ünite: Yaşayan Demokrasi. Konular: Demokrasinin Tarihsel Gelişimi, Yönetim Biçimleri (Monarşi, Teokrasi, Oligarşi, Cumhuriyet). Anahtar Kavramlar: Egemenlik, parlamento, anayasa, kuvvetler ayrılığı.'
  },
  {
    id: 'soc-7',
    subjectId: 'social',
    title: '7. Ünite: Ülkeler Arası Köprüler',
    description: 'Küresel sorunlar ve uluslararası kuruluşlar.',
    icon: '🌐',
    promptContext: 'MEB 7. Sınıf Sosyal Bilgiler 7. Ünite: Ülkeler Arası Köprüler. Konular: Türkiye\'nin Üye Olduğu Kuruluşlar, Küresel Sorunlar (İklim Değişikliği, Açlık). Anahtar Kavramlar: Birleşmiş Milletler, NATO, TİKA, stereotip.'
  },

  // --- MATEMATİK (MEB DERS KİTABI 6 ÜNİTE YAPISI) ---
  {
    id: 'math-1',
    subjectId: 'math',
    title: '1. Ünite: Tam Sayılarla İşlemler',
    description: 'Toplama, çıkarma, çarpma, bölme ve problemler.',
    icon: '➕',
    promptContext: 'MEB 7. Sınıf Matematik 1. Ünite: Tam Sayılarla İşlemler. Konular: Tam sayılarla toplama ve çıkarma, Toplama işleminin özellikleri, Tam sayılarla çarpma ve bölme, Tam sayıların kuvvetleri. Anahtar Kavramlar: Sayı doğrusu, mutlak değer, ters eleman, etkisiz eleman, üslü nicelik.'
  },
  {
    id: 'math-2',
    subjectId: 'math',
    title: '2. Ünite: Rasyonel Sayılar',
    description: 'Rasyonel sayıların işlemleri ve problemleri.',
    icon: '➗',
    promptContext: 'MEB 7. Sınıf Matematik 2. Ünite: Rasyonel Sayılar. Konular: Rasyonel sayıları sayı doğrusunda gösterme, Ondalık gösterim, Devirli ondalık açılım, Rasyonel sayılarla dört işlem, Çok adımlı işlemler. Anahtar Kavramlar: Pay, payda, rasyonel sayı kümesi (Q).'
  },
  {
    id: 'math-3',
    subjectId: 'math',
    title: '3. Ünite: Cebirsel İfadeler ve Eşitlik',
    description: 'Cebir, örüntüler ve denklem çözme.',
    icon: 'x²',
    promptContext: 'MEB 7. Sınıf Matematik 3. Ünite: Cebirsel İfadeler ve Eşitlik. Konular: Cebirsel ifadelerle toplama ve çıkarma, Bir doğal sayı ile cebirsel ifadeyi çarpma, Sayı örüntüleri, Eşitliğin korunumu, Birinci dereceden bir bilinmeyenli denklemler. Anahtar Kavramlar: Değişken, terim, katsayı, benzer terim.'
  },
  {
    id: 'math-4',
    subjectId: 'math',
    title: '4. Ünite: Oran, Orantı ve Yüzdeler',
    description: 'Orantı problemleri ve yüzde hesapları.',
    icon: '%',
    promptContext: 'MEB 7. Sınıf Matematik 4. Ünite: Oran ve Orantı, Yüzdeler. Konular: Oranda çokluklar, Doğru orantı, Ters orantı, Yüzde hesaplamaları, Bir çokluğu diğerinin yüzdesi olarak yazma, Yüzde problemleri (kar-zarar, faiz). Anahtar Kavramlar: Orantı sabiti, içler dışlar çarpımı.'
  },
  {
    id: 'math-5',
    subjectId: 'math',
    title: '5. Ünite: Doğrular, Açılar ve Çokgenler',
    description: 'Açılar, çokgenler ve alan hesapları.',
    icon: '📐',
    promptContext: 'MEB 7. Sınıf Matematik 5. Ünite: Doğrular ve Açılar, Çokgenler. Konular: Açıortay, Paralel iki doğrunun bir kesenle yaptığı açılar (Yöndeş, İç Ters, Dış Ters), Çokgenler (Köşegen, iç açı toplamı), Dörtgenler ve özellikleri, Eşkenar dörtgen ve yamuğun alanı. Anahtar Kavramlar: Tümler, bütünler, ters açı.'
  },
  {
    id: 'math-6',
    subjectId: 'math',
    title: '6. Ünite: Çember, Daire ve Veri Analizi',
    description: 'Çemberin çevresi, dairenin alanı ve grafikler.',
    icon: '📊',
    promptContext: 'MEB 7. Sınıf Matematik 6. Ünite: Çember ve Daire, Veri Analizi. Konular: Çemberde merkez açı, Çemberin uzunluğu (çevre), Dairenin alanı, Daire diliminin alanı, Çizgi grafiği, Aritmetik ortalama, Ortanca (Medyan), Tepe değer (Mod). Anahtar Kavramlar: Yay uzunluğu, pi sayısı, daire grafiği.'
  },

  // --- FEN BİLİMLERİ ---
  {
    id: 'sci-1',
    subjectId: 'science',
    title: '1. Ünite: Güneş Sistemi ve Ötesi',
    description: 'Uzay araştırmaları, yıldızlar, galaksiler.',
    icon: '🌌',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 1. Ünite: Güneş Sistemi ve Ötesi. Konular: Uzay Araştırmaları, Gök Cisimleri. Anahtar Kavramlar: Uydu, teleskop, ışık kirliliği, bulutsu, kara delik, evren.'
  },
  {
    id: 'sci-2',
    subjectId: 'science',
    title: '2. Ünite: Hücre ve Bölünmeler',
    description: 'Mitoz, mayoz ve hücrenin yapısı.',
    icon: '🔬',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 2. Ünite: Hücre ve Bölünmeler. Konular: Hücre, Mitoz, Mayoz. Anahtar Kavramlar: Organel, DNA, kromozom, gen, hücre bölünmesi.'
  },
  {
    id: 'sci-3',
    subjectId: 'science',
    title: '3. Ünite: Kuvvet ve Enerji',
    description: 'Kütle, ağırlık, enerji dönüşümleri.',
    icon: '⚡',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 3. Ünite: Kuvvet ve Enerji. Konular: Kütle ve Ağırlık, İş ve Enerji, Enerji Dönüşümleri. Anahtar Kavramlar: Kinetik, potansiyel enerji, sürtünme kuvveti.'
  },
  {
    id: 'sci-4',
    subjectId: 'science',
    title: '4. Ünite: Saf Madde ve Karışımlar',
    description: 'Atom, element, bileşik ve karışımlar.',
    icon: '🧪',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 4. Ünite. Konular: Maddenin Tanecikli Yapısı, Saf Maddeler, Karışımlar, Geri Dönüşüm. Anahtar Kavramlar: Atom, proton, elektron, element, sembol, formül.'
  },
  {
    id: 'sci-5',
    subjectId: 'science',
    title: '5. Ünite: Işığın Madde ile Etkileşimi',
    description: 'Aynalar, mercekler ve ışığın kırılması.',
    icon: '🔦',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 5. Ünite. Konular: Işığın Soğurulması, Aynalar, Kırılma ve Mercekler.'
  },
  {
    id: 'sci-6',
    subjectId: 'science',
    title: '6. Ünite: Canlılarda Üreme',
    description: 'İnsan, bitki ve hayvanlarda üreme.',
    icon: '🌱',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 6. Ünite. Konular: İnsanda Üreme, Bitki ve Hayvanlarda Üreme, Büyüme ve Gelişme.'
  },
  {
    id: 'sci-7',
    subjectId: 'science',
    title: '7. Ünite: Elektrik Devreleri',
    description: 'Seri ve paralel bağlama.',
    icon: '💡',
    promptContext: 'MEB 7. Sınıf Fen Bilimleri 7. Ünite. Konular: Ampullerin Bağlanma Şekilleri, Seri ve Paralel Bağlama, Akım, Gerilim.'
  },

  // --- İNGİLİZCE ---
  {
    id: 'eng-1',
    subjectId: 'english',
    title: 'Unit 1: Appearance and Personality',
    description: 'Describing people and characters.',
    icon: '👱',
    promptContext: 'MEB 7th Grade English Unit 1: Appearance and Personality. Grammar: Adjectives (comparatives). Vocabulary: Physical appearance (tall, slim, blonde), Personality (generous, stubbon, selfish).'
  },
  {
    id: 'eng-2',
    subjectId: 'english',
    title: 'Unit 2: Sports',
    description: 'Daily routines and sports activities.',
    icon: '⚽',
    promptContext: 'MEB 7th Grade English Unit 2: Sports. Grammar: Simple Present Tense (frequency adverbs). Vocabulary: Individual/Team sports, equipment, medals, score.'
  },
  {
    id: 'eng-3',
    subjectId: 'english',
    title: 'Unit 3: Biographies',
    description: 'Life stories of famous people.',
    icon: '📖',
    promptContext: 'MEB 7th Grade English Unit 3: Biographies. Grammar: Simple Past Tense (was/were, regular/irregular verbs). Vocabulary: Dates, born, died, education, career, awards.'
  },
  {
    id: 'eng-4',
    subjectId: 'english',
    title: 'Unit 4: Wild Animals',
    description: 'Animals and their habitats.',
    icon: '🦁',
    promptContext: 'MEB 7th Grade English Unit 4: Wild Animals. Grammar: Should/Shouldn\'t. Vocabulary: Habitats, endangered species, prey, predator, reptiles, mammals.'
  },
  {
    id: 'eng-5',
    subjectId: 'english',
    title: 'Unit 5: Television',
    description: 'TV programmes and preferences.',
    icon: '📺',
    promptContext: 'MEB 7th Grade English Unit 5: Television. Grammar: Prefer. Vocabulary: Documentary, soap opera, sitcom, remote control, director.'
  },

  // --- TÜRKÇE ---
  {
    id: 'tr-1',
    subjectId: 'turkish',
    title: 'Dil Bilgisi: Fiiller (Eylem)',
    description: 'Kip ekleri ve kişi ekleri.',
    icon: '✍️',
    promptContext: 'MEB 7. Sınıf Türkçe Dil Bilgisi. Konu: Fiiller. Alt Başlıklar: Anlamlarına Göre Fiiller (İş, Oluş, Durum), Fiil Kipleri (Haber Kipleri, Dilek Kipleri), Fiillerde Kişi.'
  },
  {
    id: 'tr-2',
    subjectId: 'turkish',
    title: 'Dil Bilgisi: Fiillerde Yapı',
    description: 'Basit, türemiş ve birleşik fiiller.',
    icon: '🏗️',
    promptContext: 'MEB 7. Sınıf Türkçe Dil Bilgisi. Konu: Fiillerde Yapı. Alt Başlıklar: Basit Fiiller, Türemiş Fiiller, Birleşik Fiiller (Kurallı, Yardımcı Eylemle Kurulan, Anlamca Kaynaşmış).'
  },
  {
    id: 'tr-3',
    subjectId: 'turkish',
    title: 'Dil Bilgisi: Zarflar (Belirteçler)',
    description: 'Durum, zaman, miktar, yer-yön zarfları.',
    icon: '🏃',
    promptContext: 'MEB 7. Sınıf Türkçe Dil Bilgisi. Konu: Zarflar. Alt Başlıklar: Durum zarfı, Zaman zarfı, Miktar zarfı, Yer-Yön zarfı, Soru zarfı.'
  },
  {
    id: 'tr-4',
    subjectId: 'turkish',
    title: 'Dil Bilgisi: Ek Fiil (Ek Eylem)',
    description: 'İsim soylu sözcüklerin yüklem olması.',
    icon: '🔗',
    promptContext: 'MEB 7. Sınıf Türkçe Dil Bilgisi. Konu: Ek Fiil. Alt Başlıklar: İsim soylu sözcükleri yüklem yapma görevi, Basit zamanlı fiilleri birleşik zamanlı yapma görevi.'
  },
  {
    id: 'tr-5',
    subjectId: 'turkish',
    title: 'Dil Bilgisi: Anlatım Bozuklukları',
    description: 'Anlamsal bozukluklar.',
    icon: '❌',
    promptContext: 'MEB 7. Sınıf Türkçe Dil Bilgisi. Konu: Anlatım Bozuklukları (Anlamsal). Alt Başlıklar: Gereksiz sözcük kullanımı, Sözcüğün yanlış anlamda kullanımı, Çelişen sözcüklerin kullanımı.'
  },
  {
    id: 'tr-6',
    subjectId: 'turkish',
    title: 'Okuma Kültürü: Metin Türleri',
    description: 'Söyleşi, biyografi, otobiyografi.',
    icon: '📜',
    promptContext: 'MEB 7. Sınıf Türkçe. Konu: Metin Türleri. Alt Başlıklar: Söyleşi (Sohbet), Biyografi (Yaşam Öyküsü), Otobiyografi (Öz Yaşam Öyküsü), Günlük, Anı.'
  }
];
