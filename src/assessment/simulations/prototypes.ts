import {
  attentionForms,
  evidenceForms,
  hiddenSystemForms,
} from "./validation/forms";

export const dynamicAttentionPrototype = attentionForms[0].prototype;
export const hiddenSystemPrototype = hiddenSystemForms[0].prototype;
export const evidenceStreamPrototype = evidenceForms[0].prototype;

export const simulationPrototypes = [
  dynamicAttentionPrototype,
  hiddenSystemPrototype,
  evidenceStreamPrototype,
];
