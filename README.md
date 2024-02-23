## FLAME for JavaScript: Run a function on another Machine

![Bird throwing fireballs](./javascript-flame-throwing-bird.jpg)

This is a simple example app demonstrating how to run a particular function on a temporary copy of your app, using the FLAME pattern. Checkout the blog post that explains this code in more detail: https://fly.io/javascript-journal/flame-for-javascript-rethinking-serverless

FLAME (Fleeting Lambda Application for Modular Execution), which was first introduced by Chris McCord, creator of the Phoenix framework, was originally demo'ed in an Elixir library. This app is a case study on how it can be implemented in vanilla JavaScript. FLAME is a new way to horizontally auto-scale your application code in a more modular way. You can read more about it in Chris's post here: https://fly.io/blog/rethinking-serverless-with-flame/

## Prerequisites

While FLAME is a cloud-provider-agnostic pattern, this project uses Fly.io's Machines API to auto-scale your code. As such, **your app will need a [Fly token](https://fly.io/docs/flyctl/auth-token/) to be able to spawn new machines.**

If you already have the `flyctl` CLI installed, you can run the following to obtain a new token:

```cmd
$ flyctl auth token [flags]
```

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

- ~~Stop machines after they're done~~
- ~~Reuse stopped machines~~
- Pool machines?