import type { UiMessages } from "./types";

export const es: UiMessages = {
  accessibility: {
    homeLabel: "Inicio de MINDPRINT",
    languageLabel: "Idioma",
  },
  dimensions: {
    reasoning: "Razonamiento",
    adaptiveLearning: "Aprendizaje Adaptativo",
    evidenceEvaluation: "Evaluación de Evidencia",
    informationFiltering: "Filtrado de Información",
    metacognitiveCalibration: "Calibración Metacognitiva",
    knowledgeTransfer: "Transferencia de Conocimiento",
  },
  landing: {
    experimentalAssessment: "Evaluación experimental",
    cognitiveAssessment: "Evaluación cognitiva",
    headline: "¿Cómo piensas cuando la respuesta no es evidente?",
    support:
      "MINDPRINT examina el razonamiento, la adaptación, la evaluación de evidencia y la confianza mediante una breve evaluación moderna.",
    beginAssessment: "Comenzar evaluación",
    scope: "Alcance",
    whatItMeasures: "Qué mide",
    approach: "Enfoque",
    method: "Método",
    methodBody:
      "Tareas breves presentan información incompleta, reglas cambiantes, evidencia en conflicto y juicios de confianza. El rendimiento se resume dentro de esta evaluación.",
    experimentalByDesign: "Experimental por diseño.",
    disclaimer:
      "No es una prueba de CI, un instrumento clínico, una herramienta diagnóstica ni una evaluación de percentiles poblacionales.",
    version: "V0.1",
  },
  assessment: {
    label: "Evaluación",
    introTitle: "Una breve serie de tareas de decisión.",
    introBody:
      "Avanza a un ritmo natural. Algunas tareas preguntan cuánta confianza tienes en tu respuesta.",
    duration: "Duración",
    durationValue: "~10 minutos",
    tasks: "Tareas",
    startAssessment: "Comenzar evaluación",
    exit: "Salir",
    continue: "Continuar",
    confidence: "Confianza",
    low: "Baja",
    high: "Alta",
    confidenceAriaValue: "{value} por ciento de confianza",
    selectOneResponse: "Selecciona una respuesta",
    progressLabel: "Progreso de la evaluación",
    ruleUpdate: "Cambio de regla",
    principle: "Principio",
    automatedAnalysis: "Análisis automatizado",
    claim: "Afirmación",
    rankingInstructions:
      "1 = mayor influencia. Usa Subir y Bajar para cambiar el orden.",
    moveUp: "Subir",
    moveDown: "Bajar",
    moveUpLabel: "Subir {item}",
    moveDownLabel: "Bajar {item}",
  },
  results: {
    headerLabel: "Perfil cognitivo",
    assessmentComplete: "Evaluación completada",
    title: "Perfil Cognitivo",
    subtitle: "Resumen del rendimiento en esta sesión de evaluación.",
    averageConfidence: "Confianza promedio",
    responseAccuracy: "Precisión de respuestas",
    calibrationGap: "Brecha de calibración",
    points: "pts",
    observedStrengths: "Fortalezas observadas",
    confidenceCalibration: "Calibración de confianza",
    assessmentNote: "Nota de evaluación",
    retakeAssessment: "Repetir evaluación",
    copySummary: "Copiar resumen",
    copied: "Copiado",
    preparing: "Preparando tu perfil cognitivo",
    processingPerformance: "Resumiendo el rendimiento en las tareas",
    processingCalibration: "Comparando confianza con precisión observada",
    processingScores: "Preparando puntuaciones por dimensión",
    methodNote:
      "Nota metodológica: Estas puntuaciones resumen el rendimiento dentro de este prototipo experimental. No son puntuaciones de CI estandarizadas, hallazgos clínicos ni percentiles poblacionales. Las versiones lingüísticas están adaptadas para mantener una intención de tarea equivalente, pero aún no se ha establecido la equivalencia de puntuaciones entre idiomas.",
    strengthEven:
      "El rendimiento fue relativamente uniforme entre las dimensiones medidas en esta evaluación.",
    strengthComparative:
      "Tus respuestas mostraron un rendimiento comparativamente fuerte en {dimensions} dentro de esta evaluación.",
    calibrationClose:
      "Tu confianza declarada siguió de cerca el rendimiento observado en las tareas.",
    calibrationSomeDistance:
      "Tu confianza declarada mostró cierta distancia respecto al rendimiento observado en las tareas.",
    calibrationNoticeable:
      "Tu confianza declarada varió de forma notable respecto al rendimiento observado en las tareas calibradas.",
    assessmentNoteBody:
      "Las puntuaciones reflejan el rendimiento en este prototipo experimental de seis tareas y deben interpretarse como señales de tarea, no como rasgos estables.",
    summaryTitle: "MINDPRINT — Perfil Cognitivo",
  },
};
