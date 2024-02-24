import flame from "./flame.mjs"

/*
  This default export is the RESULT of `runOnAnotherMachine`;
  `runOnAnotherMachine` returns one of two functions:
      1. If the current process is not a "runner" Machine, it boots up a new machine 
         and returns a function that will execute the original function on that machine.
      2. If the current process IS on a "runner" Machine, it returns the original function
 */
export default flame((a, b) => {
  return a + b
}, {
  path: import.meta.url,
  guest: {
    cpu_kind: "shared",
    cpus: 2,
    memory_mb: 1024
  }
})
