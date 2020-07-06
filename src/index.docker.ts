import "https://deno.land/x/dotenv/load.ts";
import { cron, stop, start } from 'https://deno.land/x/deno_cron/cron.ts'
import { log } from './lib/logger.ts'
import { exists } from './lib/exists.ts'

let mainPath = "index.ts"

if (exists("./index.ts") === 'file') mainPath = "./index.ts"
else if (exists("./src/index.ts") === 'file') mainPath = "./src/index.ts"

const cronString = Deno.env.get('DDNS_CRON')
let timesFailed = 0

if (cronString) {
  log('info', ["index.docker", "start", "with cron", cronString])

  stop()
  await run() // Make sure it runs once when started
  start()

  cron(cronString, () => run())
} else {
  stop()
  log('info', ["index.docker", "start", "single-run"])
  await run()
  Deno.exit(0)
}

async function run() {
  const process = Deno.run({
    cmd: ["deno", "run", "--allow-read", "--allow-write", "--allow-net", "--allow-env", mainPath],
    env: Deno.env.toObject()
  })
  const status = await process.status()
  if (status.code === 0) {
    timesFailed = 0
    log('info', ["index.docker", "success"])
    return
  } else if (timesFailed < 3) {
    timesFailed++
    log('error', ["index.docker", "failed", "total times failed", String(timesFailed)])
  } else {
    log("warn", ["index.docker", "too many failed attempts", String(timesFailed), "exiting"])
    Deno.exit(1)
  }
}
