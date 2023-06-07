import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import axios from 'axios'
import * as url from 'url';

const { IS_RUNNER, FLY_API_TOKEN, FLY_APP_NAME, FLY_IMAGE_REF } = process.env

const machinesService = axios.create({
  baseURL: `https://api.machines.dev/v1/apps/${FLY_APP_NAME}`,
  headers: { 'Authorization': `Bearer ${FLY_API_TOKEN}` }
})

export default function runOnAnotherMachine(importMeta, originalFunc) {
  if (IS_RUNNER) {
    return originalFunc
  }

  const filename = url.fileURLToPath(importMeta.url);

  return async function (...args) {
    const machine = await spawnAnotherMachine()
    const res = await execOnMachine(machine, filename, args)
    return res
  }
}

async function spawnAnotherMachine () {
  const {data: machine} = await machinesService.post('/machines', {
    config: {
      auto_destroy: true,
      image: FLY_IMAGE_REF,
      env: {
        IS_RUNNER: "1"
      },
      processes: [
        {
          name: "runner",
          entrypoint: ['tail'],
          cmd: ['-f', "/dev/null"]
        }
      ]
    }
  })

  const waitRes = await machinesService.get(`/machines/${machine.id}/wait?timeout=60&state=started`)

  return machine
}

async function execOnMachine(machine, filename, args) {
  const jsonArgs = JSON.stringify(args)

  const code = `(async function () {
    const mod = await import('${filename}')
    const args = ${jsonArgs}
    const result = await mod.default(...args)
    const jsonResponse = JSON.stringify({___result: result})
    return console.log(jsonResponse)
  })()`

  const cmd = `node --eval="${code}"`
  const execRes = await machinesService.post(`/machines/${machine.id}/exec`, {
    cmd
  })

  const final = JSON.parse(execRes.data.stdout)
  return final.___result
}