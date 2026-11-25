import { describe, it, expect } from "vitest";
import { History, type Command } from "@/engine/history/history";

function counterCmd(state: { n: number }, by: number, bytes = 0): Command {
  return {
    id: String(Math.random()), type: "inc", timestamp: Date.now(), bytes,
    execute: () => { state.n += by; },
    undo: () => { state.n -= by; },
  };
}

describe("History", () => {
  it("undoes and redoes", () => {
    const s = { n: 0 }; const h = new History();
    h.run(counterCmd(s, 2)); h.run(counterCmd(s, 3));
    expect(s.n).toBe(5);
    h.undo(); expect(s.n).toBe(2);
    h.redo(); expect(s.n).toBe(5);
  });

  it("drops the redo branch after a new command", () => {
    const s = { n: 0 }; const h = new History();
    h.run(counterCmd(s, 1)); h.run(counterCmd(s, 1));
    h.undo(); h.run(counterCmd(s, 10));
    expect(h.canRedo).toBe(false);
    expect(s.n).toBe(11);
  });

  it("trims oldest commands over the memory budget but keeps the newest", () => {
    const s = { n: 0 }; const h = new History(100);
    for (let i = 0; i < 5; i++) h.run(counterCmd(s, 1, 60));
    expect(h.size).toBe(1);
    expect(h.canUndo).toBe(true);
  });
});
