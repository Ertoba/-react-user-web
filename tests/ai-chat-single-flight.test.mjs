import assert from "node:assert/strict";
import test from "node:test";
import { createSingleFlightGate } from "../src/components/ai-chatbot/singleFlightGate.mjs";

test("a chat send reserves synchronously and ignores duplicate submits", () => {
  const gate = createSingleFlightGate();
  assert.equal(gate.busy, false);
  assert.equal(gate.enter(), true);
  assert.equal(gate.busy, true);
  assert.equal(gate.enter(), false, "second Enter in same tick must be ignored");
  gate.leave();
  assert.equal(gate.busy, false);
  assert.equal(gate.enter(), true, "a reply or failure permits the next message");
  gate.leave();
});

test("independent chat launchers do not share a global request lock", () => {
  const first = createSingleFlightGate();
  const second = createSingleFlightGate();
  assert.equal(first.enter(), true);
  assert.equal(second.enter(), true);
  first.leave();
  second.leave();
});
