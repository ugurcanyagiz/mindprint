import type { UiMessages } from "./types";

export const tr: UiMessages = {
  accessibility: {
    homeLabel: "MINDPRINT ana sayfa",
    languageLabel: "Dil",
  },
  dimensions: {
    reasoning: "Akıl Yürütme",
    adaptiveLearning: "Uyarlanabilir Öğrenme",
    evidenceEvaluation: "Kanıt Değerlendirme",
    informationFiltering: "Bilgi Filtreleme",
    metacognitiveCalibration: "Üstbilişsel Kalibrasyon",
    knowledgeTransfer: "Bilgi Transferi",
  },
  landing: {
    experimentalAssessment: "Deneysel değerlendirme",
    cognitiveAssessment: "Bilişsel değerlendirme",
    headline: "Cevap açık olmadığında nasıl düşünürsünüz?",
    support:
      "MINDPRINT; akıl yürütme, uyum sağlama, kanıt değerlendirme ve güven düzeyini kısa ve modern bir değerlendirme ile inceler.",
    beginAssessment: "Değerlendirmeyi başlat",
    scope: "Kapsam",
    whatItMeasures: "Neyi ölçer",
    approach: "Yaklaşım",
    method: "Yöntem",
    methodBody:
      "Kısa görevler; eksik bilgi, değişen kurallar, çelişkili kanıtlar ve güven değerlendirmeleri sunar. Performans yalnızca bu değerlendirme kapsamında özetlenir.",
    experimentalByDesign: "Tasarımı gereği deneysel.",
    disclaimer:
      "Bir IQ testi, klinik araç, tanı aracı veya nüfus yüzdelik değerlendirmesi değildir.",
    version: "V0.1",
  },
  assessment: {
    label: "Değerlendirme",
    introTitle: "Kısa bir karar görevleri dizisi.",
    introBody:
      "Doğal hızınızda ilerleyin. Bazı görevlerde cevabınıza ne kadar güvendiğiniz sorulur.",
    duration: "Süre",
    durationValue: "~10 dakika",
    tasks: "Görev",
    startAssessment: "Değerlendirmeyi başlat",
    exit: "Çık",
    continue: "Devam",
    confidence: "Güven düzeyi",
    low: "Düşük",
    high: "Yüksek",
    confidenceAriaValue: "Yüzde {value} güven",
    selectOneResponse: "Bir yanıt seçin",
    progressLabel: "Değerlendirme ilerlemesi",
    ruleUpdate: "Kural güncellemesi",
    principle: "İlke",
    automatedAnalysis: "Otomatik analiz",
    claim: "İddia",
    rankingInstructions:
      "1 = en etkili. Sıralamayı değiştirmek için Yukarı ve Aşağı'yı kullanın.",
    moveUp: "Yukarı",
    moveDown: "Aşağı",
    moveUpLabel: "{item} öğesini yukarı taşı",
    moveDownLabel: "{item} öğesini aşağı taşı",
  },
  results: {
    headerLabel: "Bilişsel profil",
    assessmentComplete: "Değerlendirme tamamlandı",
    title: "Bilişsel Profil",
    subtitle: "Bu değerlendirme oturumundaki performans özeti.",
    averageConfidence: "Ortalama güven",
    responseAccuracy: "Yanıt doğruluğu",
    calibrationGap: "Kalibrasyon farkı",
    points: "puan",
    observedStrengths: "Gözlenen güçlü alanlar",
    confidenceCalibration: "Güven kalibrasyonu",
    assessmentNote: "Değerlendirme notu",
    retakeAssessment: "Değerlendirmeyi yeniden yap",
    copySummary: "Özeti kopyala",
    copied: "Kopyalandı",
    preparing: "Bilişsel profiliniz hazırlanıyor",
    processingPerformance: "Görev performansı özetleniyor",
    processingCalibration: "Güven düzeyi ile gözlenen doğruluk karşılaştırılıyor",
    processingScores: "Boyut skorları hazırlanıyor",
    methodNote:
      "Yöntem notu: Bu skorlar, bu deneysel prototip içindeki performansı özetler. Standartlaştırılmış IQ skorları, klinik bulgular veya nüfus yüzdelikleri değildir. Dil sürümleri aynı görev amacını koruyacak şekilde uyarlanmıştır; ancak diller arası skor eşdeğerliği henüz doğrulanmamıştır.",
    strengthEven:
      "Bu değerlendirmede ölçülen boyutlardaki performansınız genel olarak dengeliydi.",
    strengthComparative:
      "Yanıtlarınız, bu değerlendirme içinde {dimensions} alanlarında görece güçlü performans gösterdi.",
    calibrationClose:
      "Belirttiğiniz güven düzeyi, genel olarak gözlenen görev performansınızla yakından örtüştü.",
    calibrationSomeDistance:
      "Belirttiğiniz güven düzeyi ile gözlenen görev performansınız arasında bir miktar fark vardı.",
    calibrationNoticeable:
      "Belirttiğiniz güven düzeyi, kalibrasyon ölçülen görevlerde gözlenen performansınızdan belirgin ölçüde ayrıştı.",
    assessmentNoteBody:
      "Skorlar bu altı görevli deneysel prototipteki performansı yansıtır; kalıcı özellikler yerine görev düzeyindeki sinyaller olarak değerlendirilmelidir.",
    summaryTitle: "MINDPRINT — Bilişsel Profil",
  },
};
