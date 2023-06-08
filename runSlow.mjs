import runOnAnotherMachine from "./runOnAnotherMachine.mjs"

export default runOnAnotherMachine(async function runMath(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b)
    }, 5000)
  })
}, {
  meta: import.meta,
  guest: {
    cpu_kind: "shared",
    cpus: 2,
    memory_mb: 1024
  }
})
