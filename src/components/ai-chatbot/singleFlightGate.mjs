/**
 * A synchronous in-flight gate. React state is asynchronous, so checking a
 * pending/loading state does not prevent two keyboard handlers in one tick
 * from sending the same chat text twice.
 */
export function createSingleFlightGate() {
  let busy = false;
  return {
    enter() {
      if (busy) return false;
      busy = true;
      return true;
    },
    leave() { busy = false; },
    get busy() { return busy; },
  };
}
