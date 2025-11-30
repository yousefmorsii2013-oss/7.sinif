
import React, { useState } from 'react';
import { SUBJECTS } from '../constants';

// --- TYPES ---
interface Question {
  q: string;
  options: string[];
  answer: number;
}

interface TestPaper {
  id: string;
  title: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  questions: Question[];
}

interface TopicTests {
  id: string;
  title: string;
  tests: TestPaper[];
}

interface SubjectTests {
  title: string;
  topics: TopicTests[];
}

// --- STATIC DATABASE (MOCK DATA) ---

// --- FEN BİLİMLERİ (7 ÜNİTE) ---
const solarSystemQuestions: Question[] = [
    { q: 'Güneş sistemindeki en büyük gezegen hangisidir?', options: ['Dünya', 'Mars', 'Jüpiter', 'Satürn'], answer: 2 },
    { q: 'Aşağıdakilerden hangisi bir "Dış Gezegen"dir?', options: ['Merkür', 'Venüs', 'Dünya', 'Neptün'], answer: 3 },
    { q: 'Halkası en belirgin olan gezegen hangisidir?', options: ['Uranüs', 'Jüpiter', 'Satürn', 'Mars'], answer: 2 },
    { q: 'Güneş\'e en yakın gezegen hangisidir?', options: ['Merkür', 'Venüs', 'Dünya', 'Mars'], answer: 0 },
    { q: 'Kızıl Gezegen olarak bilinen gök cismi hangisidir?', options: ['Venüs', 'Mars', 'Jüpiter', 'Merkür'], answer: 1 },
    { q: 'Plüton neden gezegen sınıfından çıkarılmıştır?', options: ['Çok uzak olduğu için', 'Yörüngesini temizleyemediği için', 'Rengi soluk olduğu için', 'Uydusu olmadığı için'], answer: 1 },
    { q: 'Mars ile Jüpiter arasında bulunan kuşak hangisidir?', options: ['Kuiper Kuşağı', 'Asteroit Kuşağı', 'Meteor Kuşağı', 'Kuyruklu Yıldızlar'], answer: 1 },
    { q: 'Güneş tutulması sırasında Ay hangi evrededir?', options: ['Dolunay', 'Yeni Ay', 'İlk Dördün', 'Son Dördün'], answer: 1 },
    { q: 'Yıldızların enerjisi hangi olay sonucunda açığa çıkar?', options: ['Nükleer Füzyon', 'Yanma', 'Sürtünme', 'Buharlaşma'], answer: 0 },
    { q: 'Işık yılı ne birimidir?', options: ['Zaman', 'Hız', 'Uzaklık', 'Parlaklık'], answer: 2 },
    { q: 'Dünya\'nın tek doğal uydusu nedir?', options: ['Titan', 'Ay', 'Ganymede', 'Phobos'], answer: 1 },
    { q: 'Güneş sisteminin en sıcak gezegeni hangisidir?', options: ['Merkür', 'Venüs', 'Mars', 'Jüpiter'], answer: 1 },
    { q: 'Kendi ekseni etrafında yan yatmış bir varil gibi dönen gezegen?', options: ['Uranüs', 'Neptün', 'Satürn', 'Jüpiter'], answer: 0 }
];

const cellQuestions: Question[] = [
    { q: 'Hücrede enerji üretiminden sorumlu organel hangisidir?', options: ['Ribozom', 'Koful', 'Mitokondri', 'Lizozom'], answer: 2 },
    { q: 'Bitki hücresinde olup hayvan hücresinde olmayan yapı hangisidir?', options: ['Hücre Zarı', 'Sitoplazma', 'Hücre Duvarı', 'Çekirdek'], answer: 2 },
    { q: 'Protein sentezi yapan organel hangisidir?', options: ['Ribozom', 'Golgi', 'Sentrozom', 'Koful'], answer: 0 },
    { q: 'Hücrenin yönetim merkezi neresidir?', options: ['Sitoplazma', 'Çekirdek', 'Zar', 'Mitokondri'], answer: 1 },
    { q: 'Hangi organel "hücre içi sindirim" yapar?', options: ['Lizozom', 'Koful', 'Ribozom', 'Plastit'], answer: 0 },
    { q: 'Sentrozom organeli hangi olayda görev alır?', options: ['Enerji üretimi', 'Hücre bölünmesi', 'Salgı üretimi', 'Fotosentez'], answer: 1 },
    { q: 'Fotosentez yaparak besin ve oksijen üreten organel?', options: ['Kloroplast', 'Kromoplast', 'Lökoplast', 'Mitokondri'], answer: 0 },
    { q: 'Hücre zarı ile ilgili hangisi yanlıştır?', options: ['Canlıdır', 'Seçici geçirgendir', 'Sert ve cansızdır', 'Esnektir'], answer: 2 },
    { q: 'Çok hücreli canlılarda organizasyon sırası nasıldır?', options: ['Hücre-Doku-Organ-Sistem-Organizme', 'Doku-Hücre-Organ-Sistem', 'Organ-Sistem-Doku-Hücre', 'Hücre-Organ-Doku-Sistem'], answer: 0 },
    { q: 'Ribozom nerede bulunmaz?', options: ['Sitoplazmada', 'Mitokondride', 'Kloroplastta', 'Koful öz suyunda'], answer: 3 }
];

const forceQuestions: Question[] = [
    { q: 'Kütle ile ilgili hangisi yanlıştır?', options: ['Eşit kollu terazi ile ölçülür', 'Değişmeyen madde miktarıdır', 'Birimi Newton\'dur', 'Her yerde aynıdır'], answer: 2 },
    { q: 'Ağırlık ne ile ölçülür?', options: ['Dinamometre', 'Terazi', 'Metre', 'Kronometre'], answer: 0 },
    { q: 'Potansiyel enerji hangisine bağlıdır?', options: ['Sürat', 'Yükseklik ve Ağırlık', 'Sadece Sürat', 'Renk'], answer: 1 },
    { q: 'Sürtünme kuvveti hareketi nasıl etkiler?', options: ['Hızlandırır', 'Yönünü değiştirir', 'Yavaşlatır', 'Etkilemez'], answer: 2 },
    { q: 'Hangisi kinetik enerjiye sahiptir?', options: ['Duran top', 'Gerilmiş yay', 'Koşan çocuk', 'Dalda duran elma'], answer: 2 },
    { q: 'İş yapabilme yeteneğine ne denir?', options: ['Güç', 'Enerji', 'Kuvvet', 'Basınç'], answer: 1 },
    { q: 'Uzaya giden bir astronotun kütlesi nasıl değişir?', options: ['Artar', 'Azalır', 'Değişmez', 'Yok olur'], answer: 2 },
    { q: 'Esneklik potansiyel enerjisi hangisinde vardır?', options: ['Akan su', 'Gerilmiş lastik', 'Uçan kuş', 'Yanan ateş'], answer: 1 },
    { q: 'Hava direnci aşağıdakilerden hangisidir?', options: ['Temas gerektirmeyen kuvvet', 'Sürtünme kuvveti', 'Manyetik kuvvet', 'Elektriksel kuvvet'], answer: 1 },
    { q: 'Enerjinin yok olmayıp başka türe dönüşmesine ne denir?', options: ['Enerji kaybı', 'Enerji korunumu', 'Enerji üretimi', 'Enerji tüketimi'], answer: 1 }
];

const matterQuestions: Question[] = [
    { q: 'Atomun merkezinde ne bulunur?', options: ['Yörünge', 'Çekirdek', 'Elektron', 'Katman'], answer: 1 },
    { q: 'Negatif yüklü atom altı parçacık hangisidir?', options: ['Proton', 'Nötron', 'Elektron', 'Çekirdek'], answer: 2 },
    { q: 'Aynı cins atomlardan oluşan saf maddeye ne denir?', options: ['Bileşik', 'Element', 'Karışım', 'Çözelti'], answer: 1 },
    { q: 'Sembolü "Fe" olan element hangisidir?', options: ['Flor', 'Fosfor', 'Demir', 'Kalsiyum'], answer: 2 },
    { q: 'Formülü H2O olan bileşik hangisidir?', options: ['Tuz', 'Su', 'Şeker', 'Amonyak'], answer: 1 },
    { q: 'Karışımlar kaça ayrılır?', options: ['2 (Homojen, Heterojen)', '3', '4', 'Ayrılmazlar'], answer: 0 },
    { q: 'Zeytinyağı-Su karışımı nasıl ayrılır?', options: ['Buharlaştırma', 'Damıtma', 'Ayırma Hunisi', 'Mıknatısla'], answer: 2 },
    { q: 'Geri dönüşümün en önemli faydası nedir?', options: ['Çöpü artırmak', 'Kaynak tasarrufu', 'Maliyeti artırmak', 'Zaman kaybı'], answer: 1 },
    { q: 'Elektronların bulunduğu yere ne denir?', options: ['Çekirdek', 'Katman (Yörünge)', 'Merkez', 'Proton'], answer: 1 },
    { q: 'Nötr bir atomda hangileri eşittir?', options: ['Proton ve Nötron', 'Proton ve Elektron', 'Elektron ve Nötron', 'Hepsi'], answer: 1 }
];

const lightQuestions: Question[] = [
    { q: 'Koyu renkli cisimler ışığı ne yapar?', options: ['Yansıtır', 'Kırar', 'Soğurur', 'Geçirir'], answer: 2 },
    { q: 'Güneş enerjisiyle çalışan araçlara ne denir?', options: ['Güneş paneli', 'Radyometre', 'Güneş pili', 'Hepsi'], answer: 3 },
    { q: 'Düz aynada görüntü nasıldır?', options: ['Ters ve büyük', 'Düz ve simetrik', 'Ters ve küçük', 'Yamuk'], answer: 1 },
    { q: 'Dişçi aynası hangi tür aynadır?', options: ['Düz ayna', 'Tümsek ayna', 'Çukur ayna', 'Cam ayna'], answer: 2 },
    { q: 'Işığın ortam değiştirirken yön değiştirmesine ne denir?', options: ['Yansıma', 'Kırılma', 'Soğurulma', 'Dağılma'], answer: 1 },
    { q: 'Kalın kenarlı mercek ışığı nasıl kırar?', options: ['Toplayarak', 'Dağıtarak', 'Yansıtarak', 'Eğerek'], answer: 1 },
    { q: 'Gökkuşağı oluşumu ışığın hangi özelliğiyle ilgilidir?', options: ['Renklerine ayrılması', 'Soğurulması', 'Yansıması', 'Düz gitmesi'], answer: 0 },
    { q: 'Beyaz ışık prizmadan geçince en çok hangi renk kırılır?', options: ['Kırmızı', 'Yeşil', 'Mor', 'Sarı'], answer: 2 },
    { q: 'Hangisi ışığı en iyi yansıtır?', options: ['Siyah kumaş', 'Ayna', 'Tahta', 'Toprak'], answer: 1 },
    { q: 'Tümsek aynalar nerelerde kullanılır?', options: ['Makyaj aynası', 'Güvenlik aynası', 'Teleskop', 'Mikroskop'], answer: 1 }
];

const reproductionQuestions: Question[] = [
    { q: 'İnsanda üreme hücresi hangisidir?', options: ['Sperm ve Yumurta', 'Deri hücresi', 'Kan hücresi', 'Sinir hücresi'], answer: 0 },
    { q: 'Döllenmiş yumurtaya ne ad verilir?', options: ['Embriyo', 'Fetüs', 'Zigot', 'Bebek'], answer: 2 },
    { q: 'Erkek üreme sisteminde sperm nerede üretilir?', options: ['Testis', 'Penis', 'Salgı bezi', 'Kanal'], answer: 0 },
    { q: 'Dişi üreme sisteminde döllenme nerede olur?', options: ['Yumurtalık', 'Döl yatağı', 'Yumurta kanalı', 'Vajina'], answer: 2 },
    { q: 'Çiçekli bitkilerde erkek organın başçığında ne üretilir?', options: ['Yumurta', 'Polen', 'Tohum', 'Meyve'], answer: 1 },
    { q: 'Tohumun çimlenmesi için hangisi GEREKMEZ?', options: ['Su', 'Oksijen', 'Sıcaklık', 'Işık'], answer: 3 },
    { q: 'Vejetatif üreme hangi canlılarda görülür?', options: ['İnsanlarda', 'Bitkilerde', 'Kuşlarda', 'Balıklarda'], answer: 1 },
    { q: 'Tomurcuklanarak üreyen canlı hangisidir?', options: ['Amip', 'Hidra', 'Bakteri', 'Öglena'], answer: 1 },
    { q: 'Başkalaşım geçiren canlı hangisidir?', options: ['Kedi', 'Tavuk', 'Kurbağa', 'Yılan'], answer: 2 },
    { q: 'Rejenerasyonla (Yenilenme) üreyen canlı?', options: ['Planarya', 'İnsan', 'Kedi', 'Köpek'], answer: 0 }
];

const electricQuestions: Question[] = [
    { q: 'Ampullerin uc uca eklendiği bağlama şekli hangisidir?', options: ['Paralel', 'Seri', 'Karışık', 'Düz'], answer: 1 },
    { q: 'Seri bağlı devrede ampul sayısı artarsa parlaklık ne olur?', options: ['Artar', 'Azalır', 'Değişmez', 'Söner'], answer: 1 },
    { q: 'Evimizdeki prizler birbirine nasıl bağlıdır?', options: ['Seri', 'Paralel', 'Karışık', 'Bağlı değildir'], answer: 1 },
    { q: 'Elektrik akımını ölçen alet hangisidir?', options: ['Voltmetre', 'Ampermetre', 'Termometre', 'Barometre'], answer: 1 },
    { q: 'Ampermetre devreye nasıl bağlanır?', options: ['Seri', 'Paralel', 'Her türlü', 'Bağlanmaz'], answer: 0 },
    { q: 'Gerilimi (Potansiyel Farkı) ölçen alet?', options: ['Voltmetre', 'Ampermetre', 'Direnç', 'Pil'], answer: 0 },
    { q: 'Paralel bağlı kollardaki gerilim nasıldır?', options: ['Eşittir', 'Farklıdır', 'Sıfırdır', 'Bilinmez'], answer: 0 },
    { q: 'Direnci azaltırsak akım nasıl değişir (Ohm Kanunu)?', options: ['Azalır', 'Artar', 'Değişmez', 'Sıfırlanır'], answer: 1 },
    { q: 'Kısa devre nedir?', options: ['Akımın dirençsiz yolu izlemesi', 'Devrenin kopması', 'Pilin bitmesi', 'Ampulün patlaması'], answer: 0 },
    { q: 'Sigortanın görevi nedir?', options: ['Işık vermek', 'Devreyi korumak', 'Isı üretmek', 'Sesi iletmek'], answer: 1 }
];

// --- MATEMATİK (6 ÜNİTE) ---
const mathIntQuestions: Question[] = [
    { q: '(-5) + (+3) işleminin sonucu kaçtır?', options: ['-2','-8','2','8'], answer: 0 },
    { q: '(+10) + (-7) işleminin sonucu kaçtır?', options: ['3','-3','17','-17'], answer: 0 },
    { q: '(-2) + (-4) işleminin sonucu kaçtır?', options: ['-6','6','2','-2'], answer: 0 },
    { q: 'En büyük negatif tam sayı kaçtır?', options: ['-1','-99','0','1'], answer: 0 },
    { q: 'Mutlak değeri 5 olan tamsayılar hangileridir?', options: ['Sadece 5','Sadece -5','5 ve -5','0'], answer: 2 },
    { q: '(-3) x (-4) işleminin sonucu?', options: ['-12','12','7','-7'], answer: 1 },
    { q: '(-12) : (+3) işleminin sonucu?', options: ['-4', '4', '-36', '36'], answer: 0 },
    { q: 'Hava sıcaklığı -5 derecedir. 3 derece düşerse kaç olur?', options: ['-2', '-8', '2', '8'], answer: 1 },
    { q: 'Çarpma işleminin yutan elemanı nedir?', options: ['0', '1', '-1', 'Yoktur'], answer: 0 },
    { q: '(-1)^100 işleminin sonucu kaçtır?', options: ['1', '-1', '100', '-100'], answer: 0 }
];

const mathRatQuestions: Question[] = [
    { q: '3/4 kesrinin ondalık gösterimi nedir?', options: ['0,75', '0,25', '3,4', '0,34'], answer: 0 },
    { q: 'Hangisi bir rasyonel sayı değildir?', options: ['5', '0', '-3/7', '5/0'], answer: 3 },
    { q: '0,5 sayısı rasyonel olarak nasıl gösterilir?', options: ['1/2', '1/5', '5/1', '2/5'], answer: 0 },
    { q: '(-1/2) + (1/2) işleminin sonucu?', options: ['0', '1', '-1', '1/4'], answer: 0 },
    { q: '2/3 ün çarpma işlemine göre tersi nedir?', options: ['-2/3', '3/2', '-3/2', '1'], answer: 1 },
    { q: 'Aşağıdakilerden hangisi en büyüktür?', options: ['1/2', '1/3', '1/4', '1/5'], answer: 0 },
    { q: 'Devirli ondalık gösterim 0,333... hangisine eşittir?', options: ['1/3', '3/10', '3/99', '30/100'], answer: 0 },
    { q: '(-2/5) . (5/2) sonucu kaçtır?', options: ['1', '-1', '0', '25/4'], answer: 1 },
    { q: 'Bir pastanın 3/8 ini Ali yedi. Geriye ne kadar kaldı?', options: ['5/8', '3/8', '1/2', '4/8'], answer: 0 },
    { q: 'Hangisi negatif rasyonel sayıdır?', options: ['-1/2', '0', '5', '(-2)/(-3)'], answer: 0 }
];

const mathAlgQuestions: Question[] = [
    { q: '3x + 5 ifadesinde x=2 için sonuç kaçtır?', options: ['11', '8', '6', '10'], answer: 0 },
    { q: 'Bir sayının 3 katının 2 eksiği nasıl yazılır?', options: ['3x-2', '3(x-2)', '2x-3', 'x-5'], answer: 0 },
    { q: 'Benzer terimler hangisidir?', options: ['3x ve 3y', '2a ve 5a', '4x ve 4', '5a ve 5b'], answer: 1 },
    { q: '2(x+3) ifadesinin açılımı nedir?', options: ['2x+3', '2x+6', 'x+6', '2x-6'], answer: 1 },
    { q: '3, 6, 9, 12... örüntüsünün kuralı nedir?', options: ['3n', 'n+3', '3n+1', 'n-3'], answer: 0 },
    { q: '2x - 4 = 10 denkleminin çözümü nedir?', options: ['3', '5', '7', '8'], answer: 2 },
    { q: '3x = 15 ise x kaçtır?', options: ['3', '5', '12', '45'], answer: 1 },
    { q: 'Hangi sayının 5 fazlası 12 eder?', options: ['5', '6', '7', '8'], answer: 2 },
    { q: '5x + 2x işleminin sonucu?', options: ['7x', '10x', '3x', '7'], answer: 0 },
    { q: 'Eşitliğin her iki tarafına aynı sayı eklenirse eşitlik bozulur mu?', options: ['Evet', 'Hayır', 'Bazen', 'Sayıya bağlı'], answer: 1 }
];

const mathRatioQuestions: Question[] = [
    { q: '2/5 = x/10 orantısında x kaçtır?', options: ['2', '4', '5', '8'], answer: 1 },
    { q: '300 TL nin %20 si kaç TL dir?', options: ['60', '30', '20', '100'], answer: 0 },
    { q: 'Bir mal %10 karla 110 TL ye satılıyor. Maliyeti kaçtır?', options: ['90', '100', '105', '99'], answer: 1 },
    { q: 'Hızı 60 km/s olan araç 3 saatte kaç km gider?', options: ['120', '180', '200', '90'], answer: 1 },
    { q: 'Aynı işi 2 işçi 10 günde yaparsa 4 işçi kaç günde yapar (Ters Orantı)?', options: ['20', '5', '10', '8'], answer: 1 },
    { q: 'Hangi sayının %50 si 40 tır?', options: ['20', '60', '80', '100'], answer: 2 },
    { q: '5 kalemi 20 TL olanın 1 kalemi kaç TL dir?', options: ['2', '3', '4', '5'], answer: 2 },
    { q: '1/200000 ölçekli haritada 1 cm gerçekte kaç km dir?', options: ['2 km', '20 km', '200 km', '0.2 km'], answer: 0 },
    { q: 'Tuz oranı %20 olan 100g karışımda kaç g tuz vardır?', options: ['10', '20', '30', '40'], answer: 1 },
    { q: '%25 indirimli fiyatı 75 TL olan gömleğin asıl fiyatı?', options: ['80', '90', '100', '120'], answer: 2 }
];

const mathGeoQuestions: Question[] = [
    { q: 'Tümler iki açıdan biri 30 derece ise diğeri kaçtır?', options: ['60', '150', '30', '90'], answer: 0 },
    { q: 'Bütünler iki açının toplamı kaç derecedir?', options: ['90', '180', '360', '270'], answer: 1 },
    { q: 'İç ters açıların ölçüleri nasıldır?', options: ['Eşittir', 'Farklıdır', 'Toplamı 180 dir', 'Bilinmez'], answer: 0 },
    { q: 'Düzgün beşgenin bir iç açısı kaç derecedir?', options: ['108', '120', '90', '72'], answer: 0 },
    { q: 'Düzgün altıgenin dış açısı kaç derecedir?', options: ['60', '90', '120', '72'], answer: 0 },
    { q: 'Yamuğun alanı nasıl bulunur?', options: ['(Alt+Üst)xYükseklik/2', 'Taban x Yükseklik', 'İki kenar çarpımı', 'Taban x Yükseklik/2'], answer: 0 },
    { q: 'Eşkenar dörtgenin köşegenleri nasıl kesişir?', options: ['Dik', 'Paralel', 'Kesişmez', 'Eğik'], answer: 0 },
    { q: 'Üçgenin iç açıları toplamı kaçtır?', options: ['180', '360', '90', '270'], answer: 0 },
    { q: 'Dörtgenin dış açıları toplamı kaçtır?', options: ['180', '360', '90', '540'], answer: 1 },
    { q: 'Paralelkenarın karşılıklı açıları nasıldır?', options: ['Eşittir', 'Bütünlerdir', 'Tümlerdir', 'Farklıdır'], answer: 0 }
];

const mathCircleQuestions: Question[] = [
    { q: 'Çemberin en uzun kirişine ne denir?', options: ['Yarıçap', 'Çap', 'Yay', 'Teğet'], answer: 1 },
    { q: 'Çapı 10 cm olan çemberin yarıçapı kaçtır?', options: ['10', '20', '5', '2.5'], answer: 2 },
    { q: 'Çevre formülü nedir (r yarıçap)?', options: ['2.pi.r', 'pi.r.kare', '2.pi', 'pi.r'], answer: 0 },
    { q: 'Alan formülü nedir?', options: ['2.pi.r', 'pi.r.kare', 'pi.r', 'r.kare'], answer: 1 },
    { q: 'Merkez açının gördüğü yayın ölçüsü nasıldır?', options: ['Açıya eşittir', 'Açının yarısıdır', 'Açının iki katıdır', '180 eksidir'], answer: 0 },
    { q: 'Pi sayısı yaklaşık kaçtır?', options: ['3', '3.14', '22/7', 'Hepsi'], answer: 3 },
    { q: 'Verilerin ortalamasını gösteren değere ne denir?', options: ['Aritmetik Ortalama', 'Mod', 'Medyan', 'Açıklık'], answer: 0 },
    { q: 'Bir veri grubunda en çok tekrar eden değere ne denir?', options: ['Mod (Tepe Değer)', 'Medyan', 'Ortalama', 'Açıklık'], answer: 0 },
    { q: 'Küçükten büyüğe sıralandığında ortadaki değere ne denir?', options: ['Medyan (Ortanca)', 'Mod', 'Ortalama', 'Frekans'], answer: 0 },
    { q: 'Yarıçapı 3 cm olan dairenin alanı? (pi=3)', options: ['9', '18', '27', '36'], answer: 2 }
];

// --- SOSYAL BİLGİLER (7 ÜNİTE) ---
const socialCommQuestions: Question[] = [
    { q: 'Etkili iletişimi olumsuz etkileyen davranış hangisidir?', options: ['Empati kurmak', 'Göz teması kurmak', 'Öğüt vermek', 'Dikkatli dinlemek'], answer: 2 },
    { q: 'Ben dili kullanan biri nasıl konuşur?', options: ['"Çok yaramazsın"', '"Seni hiç sevmiyorum"', '"Davranışın beni üzdü"', '"Hep geç kalıyorsun"'], answer: 2 },
    { q: 'Empati nedir?', options: ['Kendini başkasının yerine koyma', 'Sürekli konuşma', 'Küsme', 'Bağırma'], answer: 0 },
    { q: 'Kitle iletişim araçlarının genel adı nedir?', options: ['Medya', 'Gazete', 'Telefon', 'İnternet'], answer: 0 },
    { q: 'RTÜK\'ün görevi nedir?', options: ['Yayınları denetlemek', 'Yol yapmak', 'Okul açmak', 'Para basmak'], answer: 0 },
    { q: 'Basın özgürlüğünün kısıtlandığı duruma ne denir?', options: ['Sansür', 'Tekzip', 'Manşet', 'Sütun'], answer: 0 },
    { q: 'Yanlış bir haberi düzeltme yazısına ne denir?', options: ['Tekzip', 'İlan', 'Reklam', 'Haber'], answer: 0 },
    { q: 'İletişimde jest ve mimik ne anlama gelir?', options: ['Beden dili', 'Yazı dili', 'Sözlü iletişim', 'Resim'], answer: 0 },
    { q: 'Aşağıdakilerden hangisi olumlu iletişim örneğidir?', options: ['Yargılamak', 'Dinlemek', 'Alay etmek', 'Lakap takmak'], answer: 1 },
    { q: 'Kamuoyu oluşturmada hangisi etkilidir?', options: ['Medya', 'Hava durumu', 'Trafik', 'Marketler'], answer: 0 }
];

const socialHistoryQuestions: Question[] = [
    { q: 'Osmanlı Devleti\'nin kurucusu kimdir?', options: ['Orhan Bey', 'Osman Bey', 'Fatih Sultan Mehmet', 'Yavuz Sultan Selim'], answer: 1 },
    { q: 'İstanbul\'un fethi hangi padişah döneminde gerçekleşti?', options: ['II. Mehmet (Fatih)', 'I. Murat', 'Yıldırım Bayezid', 'Kanuni Sultan Süleyman'], answer: 0 },
    { q: 'Osmanlı\'da devşirme sisteminin uygulandığı ordu?', options: ['Tımarlı Sipahi', 'Yeniçeri Ocağı', 'Akıncılar', 'Leventler'], answer: 1 },
    { q: 'Divan-ı Hümayun günümüzdeki hangi kuruma benzer?', options: ['Belediye', 'Bakanlar Kurulu', 'Muhtarlık', 'Mahkeme'], answer: 1 },
    { q: 'Lale Devri hangi olayla sona ermiştir?', options: ['Patrona Halil İsyanı', 'Kabakçı Mustafa İsyanı', '31 Mart Vakası', 'Vaka-i Vakvakiye'], answer: 0 },
    { q: 'Osmanlı\'nın Rumeli\'deki ilk toprak parçası?', options: ['Çimpe Kalesi', 'Gelibolu', 'Edirne', 'Selanik'], answer: 0 },
    { q: 'Yavuz Sultan Selim hangi seferle Halifeliği aldı?', options: ['Mısır Seferi', 'Çaldıran', 'Mohaç', 'Viyana'], answer: 0 },
    { q: 'Osmanlı\'da deniz askerlerine ne denir?', options: ['Levent', 'Yeniçeri', 'Sipahi', 'Lağımcı'], answer: 0 },
    { q: 'Fatih Sultan Mehmet\'in İstanbul\'u fethettiği yıl?', options: ['1453', '1299', '1071', '1923'], answer: 0 },
    { q: 'İstimalet Politikası nedir?', options: ['Hoşgörü politikası', 'Savaş politikası', 'Vergi politikası', 'Sürgün politikası'], answer: 0 }
];

const socialGeoQuestions: Question[] = [
    { q: 'Nüfus sayımını Türkiye\'de hangi kurum yapar?', options: ['TÜİK', 'MEB', 'TBMM', 'AFAD'], answer: 0 },
    { q: 'Hangisi göçün doğal nedenlerinden biridir?', options: ['Deprem', 'Savaş', 'İş bulma', 'Eğitim'], answer: 0 },
    { q: 'Türkiye\'de nüfusun en yoğun olduğu bölge?', options: ['Marmara', 'Doğu Anadolu', 'Karadeniz', 'Akdeniz'], answer: 0 },
    { q: 'Beyin göçü nedir?', options: ['Eğitimli kişilerin yurt dışına gitmesi', 'İşçi göçü', 'Turistik gezi', 'Mevsimlik göç'], answer: 0 },
    { q: 'Kırsal kesimden kente yapılan göçün en büyük sebebi?', options: ['İş imkanları', 'Havası', 'Trafiği', 'Gürültüsü'], answer: 0 },
    { q: 'Yerleşmeyi etkileyen doğal faktör hangisidir?', options: ['İklim', 'Sanayi', 'Ulaşım', 'Turizm'], answer: 0 },
    { q: 'Mevsimlik göç en çok hangi amaçla yapılır?', options: ['Tarım ve Turizm', 'Eğitim', 'Sağlık', 'Askerlik'], answer: 0 },
    { q: 'Nüfus artış hızı nasıl bulunur?', options: ['Doğumlar - Ölümler + Göçler', 'Sadece Doğumlar', 'Sadece Göçler', 'Ölümler'], answer: 0 },
    { q: 'Türkiye\'de nüfusun dağılışını en çok ne etkiler?', options: ['Yer şekilleri ve İklim', 'Madenler', 'Ormanlar', 'Nehirler'], answer: 0 },
    { q: 'Hangi ilimizde nüfus yoğunluğu en azdır?', options: ['Tunceli', 'İstanbul', 'İzmir', 'Ankara'], answer: 0 }
];

const socialScienceQuestions: Question[] = [
    { q: 'Matbaayı Osmanlı\'ya getiren kişi?', options: ['İbrahim Müteferrika', 'Evliya Çelebi', 'Katip Çelebi', 'Takiyüddin'], answer: 0 },
    { q: 'Sıfır rakamını bulan İslam bilgini?', options: ['Harezmi', 'Farabi', 'İbn-i Sina', 'Biruni'], answer: 0 },
    { q: '"Tıbbın Kanunu" kitabını yazan bilgin?', options: ['İbn-i Sina', 'Ali Kuşçu', 'Piri Reis', 'Gazali'], answer: 0 },
    { q: 'Piri Reis neyi ile ünlüdür?', options: ['Dünya Haritası', 'Uçuş denemesi', 'Matematik kitabı', 'Tıp çalışmaları'], answer: 0 },
    { q: 'Bilginin korunmasında hangisi ilk aşamadır?', options: ['Yazının icadı', 'Bilgisayar', 'Matbaa', 'Telefon'], answer: 0 },
    { q: 'Rasathane kuran Türk hükümdar kimdir?', options: ['Uluğ Bey', 'Fatih', 'Yavuz', 'Kanuni'], answer: 0 },
    { q: 'Buhar makinesinin icadı neyi başlattı?', options: ['Sanayi İnkılabı', 'Fransız İhtilali', 'Rönesans', 'Reform'], answer: 0 },
    { q: 'Özgür düşüncenin bilime katkısı nedir?', options: ['Bilimi geliştirir', 'Engeller', 'Etkilemez', 'Yavaşlatır'], answer: 0 },
    { q: 'Ali Kuşçu hangi alanda çalışmıştır?', options: ['Astronomi ve Matematik', 'Tıp', 'Tarih', 'Edebiyat'], answer: 0 },
    { q: 'Kağıdı kimler icat etmiştir?', options: ['Çinliler', 'Türkler', 'Mısırlılar', 'Sümerler'], answer: 0 }
];

const socialEcoQuestions: Question[] = [
    { q: 'Osmanlı\'da toprağa dayalı askeri sistem?', options: ['Tımar Sistemi', 'Devşirme', 'Kafes', 'Müsadere'], answer: 0 },
    { q: 'Ahi teşkilatının kurucusu kimdir?', options: ['Ahi Evran', 'Mevlana', 'Yunus Emre', 'Hacı Bektaş'], answer: 0 },
    { q: 'Vakıfların temel amacı nedir?', options: ['Toplumsal yardım', 'Savaşmak', 'Para kazanmak', 'Yönetim'], answer: 0 },
    { q: 'Sanayi İnkılabı nerede başladı?', options: ['İngiltere', 'Fransa', 'Almanya', 'ABD'], answer: 0 },
    { q: 'Lonca teşkilatında meslek öğrenen çırağın yükselmesi?', options: ['Ustalık', 'Vezirlik', 'Paşalık', 'Beylik'], answer: 0 },
    { q: 'Osmanlı\'da nitelikli insan yetiştiren kurum?', options: ['Enderun', 'Kışla', 'Hamam', 'Çarşı'], answer: 0 },
    { q: 'Tımar sistemi bozulunca ne oldu?', options: ['Üretim azaldı, güvenlik bozuldu', 'Zenginlik arttı', 'Ordu güçlendi', 'Halk mutlu oldu'], answer: 0 },
    { q: 'Günümüzde mesleki eğitim veren liseler?', options: ['Meslek Liseleri', 'Fen Liseleri', 'Anadolu Liseleri', 'Spor Liseleri'], answer: 0 },
    { q: 'Dijital teknoloji üretimi nasıl etkiledi?', options: ['Hızlandırdı', 'Yavaşlattı', 'Bitirdi', 'Zorlaştırdı'], answer: 0 },
    { q: 'E-ticaret nedir?', options: ['İnternetten alışveriş', 'Pazardan alışveriş', 'Takas', 'Hediyeleşme'], answer: 0 }
];

const socialDemoQuestions: Question[] = [
    { q: 'Halkın kendi kendini yönettiği sistem?', options: ['Cumhuriyet', 'Monarşi', 'Oligarşi', 'Teokrasi'], answer: 0 },
    { q: 'Tek kişinin egemen olduğu yönetim?', options: ['Monarşi', 'Demokrasi', 'Cumhuriyet', 'Meşrutiyet'], answer: 0 },
    { q: 'Dini kurallara dayalı yönetim?', options: ['Teokrasi', 'Oligarşi', 'Cumhuriyet', 'Demokrasi'], answer: 0 },
    { q: 'Magna Carta neyin başlangıcı sayılır?', options: ['Demokrasinin', 'Krallığın', 'Savaşın', 'Ticaretin'], answer: 0 },
    { q: 'Türkiye Cumhuriyeti ne zaman kuruldu?', options: ['1923', '1920', '1919', '1881'], answer: 0 },
    { q: 'Kuvvetler ayrılığı nedir?', options: ['Yasama, Yürütme, Yargının ayrı olması', 'Güçlü olmak', 'Ordunun ayrılması', 'Halkın ayrılması'], answer: 0 },
    { q: 'Yasama yetkisi kime aittir?', options: ['TBMM', 'Cumhurbaşkanı', 'Mahkemeler', 'Polis'], answer: 0 },
    { q: 'Yargı yetkisi kime aittir?', options: ['Bağımsız Mahkemeler', 'Meclis', 'Hükümet', 'Muhtar'], answer: 0 },
    { q: 'Seçme ve seçilme hakkı neyin gereğidir?', options: ['Demokrasinin', 'Monarşinin', 'Oligarşinin', 'Krallığın'], answer: 0 },
    { q: 'Demokrasilerde yöneticiler nasıl belirlenir?', options: ['Seçimle', 'Babadan oğula', 'Zorla', 'Kura ile'], answer: 0 }
];

const socialIntQuestions: Question[] = [
    { q: 'Türkiye\'nin üye olduğu askeri örgüt?', options: ['NATO', 'AB', 'WHO', 'UNICEF'], answer: 0 },
    { q: 'Birleşmiş Milletlerin amacı nedir?', options: ['Dünya barışını korumak', 'Savaş çıkarmak', 'Ticaret yapmak', 'Spor yapmak'], answer: 0 },
    { q: 'TİKA hangi alanda faaliyet gösterir?', options: ['Kalkınma ve İşbirliği', 'Askeri', 'Spor', 'Müzik'], answer: 0 },
    { q: 'Küresel ısınmanın temel nedeni?', options: ['Sera gazları', 'Ağaç dikmek', 'Güneşin büyümesi', 'Denizlerin soğuması'], answer: 0 },
    { q: 'Stereotip ne demektir?', options: ['Kalıp yargı', 'Gerçek bilgi', 'Bilimsel veri', 'Doğru haber'], answer: 0 },
    { q: 'UNESCO neyi korur?', options: ['Kültürel Mirası', 'Bankaları', 'Orduları', 'Fabrikaları'], answer: 0 },
    { q: 'Dünya Sağlık Örgütü\'nün kısaltması?', options: ['WHO', 'NATO', 'UN', 'IMF'], answer: 0 },
    { q: 'Açlık ve yoksullukla mücadele eden küresel sorun?', options: ['Gelir adaletsizliği', 'Teknoloji', 'Eğitim', 'Sanat'], answer: 0 },
    { q: 'Türkiye\'nin AB üyeliği süreci ne durumdadır?', options: ['Aday ülke', 'Tam üye', 'Üye değil', 'Kurucu üye'], answer: 0 },
    { q: 'Türk kültürünü yurt dışında tanıtan kurum?', options: ['Yunus Emre Enstitüsü', 'TÜBİTAK', 'ASELSAN', 'THY'], answer: 0 }
];

// --- İNGİLİZCE (5 ÜNİTE) ---
const engUnit1: Question[] = [
    { q: 'Which one describes personality?', options: ['Generous', 'Tall', 'Fat', 'Blue eyes'], answer: 0 },
    { q: '"She never changes her mind." She is ...', options: ['Stubborn', 'Shy', 'Outgoing', 'Punctual'], answer: 0 },
    { q: 'Which is correct?', options: ['Ali is taller than Veli', 'Ali is tall than Veli', 'Ali is more tall Veli', 'Ali taller Veli'], answer: 0 },
    { q: 'Opposite of "hardworking"?', options: ['Lazy', 'Smart', 'Funny', 'Easy'], answer: 0 },
    { q: '"He likes making jokes." He is ...', options: ['Funny', 'Serious', 'Boring', 'Quiet'], answer: 0 },
    { q: '"She has got _____ hair."', options: ['curly', 'kind', 'polite', 'honest'], answer: 0 },
    { q: 'What does "Generous" mean?', options: ['Cömert', 'Cimri', 'Kaba', 'Sinirli'], answer: 0 },
    { q: 'Comparison form of "Good"?', options: ['Better', 'Gooder', 'More good', 'Best'], answer: 0 },
    { q: 'She is _____ than her sister.', options: ['more beautiful', 'beautifuller', 'beautiful', 'most beautiful'], answer: 0 },
    { q: '"I always arrive on time." I am ...', options: ['Punctual', 'Late', 'Clumsy', 'Forgetful'], answer: 0 }
];

const engUnit2: Question[] = [
    { q: 'How often do you swim?', options: ['Twice a week', 'In the pool', 'Yes I do', 'Football'], answer: 0 },
    { q: 'Which is an INDIVIDUAL sport?', options: ['Archery', 'Football', 'Basketball', 'Volleyball'], answer: 0 },
    { q: 'We use a racket for ...', options: ['Tennis', 'Soccer', 'Boxing', 'Swimming'], answer: 0 },
    { q: 'What is the score?', options: ['It is a draw', 'It is a ball', 'It is a stadium', 'It is a medal'], answer: 0 },
    { q: 'To win a game, you must ...', options: ['beat the opponent', 'lose points', 'sleep', 'eat'], answer: 0 },
    { q: '"Spectator" means ...', options: ['Seyirci', 'Oyuncu', 'Hakem', 'Antrenör'], answer: 0 },
    { q: 'He _____ training every day.', options: ['goes', 'plays', 'does', 'makes'], answer: 0 },
    { q: 'Gold, Silver and Bronze ...', options: ['Medals', 'Balls', 'Rackets', 'Nets'], answer: 0 },
    { q: '"Draw" means ...', options: ['Berabere', 'Yenmek', 'Kaybetmek', 'Çizmek'], answer: 0 },
    { q: 'Which equipment is for cycling?', options: ['Helmet', 'Goggles', 'Bat', 'Net'], answer: 0 }
];

const engUnit3: Question[] = [
    { q: 'Atatürk was born _____ 1881.', options: ['in', 'on', 'at', 'of'], answer: 0 },
    { q: 'He _____ a Nobel Prize last year.', options: ['won', 'win', 'wins', 'winning'], answer: 0 },
    { q: 'Graham Bell _____ the telephone.', options: ['invented', 'discovered', 'found', 'did'], answer: 0 },
    { q: 'She _____ to London two years ago.', options: ['moved', 'move', 'moves', 'moving'], answer: 0 },
    { q: 'What is "Biography"?', options: ['Life story', 'Fairy tale', 'News', 'Poem'], answer: 0 },
    { q: 'He _____ alone.', options: ['lived', 'lives', 'live', 'leaving'], answer: 0 },
    { q: 'Did you _____ the match?', options: ['watch', 'watched', 'watches', 'watching'], answer: 0 },
    { q: 'They _____ happy yesterday.', options: ['were', 'was', 'did', 'are'], answer: 0 },
    { q: 'He died _____ age 75.', options: ['at', 'in', 'on', 'of'], answer: 0 },
    { q: '"Graduate" means ...', options: ['Mezun olmak', 'Okula başlamak', 'Doğmak', 'Ölmek'], answer: 0 }
];

const engUnit4: Question[] = [
    { q: 'Lions are _____ animals.', options: ['wild', 'domestic', 'pet', 'farm'], answer: 0 },
    { q: 'Pandas eat ...', options: ['bamboo', 'meat', 'fish', 'pizza'], answer: 0 },
    { q: 'Why are dinosaurs extinct?', options: ['Climate change / Meteor', 'They moved', 'They are sleeping', 'They are hiding'], answer: 0 },
    { q: 'We should _____ habitats.', options: ['protect', 'destroy', 'pollute', 'cut'], answer: 0 },
    { q: 'Birds have got ...', options: ['wings', 'fins', 'scales', 'fur'], answer: 0 },
    { q: 'Which animal is a reptile?', options: ['Snake', 'Eagle', 'Lion', 'Whale'], answer: 0 },
    { q: '"Endangered" means ...', options: ['Nesli tükenmekte', 'Çok kalabalık', 'Evcil', 'Tehlikeli'], answer: 0 },
    { q: 'Elephants have got long ...', options: ['trunks', 'necks', 'tails', 'wings'], answer: 0 },
    { q: 'A giraffe is _____ than a lion.', options: ['taller', 'shorter', 'smaller', 'slower'], answer: 0 },
    { q: 'Tigers are ...', options: ['Carnivores', 'Herbivores', 'Omnivores', 'Plants'], answer: 0 }
];

const engUnit5: Question[] = [
    { q: 'I watch _____ to learn about animals.', options: ['documentaries', 'news', 'quiz shows', 'cartoons'], answer: 0 },
    { q: 'I _____ watching comedies to horrors.', options: ['prefer', 'hate', 'like', 'don\'t like'], answer: 0 },
    { q: 'My favorite TV _____ is "Friends".', options: ['series', 'news', 'commercial', 'weather'], answer: 0 },
    { q: 'Can you give me the _____ control?', options: ['remote', 'far', 'tv', 'distance'], answer: 0 },
    { q: 'She thinks news is _____.', options: ['boring', 'bore', 'bored', 'bores'], answer: 0 },
    { q: 'We watched a _____ show last night.', options: ['talk', 'speak', 'tell', 'say'], answer: 0 },
    { q: 'I recommend this film. It is ...', options: ['entertaining', 'dull', 'bad', 'scary'], answer: 0 },
    { q: '"Director" means ...', options: ['Yönetmen', 'Oyuncu', 'Kameraman', 'Seyirci'], answer: 0 },
    { q: 'Reality shows are very ...', options: ['popular', 'lazy', 'heavy', 'wet'], answer: 0 },
    { q: 'What\'s on TV tonight?', options: ['Let\'s check the TV guide', 'It is black', 'I am eating', 'No'], answer: 0 }
];

// --- TÜRKÇE (KONULAR) ---
const trVerbQuestions: Question[] = [
    { q: 'Hangisi iş (kılış) fiilidir?', options: ['Okumak', 'Uyumak', 'Sararmak', 'Büyümek'], answer: 0 },
    { q: 'Hangisi durum fiilidir?', options: ['Gülmek', 'Yazmak', 'Silmek', 'Taşımak'], answer: 0 },
    { q: 'Hangisi oluş fiilidir?', options: ['Paslanmak', 'Bakmak', 'Görmek', 'Yürümek'], answer: 0 },
    { q: '"Geliyor" fiilinin kipi nedir?', options: ['Şimdiki Zaman', 'Geniş Zaman', 'Gelecek Zaman', 'Geçmiş Zaman'], answer: 0 },
    { q: '"Okumalısın" fiilinin kipi nedir?', options: ['Gereklilik', 'İstek', 'Emir', 'Şart'], answer: 0 },
    { q: '"Baksam" fiilinin kipi nedir?', options: ['Şart', 'İstek', 'Emir', 'Görülen Geçmiş'], answer: 0 },
    { q: 'Hangisi haber kipi değildir?', options: ['İstek', 'Geniş', 'Şimdiki', 'Gelecek'], answer: 0 },
    { q: '"Gideceğim" fiilinin kişisi kimdir?', options: ['Ben', 'Sen', 'O', 'Biz'], answer: 0 },
    { q: 'Emir kipinin eki nedir?', options: ['Eki yoktur', '-meli', '-se', '-e'], answer: 0 },
    { q: '"Yapmış" fiili hangi zamandadır?', options: ['Duyulan Geçmiş', 'Görülen Geçmiş', 'Şimdiki', 'Geniş'], answer: 0 }
];

const trStructQuestions: Question[] = [
    { q: 'Hangisi basit yapılı fiildir?', options: ['Koştu', 'Temizledi', 'Yapabildi', 'Gözledi'], answer: 0 },
    { q: 'Hangisi türemiş fiildir?', options: ['Başladı (Baş-la)', 'Geldi', 'Gitti', 'Baktı'], answer: 0 },
    { q: '"Hissetti" fiilinin yapısı nedir?', options: ['Birleşik', 'Basit', 'Türemiş', 'Hiçbiri'], answer: 0 },
    { q: '"Gelebilirim" fiili hangi tür birleşiktir?', options: ['Kurallı (Yeterlilik)', 'Yardımcı Eylemle', 'Anlamca Kaynaşmış', 'Türemiş'], answer: 0 },
    { q: '"Vazgeçmek" fiili hangi türdür?', options: ['Anlamca Kaynaşmış Birleşik', 'Kurallı Birleşik', 'Yardımcı Eylem', 'Basit'], answer: 0 },
    { q: 'Hangisi yardımcı eylemle kurulmuştur?', options: ['Yardım etti', 'Bakakaldı', 'Gidiverdi', 'Düşeyazdı'], answer: 0 },
    { q: '"Suladı" fiilinin kökü nedir?', options: ['Su', 'Sula', 'Sulad', 'Sul'], answer: 0 },
    { q: 'Yapım eki alan fiillere ne denir?', options: ['Türemiş', 'Basit', 'Birleşik', 'Kök'], answer: 0 },
    { q: '"Gidiver" fiilinin anlamı nedir?', options: ['Tezlik', 'Süreklilik', 'Yeterlilik', 'Yaklaşma'], answer: 0 },
    { q: '"Bakamam" fiilinin olumlusu nedir?', options: ['Bakabilirim', 'Bakarım', 'Bakmalıyım', 'Baktım'], answer: 0 }
];

const trAdvQuestions: Question[] = [
    { q: 'Fiilleri niteleyen sözcüklere ne denir?', options: ['Zarf', 'Sıfat', 'Zamir', 'Edat'], answer: 0 },
    { q: '"Hızlı koştu" cümlesinde zarf hangisidir?', options: ['Hızlı', 'Koştu', 'Gizli özne', 'Yok'], answer: 0 },
    { q: '"Yarın gideceğiz" cümlesindeki zarfın türü?', options: ['Zaman', 'Durum', 'Miktar', 'Yer-Yön'], answer: 0 },
    { q: '"Çok çalıştı" cümlesindeki zarfın türü?', options: ['Miktar', 'Durum', 'Zaman', 'Soru'], answer: 0 },
    { q: '"İçeri girdi" cümlesindeki zarf hangisidir?', options: ['İçeri', 'Girdi', 'O', 'Yok'], answer: 0 },
    { q: 'Yer-yön zarfları ek alırsa ne olur?', options: ['İsimleşir', 'Sıfat olur', 'Zarf kalır', 'Fiil olur'], answer: 0 },
    { q: '"Nasıl" sorusu hangi zarfı buldurur?', options: ['Durum', 'Zaman', 'Miktar', 'Yer'], answer: 0 },
    { q: '"Ne zaman" sorusu hangi zarfı buldurur?', options: ['Zaman', 'Durum', 'Miktar', 'Yer'], answer: 0 },
    { q: '"Güzel konuştu" cümlesinde "güzel" kelimesinin görevi?', options: ['Zarf', 'Sıfat', 'İsim', 'Zamir'], answer: 0 },
    { q: '"En güzel o konuştu" cümlesinde miktar zarfı hangisidir?', options: ['En', 'Güzel', 'O', 'Konuştu'], answer: 0 }
];

const trEkFiilQuestions: Question[] = [
    { q: 'Ek fiilin görevi nedir?', options: ['İsimleri yüklem yapmak', 'Fiilleri nitelemek', 'Özne olmak', 'Nesne olmak'], answer: 0 },
    { q: '"Hava güzeldi" cümlesinde ek fiil hangisidir?', options: ['-di', 'Hava', 'Güzel', 'Yok'], answer: 0 },
    { q: '"O bir doktormuş" cümlesinde ek fiil hangi zamandadır?', options: ['Duyulan Geçmiş', 'Görülen Geçmiş', 'Şimdiki', 'Geniş'], answer: 0 },
    { q: 'Basit zamanlı fiili birleşik zamanlı yapan nedir?', options: ['Ek Fiil', 'Yapım Eki', 'Çekim Eki', 'İyelik Eki'], answer: 0 },
    { q: '"Geliyordum" fiilinin açılımı nedir?', options: ['Şimdiki zamanın hikayesi', 'Geniş zamanın rivayeti', 'Gelecek zaman', 'Geçmiş zaman'], answer: 0 },
    { q: 'Ek fiilin geniş zaman eki hangisidir?', options: ['-dir', '-di', '-miş', '-se'], answer: 0 },
    { q: '"Çalışkansa" kelimesindeki ek fiil kipi?', options: ['Şart', 'Hikaye', 'Rivayet', 'Geniş'], answer: 0 },
    { q: 'Hangisinde ek fiil vardır?', options: ['Hastaydı', 'Gitti', 'Baktı', 'Geldi'], answer: 0 },
    { q: 'Hangisi ek fiil değildir?', options: ['-im', '-idi', '-imiş', '-ise'], answer: 0 },
    { q: '"İnsandır" kelimesindeki ek fiil?', options: ['Geniş zaman', 'Geçmiş zaman', 'Şart', 'İstek'], answer: 0 }
];

const trMeaningQuestions: Question[] = [
    { q: '"Geri iade etti" cümlesindeki anlatım bozukluğu nedeni?', options: ['Gereksiz sözcük kullanımı', 'Özne eksikliği', 'Yüklem eksikliği', 'Mantık hatası'], answer: 0 },
    { q: '"Yüksek sesle bağırma" cümlesindeki bozukluk?', options: ['Gereksiz sözcük (Bağırmak zaten yüksek sesledir)', 'Anlam belirsizliği', 'Çelişki', 'Sıralama hatası'], answer: 0 },
    { q: '"Kesinlikle gelebilir" cümlesindeki bozukluk?', options: ['Anlamca çelişen sözcükler', 'Gereksiz sözcük', 'Deyim hatası', 'Özne hatası'], answer: 0 },
    { q: '"Eminim bunu yapmış olmalı" cümlesindeki bozukluk?', options: ['Çelişki', 'Gereksiz sözcük', 'Yanlış anlam', 'Mantık'], answer: 0 },
    { q: '"Fidanlar ekti" yerine ne denmeli?', options: ['Dikti', 'Koydu', 'Attı', 'Serpti'], answer: 0 },
    { q: '"Resim çekilmek" doğru mu?', options: ['Hayır, fotoğraf çektirmek', 'Evet', 'Hayır, resim yapmak', 'Farketmez'], answer: 0 },
    { q: '"Beyin zarı iltihabı sonucu öldü" cümlesinde yanlışlık?', options: ['Öldü denmez, vefat etti denir', 'Yanlış sözcük (Sonucunda değil, nedeniyle)', 'Gereksiz sözcük', 'Çelişki'], answer: 1 },
    { q: '"Yaklaşık tam üç saat bekledim" bozukluk nedeni?', options: ['Çelişen sözcükler', 'Gereksiz sözcük', 'Mantık hatası', 'Özne'], answer: 0 },
    { q: '"Yaya yürümek" ifadesindeki bozukluk?', options: ['Gereksiz sözcük', 'Yanlış anlam', 'Çelişki', 'Mantık'], answer: 0 },
    { q: '"Kardeşim ve ben gittim" doğru mu?', options: ['Hayır, gittik olmalı', 'Evet', 'Hayır, gitti olmalı', 'Bilinmez'], answer: 0 }
];

const trTextTypeQuestions: Question[] = [
    { q: 'Yazarın kendi hayatını anlattığı türe ne denir?', options: ['Otobiyografi', 'Biyografi', 'Anı', 'Günlük'], answer: 0 },
    { q: 'Başkasıyla konuşuyormuş gibi yazılan fikir yazısı?', options: ['Söyleşi (Sohbet)', 'Deneme', 'Makale', 'Fıkra'], answer: 0 },
    { q: 'Günü gününe yazılan yazı türü?', options: ['Günlük', 'Anı', 'Gezi Yazısı', 'Mektup'], answer: 0 },
    { q: 'Yaşanmış olayların üzerinden zaman geçtikten sonra yazılması?', options: ['Anı', 'Günlük', 'Roman', 'Hikaye'], answer: 0 },
    { q: 'Tanınmış birinin hayatının başkası tarafından anlatılması?', options: ['Biyografi', 'Otobiyografi', 'Portre', 'Mülakat'], answer: 0 },
    { q: 'Düşüncelerin kanıtlama amacı güdülmeden yazıldığı tür?', options: ['Deneme', 'Makale', 'Haber', 'Rapor'], answer: 0 },
    { q: 'Gezilip görülen yerlerin anlatıldığı tür?', options: ['Gezi Yazısı', 'Anı', 'Günlük', 'Hikaye'], answer: 0 },
    { q: 'Olağanüstü olayların anlatıldığı hayali tür?', options: ['Masal', 'Hikaye', 'Roman', 'Anı'], answer: 0 },
    { q: 'Hangisi bilgilendirici metindir?', options: ['Makale', 'Masal', 'Şiir', 'Hikaye'], answer: 0 },
    { q: 'Dörtlüklerden oluşan edebi tür?', options: ['Şiir', 'Roman', 'Tiyatro', 'Deneme'], answer: 0 }
];

// --- DİN KÜLTÜRÜ (5 ÜNİTE) ---
const dinUnit1: Question[] = [
    { q: 'Gözle görülmeyen nurani varlıklara ne denir?', options: ['Melek', 'Cin', 'İnsan', 'Hayvan'], answer: 0 },
    { q: 'Vahiy getiren melek hangisidir?', options: ['Cebrail', 'Mikail', 'İsrafil', 'Azrail'], answer: 0 },
    { q: 'Kıyameti haber veren sura üfleyecek melek?', options: ['İsrafil', 'Cebrail', 'Mikail', 'Azrail'], answer: 0 },
    { q: 'Kıyametten sonraki sonsuz hayata ne denir?', options: ['Ahiret', 'Dünya', 'Berzah', 'Mahşer'], answer: 0 },
    { q: 'İnsanların hesap için toplanacağı yer?', options: ['Mahşer', 'Mizan', 'Sırat', 'Kabir'], answer: 0 },
    { q: 'Amellerin tartılacağı adalet terazisi?', options: ['Mizan', 'Kantar', 'Terazi', 'Ölçek'], answer: 0 },
    { q: 'Koruyucu meleklere ne denir?', options: ['Hafaza', 'Kiramen Katibin', 'Münker Nekir', 'Rıdvan'], answer: 0 },
    { q: 'Şeytanın yaratıldığı madde?', options: ['Ateş', 'Nur', 'Toprak', 'Su'], answer: 0 },
    { q: 'Öldükten sonra dirilmeye ne denir?', options: ['Ba\'s', 'Haşr', 'Berzah', 'Kıyamet'], answer: 0 },
    { q: 'Hz. İsa\'ya verilen kutsal kitap?', options: ['İncil', 'Tevrat', 'Zebur', 'Kur\'an'], answer: 0 }
];

const dinUnit2: Question[] = [
    { q: 'Hac ibadeti nerede yapılır?', options: ['Mekke', 'Medine', 'Kudüs', 'Şam'], answer: 0 },
    { q: 'Haccın farzlarından biri hangisidir?', options: ['Arafat Vakfesi', 'Kurban kesmek', 'Şeytan taşlamak', 'Medine ziyareti'], answer: 0 },
    { q: 'Kabe\'nin etrafında 7 kez dönmeye ne denir?', options: ['Tavaf', 'Şavt', 'Sa\'y', 'Vakfe'], answer: 0 },
    { q: 'Hacda giyilen özel kıyafet?', options: ['İhram', 'Kefen', 'Cübbe', 'Sarık'], answer: 0 },
    { q: 'Safa ve Merve tepeleri arasında gidip gelmek?', options: ['Sa\'y', 'Tavaf', 'Vakfe', 'Ramy'], answer: 0 },
    { q: 'Hac kimlere farzdır?', options: ['Zengin ve sağlıklı Müslümanlara', 'Herkese', 'Yaşlılara', 'Gençlere'], answer: 0 },
    { q: 'Kurban ibadeti hangi peygamberle özdeşleşmiştir?', options: ['Hz. İbrahim ve Hz. İsmail', 'Hz. Musa', 'Hz. İsa', 'Hz. Nuh'], answer: 0 },
    { q: 'Hacıların Arafat\'ta beklemesine ne denir?', options: ['Vakfe', 'Tavaf', 'Sa\'y', 'İhram'], answer: 0 },
    { q: 'Yılın herhangi bir zamanı yapılan Kabe ziyaretine ne denir?', options: ['Umre', 'Hac', 'Ziyaret', 'Gezi'], answer: 0 },
    { q: 'Kurban kesmenin hükmü nedir?', options: ['Vacip', 'Farz', 'Sünnet', 'Müstehap'], answer: 0 }
];

const dinUnit3: Question[] = [
    { q: 'Güzel ahlaklı olmak neyin gereğidir?', options: ['İmanın', 'Zenginliğin', 'Bilginin', 'Gücün'], answer: 0 },
    { q: 'Hangisi güzel ahlak örneğidir?', options: ['Dürüstlük', 'Yalan', 'Gıybet', 'İftira'], answer: 0 },
    { q: 'Adalet ne demektir?', options: ['Hak sahibine hakkını vermek', 'Herkese eşit davranmak', 'Zengine vermek', 'Güçlüye vermek'], answer: 0 },
    { q: 'Kişinin davranışlarını kontrol etmesine ne denir?', options: ['Öz denetim', 'Özgürlük', 'Baskı', 'Korku'], answer: 0 },
    { q: 'Hz. Salih hangi kavme gönderilmiştir?', options: ['Semud', 'Ad', 'Nuh', 'Lut'], answer: 0 },
    { q: 'Semud kavminin helak olma sebebi?', options: ['Ahlaksızlık ve kibir', 'Fakir olmaları', 'Çok çalışmaları', 'Bilgisizlik'], answer: 0 },
    { q: '"El-Emin" ne demektir?', options: ['Güvenilir', 'Zengin', 'Güçlü', 'Bilgili'], answer: 0 },
    { q: 'Vatanseverlik nasıl gösterilir?', options: ['Çalışarak ve ülkesini severek', 'Kaçarak', 'Şikayet ederek', 'Yatarak'], answer: 0 },
    { q: 'Yardımseverlik toplumda neyi artırır?', options: ['Dayanışmayı', 'Kavgayı', 'Kıskançlığı', 'Fakirliği'], answer: 0 },
    { q: 'Başkası hakkında kötü konuşmaya ne denir?', options: ['Gıybet', 'Sohbet', 'Muhabbet', 'Övgü'], answer: 0 }
];

const dinUnit4: Question[] = [
    { q: 'Hz. Muhammed\'in insani yönü nasıldı?', options: ['Bizim gibi yer, içer, uyurdu', 'Melek gibiydi', 'Yemez içmezdi', 'Hiç uyumazdı'], answer: 0 },
    { q: 'Hz. Muhammed\'i diğer insanlardan ayıran özellik?', options: ['Vahiy alması', 'Zengin olması', 'Güzel olması', 'Lider olması'], answer: 0 },
    { q: 'Peygamberimizin son peygamber olmasına ne denir?', options: ['Hatemül Enbiya', 'Resulullah', 'Habibullah', 'Halilullah'], answer: 0 },
    { q: 'Kafirun suresinin ana mesajı nedir?', options: ['İnanç özgürlüğü ve Tevhid', 'Namaz', 'Oruç', 'Zekat'], answer: 0 },
    { q: 'Hz. Muhammed insanlara nasıl davranırdı?', options: ['Merhametli ve nazik', 'Kaba', 'Kırıcı', 'Umursamaz'], answer: 0 },
    { q: 'Peygamberimiz insanları neye çağırırdı?', options: ['Tevhide (Tek Allah inancı)', 'Zenginliğe', 'Savaşa', 'Krallığa'], answer: 0 },
    { q: '"Üsve-i Hasene" ne demektir?', options: ['En güzel örnek', 'Güzel insan', 'İyi arkadaş', 'Güçlü lider'], answer: 0 },
    { q: 'Peygamberimiz sorunları nasıl çözerdi?', options: ['Adaletle', 'Zorla', 'Parayla', 'Kavga ile'], answer: 0 },
    { q: 'Hz. Muhammed\'e inen ilk vahiy?', options: ['Oku', 'Yaz', 'Kalk', 'Git'], answer: 0 },
    { q: 'Peygamberimiz çocuklara nasıl davranırdı?', options: ['Şefkatle', 'Kızarak', 'Görmezden gelerek', 'Uzak durarak'], answer: 0 }
];

const dinUnit5: Question[] = [
    { q: 'Din anlayışındaki farklılıklara ne denir?', options: ['Yorum (Mezhep)', 'Din', 'Vahiy', 'Ayet'], answer: 0 },
    { q: 'Dinin değişmeyen özü nedir?', options: ['Tevhid ve İnanç esasları', 'Kıyafetler', 'Yemekler', 'Evler'], answer: 0 },
    { q: 'Hangisi itikadi (inançla ilgili) bir yorumdur?', options: ['Maturidilik', 'Hanefilik', 'Mevlevilik', 'Nakşibendilik'], answer: 0 },
    { q: 'Hangisi fıkhi (ibadetle ilgili) bir yorumdur?', options: ['Hanefilik', 'Eşarilik', 'Maturidilik', 'Alevilik'], answer: 0 },
    { q: 'İmam-ı Azam Ebu Hanife\'nin kurduğu mezhep?', options: ['Hanefilik', 'Şafiilik', 'Malikilik', 'Hanbelilik'], answer: 0 },
    { q: 'Mevlevilik kime dayanır?', options: ['Mevlana Celaleddin Rumi', 'Hacı Bektaş Veli', 'Ahmet Yesevi', 'Yunus Emre'], answer: 0 },
    { q: 'Alevilik-Bektaşilikte "Cem" ne demektir?', options: ['Toplanma ve ibadet', 'Yemek', 'Cenaze', 'Düğün'], answer: 0 },
    { q: 'Dini yorumların temel sebebi nedir?', options: ['İnsani ve toplumsal farklılıklar', 'Dinin eksikliği', 'Allah\'ın emri', 'Peygamberin isteği'], answer: 0 },
    { q: 'Ahmet Yesevi\'nin eseri hangisidir?', options: ['Divan-ı Hikmet', 'Mesnevi', 'Makalat', 'Risale'], answer: 0 },
    { q: 'Mezhepler dinin kendisi midir?', options: ['Hayır, dinin yorumudur', 'Evet', 'Dinden üstündür', 'Dinin zıddıdır'], answer: 0 }
];

// --- ARAPÇA (5 ÜNİTE - YENİ EKLENDİ) ---
const arpUnit1: Question[] = [
    { q: '"Muallim" kelimesinin anlamı nedir?', options: ['Öğretmen', 'Doktor', 'Polis', 'Çiftçi'], answer: 0 },
    { q: '"Ben doktorum" cümlesinin Arapçası?', options: ['Ene tabib', 'Ene muallim', 'Ene fellah', 'Ene mühendis'], answer: 0 },
    { q: 'Marangoz ne demektir?', options: ['Naccar', 'Hayyat', 'Tabib', 'Fellah'], answer: 0 },
    { q: '"Mühendis" kelimesinin anlamı?', options: ['Mühendis', 'Mimar', 'Doktor', 'Avukat'], answer: 0 },
    { q: 'Polis Arapça ne demektir?', options: ['Şurtî', 'Fellah', 'Naccar', 'Hayyat'], answer: 0 },
    { q: '"O nedir?" sorusu?', options: ['Ma hazâ?', 'Men hazâ?', 'Keyfe haluk?', 'Mesmuke?'], answer: 0 },
    { q: 'Terzi ne demektir?', options: ['Hayyat', 'Naccar', 'Tabib', 'Muallim'], answer: 0 },
    { q: '"Ene fellah" ne demektir?', options: ['Ben çiftçiyim', 'Ben doktorum', 'Ben polisim', 'Ben öğrenciyim'], answer: 0 },
    { q: 'Öğrenci (Erkek) ne demektir?', options: ['Talib', 'Muallim', 'Müdir', 'Fellah'], answer: 0 },
    { q: 'Hangisi bir meslektir?', options: ['Tabib', 'Beyt', 'Medrese', 'Kitab'], answer: 0 }
];

const arpUnit2: Question[] = [
    { q: '"Fakihe" kelimesinin anlamı?', options: ['Meyve', 'Sebze', 'Et', 'Ekmek'], answer: 0 },
    { q: 'Elma Arapça ne demektir?', options: ['Tuffah', 'Mevz', 'Burtukal', 'Ineb'], answer: 0 },
    { q: '"Hudar" kelimesinin anlamı?', options: ['Sebze', 'Meyve', 'Yemek', 'İçecek'], answer: 0 },
    { q: 'Muz ne demektir?', options: ['Mevz', 'Tuffah', 'Kiraz', 'Ceviz'], answer: 0 },
    { q: 'Ekmek ne demektir?', options: ['Hubz', 'Lahm', 'Ma', 'Halib'], answer: 0 },
    { q: 'Çarşı/Pazar ne demektir?', options: ['Suuk', 'Beyt', 'Medrese', 'Mescid'], answer: 0 },
    { q: 'Portakal ne demektir?', options: ['Burtukal', 'Limon', 'Mandalina', 'Ayva'], answer: 0 },
    { q: '"Kem lira?" ne demektir?', options: ['Kaç lira?', 'Ne kadar?', 'Nerede?', 'Neden?'], answer: 0 },
    { q: 'Domates Arapça ne demektir?', options: ['Tamatim', 'Patates', 'Hiyar', 'Fülfül'], answer: 0 },
    { q: 'Bakkal neresidir?', options: ['Bakkal', 'Manav', 'Kasap', 'Fırın'], answer: 0 }
];

const arpUnit3: Question[] = [
    { q: '"Müsteşfa" kelimesinin anlamı?', options: ['Hastane', 'Eczane', 'Okul', 'Ev'], answer: 0 },
    { q: 'Doktor ne demektir?', options: ['Tabib', 'Muallim', 'Mühendis', 'Fellah'], answer: 0 },
    { q: '"Meriz" ne demektir?', options: ['Hasta', 'Sağlıklı', 'Doktor', 'Hemşire'], answer: 0 },
    { q: 'İlaç ne demektir?', options: ['Deva', 'Su', 'Yemek', 'Şifa'], answer: 0 },
    { q: '"Re\'s" vücudun neresidir?', options: ['Baş', 'Karın', 'El', 'Ayak'], answer: 0 },
    { q: 'Karın ne demektir?', options: ['Batn', 'Re\'s', 'Yed', 'Ricl'], answer: 0 },
    { q: '"Elem" ne demektir?', options: ['Ağrı', 'Mutluluk', 'Hastalık', 'İlaç'], answer: 0 },
    { q: '"Geçmiş olsun" kalıbı?', options: ['Selametek', 'Ehlen', 'Merhaban', 'Şükran'], answer: 0 },
    { q: 'Eczane ne demektir?', options: ['Saydaliye', 'Müsteşfa', 'Suuk', 'Medrese'], answer: 0 },
    { q: 'Hemşire ne demektir?', options: ['Mümarrida', 'Tabibe', 'Muallime', 'Talibe'], answer: 0 }
];

const arpUnit4: Question[] = [
    { q: '"Riyada" ne demektir?', options: ['Spor', 'Yemek', 'Okul', 'Ev'], answer: 0 },
    { q: 'Futbol ne demektir?', options: ['Kuratü\'l-Kadem', 'Kuratü\'s-Selle', 'Kuratü\'t-Taire', 'Sibaha'], answer: 0 },
    { q: 'Basketbol ne demektir?', options: ['Kuratü\'s-Selle', 'Kuratü\'l-Kadem', 'Tinnis', 'Cudo'], answer: 0 },
    { q: 'Yüzme ne demektir?', options: ['Sibaha', 'Rakd', 'Meşy', 'Kafz'], answer: 0 },
    { q: 'Top ne demektir?', options: ['Kura', 'Mel\'ab', 'Feric', 'Hedef'], answer: 0 },
    { q: 'Takım ne demektir?', options: ['Feric', 'Mel\'ab', 'Müderrib', 'Laib'], answer: 0 },
    { q: 'Saha/Stadyum ne demektir?', options: ['Mel\'ab', 'Beyt', 'Saff', 'Mekteb'], answer: 0 },
    { q: '"Ben oynuyorum" ne demektir?', options: ['El\'abü', 'Te\'kulu', 'Teşrabü', 'Tektübü'], answer: 0 },
    { q: 'Voleybol ne demektir?', options: ['Kuratü\'t-Taire', 'Kuratü\'l-Kadem', 'Kuratü\'s-Selle', 'GOLF'], answer: 0 },
    { q: 'Oyuncu ne demektir?', options: ['Laib', 'Hakem', 'Müderrib', 'Müşahid'], answer: 0 }
];

const arpUnit5: Question[] = [
    { q: '"Beyt" kelimesinin anlamı?', options: ['Ev', 'Okul', 'Bahçe', 'Oda'], answer: 0 },
    { q: 'Anne ne demektir?', options: ['Ümm', 'Eb', 'Cedd', 'Eh'], answer: 0 },
    { q: 'Baba ne demektir?', options: ['Eb', 'Ümm', 'Uht', 'Amme'], answer: 0 },
    { q: 'Kardeş (Erkek) ne demektir?', options: ['Eh', 'Uht', 'Cedd', 'Hale'], answer: 0 },
    { q: 'Dede ne demektir?', options: ['Cedd', 'Eb', 'Am', 'Hal'], answer: 0 },
    { q: 'Oda ne demektir?', options: ['Gurfe', 'Matbah', 'Hammam', 'Salon'], answer: 0 },
    { q: 'Mutfak ne demektir?', options: ['Matbah', 'Gurfe', 'Balkon', 'Hammam'], answer: 0 },
    { q: '"Ailem" ne demektir?', options: ['Usretî', 'Beytî', 'Medresetî', 'Saffî'], answer: 0 },
    { q: 'Kız kardeş ne demektir?', options: ['Uht', 'Eh', 'Ümm', 'Eb'], answer: 0 },
    { q: 'Banyo ne demektir?', options: ['Hammam', 'Matbah', 'Gurfe', 'Salon'], answer: 0 }
];


const generateTestsFromPool = (pool: Question[], baseId: string, baseTitle: string): TestPaper[] => {
    // Helper to rotate questions to create 5 distinct tests of 10 questions
    const tests: TestPaper[] = [];
    for (let i = 0; i < 5; i++) {
        const qs: Question[] = [];
        for (let j = 0; j < 10; j++) {
            qs.push(pool[(i * 3 + j) % pool.length]); // Cycle through pool
        }
        
        tests.push({
            id: `${baseId}-${i+1}`,
            title: `${baseTitle} ${i+1}`,
            difficulty: i === 0 ? 'Kolay' : i < 3 ? 'Orta' : 'Zor',
            questions: qs
        });
    }
    return tests;
};

// --- TEST TUBE MAIN DATABASE MAP ---
const TEST_DATABASE: Record<string, SubjectTests> = {
  'science': {
    title: 'Fen Bilimleri',
    topics: [
      { id: 'sci-1', title: '1. Ünite: Güneş Sistemi ve Ötesi', tests: generateTestsFromPool(solarSystemQuestions, 'sci-sol', 'Güneş Sistemi Test') },
      { id: 'sci-2', title: '2. Ünite: Hücre ve Bölünmeler', tests: generateTestsFromPool(cellQuestions, 'sci-cell', 'Hücre ve Bölünmeler Test') },
      { id: 'sci-3', title: '3. Ünite: Kuvvet ve Enerji', tests: generateTestsFromPool(forceQuestions, 'sci-force', 'Kuvvet ve Enerji Test') },
      { id: 'sci-4', title: '4. Ünite: Saf Madde ve Karışımlar', tests: generateTestsFromPool(matterQuestions, 'sci-matter', 'Saf Madde Test') },
      { id: 'sci-5', title: '5. Ünite: Işığın Madde ile Etkileşimi', tests: generateTestsFromPool(lightQuestions, 'sci-light', 'Işık ve Madde Test') },
      { id: 'sci-6', title: '6. Ünite: Canlılarda Üreme', tests: generateTestsFromPool(reproductionQuestions, 'sci-repro', 'Üreme ve Gelişme Test') },
      { id: 'sci-7', title: '7. Ünite: Elektrik Devreleri', tests: generateTestsFromPool(electricQuestions, 'sci-elec', 'Elektrik Devreleri Test') },
    ]
  },
  'math': {
    title: 'Matematik',
    topics: [
      { id: 'math-1', title: '1. Ünite: Tam Sayılarla İşlemler', tests: generateTestsFromPool(mathIntQuestions, 'math-int', 'Tam Sayılar Test') },
      { id: 'math-2', title: '2. Ünite: Rasyonel Sayılar', tests: generateTestsFromPool(mathRatQuestions, 'math-rat', 'Rasyonel Sayılar Test') },
      { id: 'math-3', title: '3. Ünite: Cebirsel İfadeler', tests: generateTestsFromPool(mathAlgQuestions, 'math-alg', 'Cebir Test') },
      { id: 'math-4', title: '4. Ünite: Oran ve Orantı', tests: generateTestsFromPool(mathRatioQuestions, 'math-ratio', 'Oran Orantı Test') },
      { id: 'math-5', title: '5. Ünite: Doğrular ve Açılar', tests: generateTestsFromPool(mathGeoQuestions, 'math-geo', 'Geometri Test') },
      { id: 'math-6', title: '6. Ünite: Çember ve Veri Analizi', tests: generateTestsFromPool(mathCircleQuestions, 'math-circ', 'Çember ve Veri Test') },
    ]
  },
  'social': {
    title: 'Sosyal Bilgiler',
    topics: [
       { id: 'soc-1', title: '1. Ünite: İletişim ve İnsan', tests: generateTestsFromPool(socialCommQuestions, 'soc-comm', 'İletişim Test') },
       { id: 'soc-2', title: '2. Ünite: Türk Tarihinde Yolculuk', tests: generateTestsFromPool(socialHistoryQuestions, 'soc-hist', 'Tarih Test') },
       { id: 'soc-3', title: '3. Ünite: Ülkemizde Nüfus', tests: generateTestsFromPool(socialGeoQuestions, 'soc-pop', 'Nüfus Test') },
       { id: 'soc-4', title: '4. Ünite: Zaman İçinde Bilim', tests: generateTestsFromPool(socialScienceQuestions, 'soc-sci', 'Bilim Tarihi Test') },
       { id: 'soc-5', title: '5. Ünite: Ekonomi ve Sosyal Hayat', tests: generateTestsFromPool(socialEcoQuestions, 'soc-eco', 'Ekonomi Test') },
       { id: 'soc-6', title: '6. Ünite: Yaşayan Demokrasi', tests: generateTestsFromPool(socialDemoQuestions, 'soc-demo', 'Demokrasi Test') },
       { id: 'soc-7', title: '7. Ünite: Ülkeler Arası Köprüler', tests: generateTestsFromPool(socialIntQuestions, 'soc-int', 'Küresel Bağlantılar Test') },
    ]
  },
  'turkish': {
    title: 'Türkçe',
    topics: [
       { id: 'tr-1', title: 'Dil Bilgisi: Fiiller', tests: generateTestsFromPool(trVerbQuestions, 'tr-verb', 'Fiiller Test') },
       { id: 'tr-2', title: 'Dil Bilgisi: Fiillerde Yapı', tests: generateTestsFromPool(trStructQuestions, 'tr-struct', 'Fiil Yapısı Test') },
       { id: 'tr-3', title: 'Dil Bilgisi: Zarflar', tests: generateTestsFromPool(trAdvQuestions, 'tr-adv', 'Zarflar Test') },
       { id: 'tr-4', title: 'Dil Bilgisi: Ek Fiil', tests: generateTestsFromPool(trEkFiilQuestions, 'tr-ek', 'Ek Fiil Test') },
       { id: 'tr-5', title: 'Anlatım Bozuklukları', tests: generateTestsFromPool(trMeaningQuestions, 'tr-mean', 'Anlatım Bozukluğu Test') },
       { id: 'tr-6', title: 'Metin Türleri', tests: generateTestsFromPool(trTextTypeQuestions, 'tr-text', 'Metin Türleri Test') },
    ]
  },
  'english': {
    title: 'İngilizce',
    topics: [
       { id: 'eng-1', title: 'Unit 1: Appearance and Personality', tests: generateTestsFromPool(engUnit1, 'eng-u1', 'Unit 1 Test') },
       { id: 'eng-2', title: 'Unit 2: Sports', tests: generateTestsFromPool(engUnit2, 'eng-u2', 'Unit 2 Test') },
       { id: 'eng-3', title: 'Unit 3: Biographies', tests: generateTestsFromPool(engUnit3, 'eng-u3', 'Unit 3 Test') },
       { id: 'eng-4', title: 'Unit 4: Wild Animals', tests: generateTestsFromPool(engUnit4, 'eng-u4', 'Unit 4 Test') },
       { id: 'eng-5', title: 'Unit 5: Television', tests: generateTestsFromPool(engUnit5, 'eng-u5', 'Unit 5 Test') },
    ]
  },
  'din': {
    title: 'Din Kültürü',
    topics: [
       { id: 'din-1', title: '1. Ünite: Melek ve Ahiret', tests: generateTestsFromPool(dinUnit1, 'din-u1', 'Melek ve Ahiret Test') },
       { id: 'din-2', title: '2. Ünite: Hac ve Kurban', tests: generateTestsFromPool(dinUnit2, 'din-u2', 'Hac Test') },
       { id: 'din-3', title: '3. Ünite: Ahlaki Davranışlar', tests: generateTestsFromPool(dinUnit3, 'din-u3', 'Ahlak Test') },
       { id: 'din-4', title: '4. Ünite: Hz. Muhammed', tests: generateTestsFromPool(dinUnit4, 'din-u4', 'Hz. Muhammed Test') },
       { id: 'din-5', title: '5. Ünite: Yorumlar', tests: generateTestsFromPool(dinUnit5, 'din-u5', 'Mezhepler Test') },
    ]
  },
  'arabic': {
    title: 'Arapça',
    topics: [
       { id: 'arp-1', title: '1. Ünite: Meslekler (El-Mihen)', tests: generateTestsFromPool(arpUnit1, 'arp-u1', 'Meslekler Test') },
       { id: 'arp-2', title: '2. Ünite: Çarşıda Pazarda', tests: generateTestsFromPool(arpUnit2, 'arp-u2', 'Alışveriş Test') },
       { id: 'arp-3', title: '3. Ünite: Sağlık (Es-Sıhha)', tests: generateTestsFromPool(arpUnit3, 'arp-u3', 'Sağlık Test') },
       { id: 'arp-4', title: '4. Ünite: Spor ve Oyunlar', tests: generateTestsFromPool(arpUnit4, 'arp-u4', 'Spor Test') },
       { id: 'arp-5', title: '5. Ünite: Evim ve Ailem', tests: generateTestsFromPool(arpUnit5, 'arp-u5', 'Aile Test') },
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
  const [viewStep, setViewStep] = useState<'SUBJECT' | 'TOPIC' | 'TEST_SELECT' | 'PLAYING' | 'RESULT'>('SUBJECT');
  
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicTests | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestPaper | null>(null);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); 

  const resetAll = () => {
      setViewStep('SUBJECT');
      setSelectedSubjectKey(null);
      setSelectedTopic(null);
      setSelectedTest(null);
      setUserAnswers({});
      setCurrentQuestionIdx(0);
  };

  const handleSubjectSelect = (key: string) => {
      setSelectedSubjectKey(key);
      setViewStep('TOPIC');
  };

  const handleTopicSelect = (topic: TopicTests) => {
      setSelectedTopic(topic);
      setViewStep('TEST_SELECT');
  };

  const handleTestSelect = (test: TestPaper) => {
      setSelectedTest(test);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setViewStep('PLAYING');
  };

  const handleAnswer = (optIdx: number) => {
      if (userAnswers[currentQuestionIdx] !== undefined) return;
      setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  const finishTest = () => {
      setViewStep('RESULT');
  };

  // --- RENDERERS ---

  // 1. SUBJECT SELECTION
  if (viewStep === 'SUBJECT') {
      return (
        <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-red-600 font-handwritten mb-4 tracking-wide">
                    TestTube Merkezi
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Sınavlara hazırlık için en kapsamlı test arşivi. Başlamak için ders seç.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(TEST_DATABASE).map(([key, data]) => {
                    const subjectInfo = SUBJECTS.find(s => s.id === key);
                    return (
                        <button
                            key={key}
                            onClick={() => handleSubjectSelect(key)}
                            className={`p-6 rounded-2xl border-b-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-4 bg-white hover:bg-gray-50 border-gray-200`}
                        >
                            <span className="text-4xl">{subjectInfo?.icon || '📚'}</span>
                            <div className="text-left">
                                <h3 className="font-bold text-xl text-gray-800">{data.title}</h3>
                                <p className="text-sm text-gray-500">{data.topics.length} Konu Mevcut</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
      );
  }

  // 2. TOPIC SELECTION
  if (viewStep === 'TOPIC' && selectedSubjectKey) {
      const subjectData = TEST_DATABASE[selectedSubjectKey];
      const subjectInfo = SUBJECTS.find(s => s.id === selectedSubjectKey);
      
      return (
          <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
              <button onClick={() => setViewStep('SUBJECT')} className="mb-6 flex items-center text-gray-500 hover:text-red-600 font-bold">&larr; Derslere Dön</button>
              
              <div className={`p-8 rounded-3xl text-white mb-8 ${subjectInfo?.headerColor || 'bg-gray-700'}`}>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                      <span className="text-4xl">{subjectInfo?.icon}</span>
                      {subjectData.title} Konuları
                  </h2>
                  <p className="opacity-80 mt-2">Çözmek istediğin üniteyi seç.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectData.topics.map(topic => (
                      <button
                          key={topic.id}
                          onClick={() => handleTopicSelect(topic)}
                          className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-red-400 transition-all text-left group"
                      >
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-600">{topic.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{topic.tests.length} Farklı Test Mevcut</p>
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // 3. TEST SELECTION
  if (viewStep === 'TEST_SELECT' && selectedTopic) {
      const subjectInfo = SUBJECTS.find(s => s.id === selectedSubjectKey);
      return (
          <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
              <button onClick={() => setViewStep('TOPIC')} className="mb-6 flex items-center text-gray-500 hover:text-red-600 font-bold">&larr; Konulara Dön</button>
              
              <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedTopic.title}</h2>
                  <p className="text-gray-500">Aşağıdaki testlerden birini seç ve çözmeye başla.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                  {selectedTopic.tests.map((test, idx) => (
                      <button
                          key={test.id}
                          onClick={() => handleTestSelect(test)}
                          className="flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all group"
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${subjectInfo?.headerColor || 'bg-gray-600'}`}>
                                  {idx + 1}
                              </div>
                              <div className="text-left">
                                  <h3 className="font-bold text-lg text-gray-800">{test.title}</h3>
                                  <div className="flex items-center gap-2 text-xs font-bold uppercase mt-1">
                                      <span className={`px-2 py-0.5 rounded ${
                                          test.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' :
                                          test.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-red-100 text-red-700'
                                      }`}>{test.difficulty}</span>
                                      <span className="text-gray-400">•</span>
                                      <span className="text-gray-500">{test.questions.length} Soru</span>
                                  </div>
                              </div>
                          </div>
                          <span className="text-gray-300 group-hover:text-red-500 text-2xl font-bold">&rarr;</span>
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // 4. PLAYING QUIZ
  if (viewStep === 'PLAYING' && selectedTest) {
      const questions = selectedTest.questions;
      const currentQ = questions[currentQuestionIdx];
      const isAnswered = userAnswers[currentQuestionIdx] !== undefined;
      
      return (
          <div className="max-w-4xl mx-auto py-8 px-4">
              <button onClick={() => setViewStep('TEST_SELECT')} className="mb-4 text-gray-500 hover:text-red-600 font-bold">&larr; Testten Çık</button>
              
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
                      <div>
                          <h2 className="text-lg font-bold text-gray-800">{selectedTest.title}</h2>
                          <p className="text-xs text-gray-500">{selectedTopic?.title}</p>
                      </div>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                          {currentQuestionIdx + 1} / {questions.length}
                      </span>
                  </div>

                  <div className="p-8 sm:p-12">
                      <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-10">
                          {formatText(currentQ.q)}
                      </p>

                      <div className="space-y-4">
                          {currentQ.options.map((opt, idx) => {
                              const isSelected = userAnswers[currentQuestionIdx] === idx;
                              const isCorrectOption = idx === currentQ.answer;
                              
                              let buttonStyle = "border-gray-200 hover:border-gray-400 hover:bg-gray-50";
                              let iconStyle = "bg-white border-gray-300 text-gray-500 group-hover:border-gray-400";
                              
                              if (isAnswered) {
                                  if (isCorrectOption) {
                                      // Correct answer always green
                                      buttonStyle = "border-green-500 bg-green-50 text-green-900 shadow-md";
                                      iconStyle = "bg-green-500 text-white border-green-500";
                                  } else if (isSelected) {
                                      // Selected wrong answer red
                                      buttonStyle = "border-red-500 bg-red-50 text-red-900 shadow-md";
                                      iconStyle = "bg-red-500 text-white border-red-500";
                                  } else {
                                      // Other unselected options fade out
                                      buttonStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                                      iconStyle = "border-gray-200 text-gray-300";
                                  }
                              }

                              return (
                                  <button
                                      key={idx}
                                      onClick={() => handleAnswer(idx)}
                                      disabled={isAnswered}
                                      className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center group ${buttonStyle} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                                  >
                                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 border transition-colors ${iconStyle}`}>
                                          {String.fromCharCode(65 + idx)}
                                      </span>
                                      <span className="text-lg font-medium">{formatText(opt)}</span>
                                      
                                      {isAnswered && isCorrectOption && (
                                          <span className="ml-auto text-green-600 text-xl">✓</span>
                                      )}
                                      {isAnswered && isSelected && !isCorrectOption && (
                                          <span className="ml-auto text-red-600 text-xl">✕</span>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  </div>

                  <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between">
                      <button
                          onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                          disabled={currentQuestionIdx === 0}
                          className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg disabled:opacity-30"
                      >
                          Önceki
                      </button>
                      
                      {currentQuestionIdx < questions.length - 1 ? (
                          <button
                              onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md"
                          >
                              Sonraki
                          </button>
                      ) : (
                          <button
                              onClick={finishTest}
                              className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md"
                          >
                              Testi Bitir
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // 5. RESULT SCREEN
  if (viewStep === 'RESULT' && selectedTest) {
      let correct = 0, wrong = 0, empty = 0;
      selectedTest.questions.forEach((q, idx) => {
          const ans = userAnswers[idx];
          if (ans === undefined) empty++;
          else if (ans === q.answer) correct++;
          else wrong++;
      });
      const score = correct * (100 / selectedTest.questions.length);

      return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
                <div className="bg-red-600 p-10 text-white">
                    <h2 className="text-3xl font-bold mb-2">Test Sonucu</h2>
                    <h3 className="text-xl opacity-90 mb-6">{selectedTest.title}</h3>
                    <div className="inline-block bg-white text-red-600 px-6 py-2 rounded-full font-black text-4xl shadow-lg">
                        {Math.round(score)} Puan
                    </div>
                </div>
                
                <div className="p-8 sm:p-12">
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="text-3xl font-bold text-green-600">{correct}</div>
                            <div className="text-sm text-green-800 font-bold uppercase">Doğru</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="text-3xl font-bold text-red-600">{wrong}</div>
                            <div className="text-sm text-red-800 font-bold uppercase">Yanlış</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-3xl font-bold text-gray-600">{empty}</div>
                            <div className="text-sm text-gray-800 font-bold uppercase">Boş</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => setViewStep('TEST_SELECT')} 
                            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
                        >
                            Test Listesine Dön
                        </button>
                        <button 
                            onClick={() => handleTestSelect(selectedTest)}
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg transition-colors"
                        >
                            Tekrar Çöz
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return <div>Yükleniyor...</div>;
};

export default TestView;
