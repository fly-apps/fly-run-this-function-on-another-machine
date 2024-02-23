import flame from "./flame.mjs"

export default flame(async function runMath(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b)
    }, 5000)
  })
}, {
  path: import.meta.url,
  guest: {
    cpu_kind: "shared",
    cpus: 2,
    memory_mb: 1024
  }
})
