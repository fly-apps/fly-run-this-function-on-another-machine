import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import axios from 'axios'
import http from 'node:http'
import * as url from 'url';

const { IS_RUNNER, FLY_API_TOKEN, FLY_APP_NAME, FLY_IMAGE_REF } = process.env
const port = 5500

let processGroup
if (FLY_IMAGE_REF.includes(':deployment-')) {
  const deploymentId = FLY_IMAGE_REF.split(':deployment-').pop().toLocaleLowerCase()
  processGroup = `worker-${deploymentId}`
} else {
  processGroup = `worker-${new Buffer(FLY_IMAGE_REF).toString('base64').toLocaleLowerCase()}`
}

if (IS_RUNNER) {
  const requestHandler = (request, response) => {
    console.log(request.url)
    var body = "";

    request.on('readable', function() {
      let chunk
      if (chunk = request.read()) {
        console.log(chunk)
        body += chunk
      }
    });

    request.on('end', async function run() {
        const { filename, args } = JSON.parse(body)

        const mod = await import(filename)
        const result = await mod.default(...args)
        const jsonResponse = JSON.stringify({___result: result})
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(jsonResponse); 
        response.end(); 

        process.exit(0)
    });
  }
  
  const server = http.createServer(requestHandler)
  
  server.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
  
    console.log(`server is listening on ${port}`)
  })
}

const machinesService = axios.create({
  baseURL: `https://api.machines.dev/v1/apps/${FLY_APP_NAME}`,
  headers: { 'Authorization': `Bearer ${FLY_API_TOKEN}` }
})

export default function runOnAnotherMachine(importMeta, originalFunc) {
  if (IS_RUNNER) {
    return originalFunc
  }

  const filename = url.fileURLToPath(importMeta.url);
  // const filename = "/app/runMath.mjs"

  return async function (...args) {
    const machine = await spawnAnotherMachine()
    const res = await execOnMachine(machine, filename, args)
    return res
  }
}

async function spawnAnotherMachine () {
  const filename = url.fileURLToPath(import.meta.url);

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
          entrypoint: ['node'],
          cmd: [filename]
        }
      ],
      metadata: {
        fly_process_group: processGroup
      }
    }
  })

  const waitRes = await machinesService.get(`/machines/${machine.id}/wait?timeout=60&state=started`)

  return machine
}

async function execOnMachine(machine, filename, args) {
  const jsonArgs = JSON.stringify(args)
  
  const execRes = await axios.post(`http://${processGroup}.process.${FLY_APP_NAME}.internal:${port}`, {
    filename,
    args
  })

  return execRes.data.___result
}