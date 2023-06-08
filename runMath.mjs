import runOnAnotherMachine from "./runOnAnotherMachine.mjs"

export default runOnAnotherMachine(function runMath(a, b) {
  return a + b
}, {
  meta: import.meta,
  guest: {
    cpu_kind: "shared",
    cpus: 2,
    memory_mb: 1024
  }
})
