import type { AssessmentLocaleContent } from "./types";

export const esAssessment: AssessmentLocaleContent = {
  "task-01-information-filtering": {
    eyebrow: "Filtrado de información",
    title: "Identifica las señales más importantes.",
    context:
      "Una empresa de software por suscripción informa los siguientes cambios trimestrales.",
    prompt:
      "¿Qué DOS métricas merecen más atención antes de concluir que el crecimiento es saludable?",
    metrics: {
      revenue: "Ingresos",
      customers: "Clientes",
      "operating-margin": "Margen operativo",
      "marketing-expense": "Gasto de marketing",
      churn: "Tasa de abandono",
      headcount: "Plantilla",
    },
  },
  "task-02-reasoning": {
    eyebrow: "Razonamiento",
    title: "Evalúa la conclusión, no la redacción.",
    analysis:
      "Las ventas aumentaron un 20% y los costos un 10%; por lo tanto, la rentabilidad necesariamente mejoró.",
    prompt: "¿Cómo debe evaluarse esta conclusión?",
    options: {
      supported: "Respaldada",
      "probably-supported": "Probablemente respaldada",
      insufficient: "Información insuficiente",
      "probably-unsupported": "Probablemente no respaldada",
      unsupported: "No respaldada",
    },
  },
  "task-03-evidence-evaluation": {
    eyebrow: "Evaluación de evidencia",
    title: "Pondera la evidencia por su valor para la decisión.",
    context: "Un nuevo suplemento mejora la memoria en un 40%.",
    prompt:
      "Ordena las fuentes de mayor a menor influencia para tu decisión.",
    items: {
      "viral-video": {
        label: "Video viral",
        detail: "2,1 M de vistas · no muestra métodos",
      },
      "manufacturer-study": {
        label: "Estudio financiado por el fabricante",
        detail: "n=48 · resultado positivo",
      },
      "observational-study": {
        label: "Estudio observacional independiente",
        detail: "n=1.200 · asociación pequeña",
      },
      rct: {
        label: "Ensayo controlado aleatorizado independiente",
        detail: "n=8.400 · sin efecto significativo",
      },
    },
  },
  "task-04-adaptive-rule": {
    eyebrow: "Aprendizaje adaptativo",
    title: "Infiere la regla de transformación.",
    phaseA: { prompt: "RIN + 5 → ?" },
    phaseB: { prompt: "Con la regla actualizada, RIN + 6 → ?" },
  },
  "task-05-missing-information": {
    eyebrow: "Juicio metacognitivo",
    title: "Razona solo a partir de lo que se conoce.",
    context: [
      "Alex es más alto que Jordan.",
      "Jordan es más alto que Sam.",
    ],
    prompt: "¿Quién es más alto: Sam o Taylor?",
    options: {
      sam: "Sam",
      taylor: "Taylor",
      same: "Tienen la misma altura",
      insufficient: "No hay suficiente información",
    },
  },
  "task-06-knowledge-transfer": {
    eyebrow: "Transferencia de conocimiento",
    title: "Aplica el principio a un sistema nuevo.",
    principle:
      "Cuando la capacidad es fija, redistribuir la demanda a veces puede ser más eficaz que añadir capacidad.",
    context: [
      "Un servicio digital se sobrecarga todos los días laborables a las 8 PM.",
      "No se pueden comprar nuevos servidores este trimestre.",
    ],
    prompt: "¿Qué respuesta aplica mejor el principio anterior?",
    options: {
      visuals:
        "Aumentar la complejidad visual del sitio durante las horas punta",
      "shift-load":
        "Mover tareas no urgentes, actualizaciones y procesos programados fuera de las horas punta",
      refresh:
        "Pedir a los usuarios que actualicen repetidamente hasta que el servicio responda",
      "hide-metrics":
        "Ocultar las métricas de rendimiento durante los períodos punta",
    },
  },
};
