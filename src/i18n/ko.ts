import type { UiMessages } from "./types";

export const ko: UiMessages = {
  accessibility: {
    homeLabel: "MINDPRINT 홈",
    languageLabel: "언어",
  },
  dimensions: {
    reasoning: "추론",
    adaptiveLearning: "적응 학습",
    evidenceEvaluation: "근거 평가",
    informationFiltering: "정보 필터링",
    metacognitiveCalibration: "메타인지 보정",
    knowledgeTransfer: "지식 전이",
  },
  landing: {
    experimentalAssessment: "실험적 평가",
    cognitiveAssessment: "인지 평가",
    headline: "정답이 분명하지 않을 때, 어떻게 사고하시나요?",
    support:
      "MINDPRINT는 짧고 현대적인 평가를 통해 추론, 적응, 근거 판단, 확신 수준을 살펴봅니다.",
    beginAssessment: "평가 시작",
    scope: "범위",
    whatItMeasures: "측정 영역",
    approach: "접근 방식",
    method: "방법",
    methodBody:
      "짧은 과제에서 불완전한 정보, 바뀌는 규칙, 상충하는 근거, 확신 판단을 다룹니다. 수행 결과는 이 평가 안에서만 요약됩니다.",
    experimentalByDesign: "실험적 평가로 설계되었습니다.",
    disclaimer:
      "IQ 검사, 임상 도구, 진단 도구 또는 인구 백분위 평가가 아닙니다.",
    version: "V0.1",
  },
  assessment: {
    label: "평가",
    introTitle: "짧은 의사결정 과제들로 구성됩니다.",
    introBody:
      "자연스러운 속도로 진행하세요. 일부 과제에서는 응답에 대한 확신 정도를 묻습니다.",
    duration: "소요 시간",
    durationValue: "약 10분",
    tasks: "과제",
    startAssessment: "평가 시작",
    exit: "나가기",
    continue: "계속",
    confidence: "확신도",
    low: "낮음",
    high: "높음",
    confidenceAriaValue: "확신도 {value}퍼센트",
    selectOneResponse: "응답 하나를 선택하세요",
    progressLabel: "평가 진행 상황",
    ruleUpdate: "규칙 변경",
    principle: "원리",
    automatedAnalysis: "자동 분석",
    claim: "주장",
    rankingInstructions:
      "1 = 가장 영향력이 큼. 위/아래 버튼으로 순서를 조정하세요.",
    moveUp: "위로",
    moveDown: "아래로",
    moveUpLabel: "{item} 위로 이동",
    moveDownLabel: "{item} 아래로 이동",
  },
  results: {
    headerLabel: "인지 프로필",
    assessmentComplete: "평가 완료",
    title: "인지 프로필",
    subtitle: "이번 평가 세션의 수행 요약입니다.",
    averageConfidence: "평균 확신도",
    responseAccuracy: "응답 정확도",
    calibrationGap: "보정 차이",
    points: "점",
    observedStrengths: "관찰된 강점",
    confidenceCalibration: "확신도 보정",
    assessmentNote: "평가 참고",
    retakeAssessment: "다시 평가하기",
    copySummary: "요약 복사",
    copied: "복사됨",
    preparing: "인지 프로필을 준비하고 있습니다",
    processingPerformance: "과제 수행 결과 요약",
    processingCalibration: "확신도와 관찰된 정확도 비교",
    processingScores: "영역별 점수 준비",
    methodNote:
      "방법 참고: 이 점수는 본 실험적 프로토타입 안에서의 수행을 요약합니다. 표준화된 IQ 점수, 임상적 소견 또는 인구 백분위가 아닙니다. 각 언어 버전은 동일한 과제 의도를 유지하도록 현지화되었지만, 언어 간 점수 동등성은 아직 확립되지 않았습니다.",
    strengthEven:
      "이 평가에서 측정된 영역 전반의 수행이 비교적 고르게 나타났습니다.",
    strengthComparative:
      "응답 결과, 이 평가에서는 {dimensions} 영역에서 상대적으로 강한 수행이 나타났습니다.",
    calibrationClose:
      "표시한 확신도는 전반적으로 관찰된 과제 수행과 밀접하게 일치했습니다.",
    calibrationSomeDistance:
      "표시한 확신도와 관찰된 과제 수행 사이에 어느 정도 차이가 있었습니다.",
    calibrationNoticeable:
      "보정이 측정된 과제에서 표시한 확신도와 관찰된 수행 사이에 눈에 띄는 차이가 있었습니다.",
    assessmentNoteBody:
      "점수는 이 6개 과제로 구성된 실험적 프로토타입의 수행을 반영하며, 안정적인 특성보다는 과제 수준의 신호로 해석해야 합니다.",
    summaryTitle: "MINDPRINT — 인지 프로필",
  },
};
