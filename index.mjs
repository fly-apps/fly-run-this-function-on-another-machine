import runMath from './runMath.mjs'

async function main() {
  const result = await runMath(100, 20);
  console.log(result)
}

main()