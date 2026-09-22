import type { AssessmentLocaleContent } from "./types";

export const trAssessment: AssessmentLocaleContent = {
  "task-01-information-filtering": {
    eyebrow: "Bilgi filtreleme",
    title: "En önemli sinyalleri belirleyin.",
    context:
      "Bir abonelik yazılım şirketi çeyreklik değişimleri aşağıdaki şekilde raporluyor.",
    prompt:
      "Büyümenin sağlıklı olduğu sonucuna varmadan önce hangi İKİ metrik en kritik şekilde incelenmelidir?",
    metrics: {
      revenue: "Gelir",
      customers: "Müşteriler",
      "operating-margin": "Faaliyet kâr marjı",
      "marketing-expense": "Pazarlama gideri",
      churn: "Müşteri kaybı (churn)",
      headcount: "Çalışan sayısı",
    },
  },
  "task-02-reasoning": {
    eyebrow: "Akıl yürütme",
    title: "İfadeyi değil, sonucu değerlendirin.",
    analysis:
      "Satışlar %20 arttı ve maliyetler %10 arttı; dolayısıyla kârlılık mutlaka iyileşti.",
    prompt: "Bu sonuç nasıl değerlendirilmelidir?",
    options: {
      supported: "Destekleniyor",
      "probably-supported": "Muhtemelen destekleniyor",
      insufficient: "Yetersiz bilgi",
      "probably-unsupported": "Muhtemelen desteklenmiyor",
      unsupported: "Desteklenmiyor",
    },
  },
  "task-03-evidence-evaluation": {
    eyebrow: "Kanıt değerlendirme",
    title: "Kanıtları karar değerine göre tartın.",
    context: "Yeni bir takviye hafızayı %40 geliştiriyor.",
    prompt:
      "Kaynakları kararınız üzerinde en etkili olması gerekenden en aza doğru sıralayın.",
    items: {
      "viral-video": {
        label: "Viral video",
        detail: "2,1 milyon görüntülenme · yöntem bilgisi yok",
      },
      "manufacturer-study": {
        label: "Üretici tarafından finanse edilen çalışma",
        detail: "n=48 · olumlu sonuç",
      },
      "observational-study": {
        label: "Bağımsız gözlemsel çalışma",
        detail: "n=1.200 · küçük düzeyde ilişki",
      },
      rct: {
        label: "Bağımsız randomize kontrollü çalışma",
        detail: "n=8.400 · anlamlı etki yok",
      },
    },
  },
  "task-04-adaptive-rule": {
    eyebrow: "Uyarlanabilir öğrenme",
    title: "Dönüşüm kuralını çıkarın.",
    phaseA: { prompt: "RIN + 5 → ?" },
    phaseB: { prompt: "Güncellenmiş kurala göre, RIN + 6 → ?" },
  },
  "task-05-missing-information": {
    eyebrow: "Üstbilişsel değerlendirme",
    title: "Yalnızca verilen bilgilere dayanarak akıl yürütün.",
    context: [
      "Alex, Jordan'dan daha uzundur.",
      "Jordan, Sam'den daha uzundur.",
    ],
    prompt: "Kim daha uzun: Sam mi Taylor mı?",
    options: {
      sam: "Sam",
      taylor: "Taylor",
      same: "Boyları aynıdır",
      insufficient: "Yeterli bilgi yok",
    },
  },
  "task-06-knowledge-transfer": {
    eyebrow: "Bilgi transferi",
    title: "İlkeyi yeni bir sisteme uygulayın.",
    principle:
      "Kapasite sabit olduğunda, talebi yeniden dağıtmak bazen kapasite eklemekten daha etkili olabilir.",
    context: [
      "Dijital bir hizmet hafta içi her gün saat 20.00'de aşırı yükleniyor.",
      "Bu çeyrekte yeni sunucu satın alınamıyor.",
    ],
    prompt: "Yukarıdaki ilkeyi en iyi hangi yaklaşım uygular?",
    options: {
      visuals:
        "Yoğun saatlerde sitenin görsel karmaşıklığını artırmak",
      "shift-load":
        "Acil olmayan işleri, güncellemeleri ve planlanmış işlemleri yoğun saatlerin dışına taşımak",
      refresh:
        "Kullanıcılardan hizmet yanıt verene kadar sayfayı tekrar tekrar yenilemelerini istemek",
      "hide-metrics": "Yoğun saatlerde performans metriklerini gizlemek",
    },
  },
};
