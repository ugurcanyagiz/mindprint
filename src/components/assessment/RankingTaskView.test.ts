import { describe, expect, it } from "vitest";

import { moveRankedItem } from "./RankingTaskView";

describe("ranking interaction", () => {
  const order = ["a", "b", "c", "d"];

  it("moves an item one position in either direction", () => {
    expect(moveRankedItem(order, 2, -1)).toEqual(["a", "c", "b", "d"]);
    expect(moveRankedItem(order, 1, 1)).toEqual(["a", "c", "b", "d"]);
  });

  it("does not mutate the original order", () => {
    moveRankedItem(order, 1, 1);
    expect(order).toEqual(["a", "b", "c", "d"]);
  });

  it("leaves boundary items in place", () => {
    expect(moveRankedItem(order, 0, -1)).toBe(order);
    expect(moveRankedItem(order, order.length - 1, 1)).toBe(order);
  });
});
