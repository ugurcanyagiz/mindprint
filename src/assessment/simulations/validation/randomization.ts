function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function next() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const random = mulberry32(hashString(seed));
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function assignFormOrder(
  participantSessionId: string,
  studyVersion: string,
): ["A", "B"] | ["B", "A"] {
  const order = seededShuffle(
    ["A", "B"] as const,
    `${studyVersion}::${participantSessionId}::form-order`,
  );
  return order[0] === "A" ? ["A", "B"] : ["B", "A"];
}

export function assignedFormLabel(
  environmentId: string,
  participantSessionId: string,
  studyVersion: string,
): "A" | "B" {
  const order = assignFormOrder(
    `${participantSessionId}::${environmentId}`,
    studyVersion,
  );
  return order[0];
}
