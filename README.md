## Fly.io: Run this function in another machine

This is a simple example on how to spawn a machine and run a function from there.

Your app will need a Fly token to be able to spawn new machines.

## Deploying this demo

First launch this app.

```sh
$ fly launch --copy-config --no-public-ips --no-deploy

Creating app in /Users/lubien/workspace/run-this-on-another-machine
Scanning source code
Detected a Dockerfile app
? Choose an app name (leave blank to generate one): another-machines
? Select Organization: Lubien (personal)
? Choose a region for deployment: Sao Paulo, Brazil (gru)
App will use 'gru' region as primary
```

The let's set the deploy token

```sh
$ fly secrets set FLY_API_TOKEN=$(fly auth token)
Secrets are staged for the first deployment
```

Make your first deployment and remember the machine ID.

```sh
$ fly deploy

...
Watch your app at https://fly.io/apps/another-machines/monitoring

Updating existing machines in 'another-machines' with rolling strategy
  Machine 3287114c3d7085 [app] has state: started
  [1/1] Checking that 3287114c3d7085 [app] is up and running
  Finished deploying
```

SSH into the main machine and run `node /app/index.mjs`

```sh
$ fly ssh console -s
? Select VM: gru: 3287114c3d7085 fdaa:0:3335:a7b:1f60:1b01:ce26:2 muddy-violet-4491
Connecting to fdaa:0:3335:a7b:1f60:1b01:ce26:2... complete

root@3287114c3d7085:/app# node /app/index.mjs 
```

If you look into your app Monitoring page, there will be a new machine.

## Next steps:

- Stop machines after they're done
- Reuse stopped machines