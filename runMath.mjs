import runOnAnotherMachine from "./runOnAnotherMachine.mjs"

export default runOnAnotherMachine(import.meta, function runMath(a, b) {
  return a + b
})
