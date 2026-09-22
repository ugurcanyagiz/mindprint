import type { AssessmentLocaleContent } from "./types";

export const koAssessment: AssessmentLocaleContent = {
  "task-01-information-filtering": {
    eyebrow: "정보 필터링",
    title: "가장 중요한 신호를 식별하세요.",
    context:
      "구독형 소프트웨어 기업이 다음과 같은 분기별 변화를 보고했습니다.",
    prompt:
      "성장이 건전하다고 결론 내리기 전에 가장 중요하게 확인해야 할 지표 두 가지를 선택하세요.",
    metrics: {
      revenue: "매출",
      customers: "고객 수",
      "operating-margin": "영업이익률",
      "marketing-expense": "마케팅 비용",
      churn: "이탈률",
      headcount: "직원 수",
    },
  },
  "task-02-reasoning": {
    eyebrow: "추론",
    title: "표현이 아니라 결론을 평가하세요.",
    analysis:
      "매출은 20% 증가했고 비용은 10% 증가했으므로 수익성은 반드시 개선되었다.",
    prompt: "이 결론을 어떻게 평가해야 합니까?",
    options: {
      supported: "뒷받침됨",
      "probably-supported": "대체로 뒷받침됨",
      insufficient: "정보 부족",
      "probably-unsupported": "대체로 뒷받침되지 않음",
      unsupported: "뒷받침되지 않음",
    },
  },
  "task-03-evidence-evaluation": {
    eyebrow: "근거 평가",
    title: "의사결정 가치에 따라 근거의 비중을 판단하세요.",
    context: "새로운 보충제가 기억력을 40% 향상시킨다.",
    prompt:
      "의사결정에 가장 큰 영향을 주어야 하는 자료부터 가장 작은 자료까지 순위를 정하세요.",
    items: {
      "viral-video": {
        label: "바이럴 영상",
        detail: "조회수 210만 · 방법 공개 없음",
      },
      "manufacturer-study": {
        label: "제조사 지원 연구",
        detail: "n=48 · 긍정적 결과",
      },
      "observational-study": {
        label: "독립 관찰 연구",
        detail: "n=1,200 · 작은 연관성",
      },
      rct: {
        label: "독립 무작위 대조시험",
        detail: "n=8,400 · 의미 있는 효과 없음",
      },
    },
  },
  "task-04-adaptive-rule": {
    eyebrow: "적응 학습",
    title: "변환 규칙을 추론하세요.",
    phaseA: { prompt: "RIN + 5 → ?" },
    phaseB: { prompt: "변경된 규칙에 따르면, RIN + 6 → ?" },
  },
  "task-05-missing-information": {
    eyebrow: "메타인지 판단",
    title: "주어진 정보만을 바탕으로 판단하세요.",
    context: [
      "Alex는 Jordan보다 키가 큽니다.",
      "Jordan은 Sam보다 키가 큽니다.",
    ],
    prompt: "Sam과 Taylor 중 누가 더 키가 큽니까?",
    options: {
      sam: "Sam",
      taylor: "Taylor",
      same: "키가 같습니다",
      insufficient: "정보가 충분하지 않습니다",
    },
  },
  "task-06-knowledge-transfer": {
    eyebrow: "지식 전이",
    title: "원리를 새로운 시스템에 적용하세요.",
    principle:
      "용량이 고정되어 있을 때는 수요를 재배분하는 것이 용량을 추가하는 것보다 더 효과적일 수 있습니다.",
    context: [
      "한 디지털 서비스가 평일마다 오후 8시에 과부하됩니다.",
      "이번 분기에는 새 서버를 구매할 수 없습니다.",
    ],
    prompt: "위 원리를 가장 잘 적용한 대응은 무엇입니까?",
    options: {
      visuals: "피크 시간에 사이트의 시각적 복잡성을 높인다",
      "shift-load":
        "긴급하지 않은 작업, 업데이트, 예약 처리를 피크 시간 밖으로 옮긴다",
      refresh:
        "서비스가 응답할 때까지 사용자에게 반복해서 새로고침하도록 요청한다",
      "hide-metrics": "피크 시간 동안 성능 지표를 숨긴다",
    },
  },
};
